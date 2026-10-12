package agent

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Autumn-27/artex/db"
	"github.com/Autumn-27/norma/agentcore"
	"github.com/Autumn-27/norma/llm"
	acperm "github.com/Autumn-27/norma/permission"
	actool "github.com/Autumn-27/norma/tool"
	"github.com/Autumn-27/norma/transcript"
)

// goalsDefaultTmpl is the built-in EDITABLE body (段 [A]) of the goals-decomposer
// prompt, seeded into agent_prompts. No template vars are used today.
const goalsDefaultTmpl = `You are a penetration test goal decomposer. Your job is to identify the **final results to be achieved** from the user's input — not to plan attack steps.

**Step one (do this before splitting goals): extract operational constraints**
From the "task goal / task description", identify the operator's explicit rules on 【which operations may and may not be performed】, and register them one by one with set_constraints (if the description and goal involve no operational constraints, you may skip extracting constraints):
- type=deny: forbidden operations (e.g. "do not scan ports", "no write/delete operations against production", "no brute forcing", "do not touch a certain subdomain").
- type=allow: an explicitly allowed/limited scope of operations (e.g. "passive recon only", "only target a certain domain").
- A constraint ≠ a goal, and ≠ an attack step: it is a rule on the boundary of operational behavior.
- **Constraints must be 【self-contained, with the concrete target hard-coded】**: replace **referring expressions** such as "the current target / current port / current IP / current domain / this site" with the **concrete values** from the task goal/description. Constraints are injected separately into execution-stage prompts, and out of context a referring expression cannot tell what it refers to.
  Example: the target is https://abc.example.net → write "only testing abc.example.net is allowed" rather than "only testing the current target is allowed"; "only test target port 443, do not scan other ports" rather than "only test the current port". If the original text only says "the current target" but the target address is clear, fill in the address.
- **Register only constraints 【explicitly stated or emphasized】 in the goal/description — never invent any**; when unsure of the type, use deny (more conservative).
- If the goal/description truly contains no operational constraints, **do not** call set_constraints.
After registering constraints (if any), proceed to split the goals below.

**Goal = a final deliverable/verifiable result**

**What is NOT a goal (never list these as sub-goals)**:
- Information gathering, reconnaissance, endpoint scanning
- Vulnerability analysis and verification process
- Attack steps, exploitation techniques
- Result verification steps

**Splitting principles**:
- The user describes only one final goal → output one
- There are multiple **mutually independent** final deliverables → list them separately
- Annotate vulnclass where it maps to a clear vulnerability class; leave it empty for information-gathering/business-logic goals
- Never invent goals the user did not mention

Call set_goals to submit the result.`

// goalsScopeTail is the code-owned tail appended after the editable goals body
// WHEN an asset store + task context are available. It teaches the decomposer to
// also lift the explicit asset scope out of the goal/description and register it
// via add_task_scope. Kept in code (not the DB-editable body) so it always applies
// on released DBs and can't be edited away — same pattern as the trafficTool tail.
const goalsScopeTail = `

**Additional duty: register the test asset scope**
Besides splitting goals, you must also identify the **explicitly given test asset scope** from the "task goal / task description" and register it with add_task_scope (this is the task's authorization boundary, and also the denominator of asset test coverage). **Minimal-scope principle: register only the one target the user explicitly named — never enlarge it on your own.**
- The target is a URL or an address with a hostname (e.g. https://xxx.example.com/path, app.example.com) → take its **full hostname**, kind=subdomain, value=full hostname.
  Example: target https://a1b2c3.lab.example.net/path → kind=subdomain, value=a1b2c3.lab.example.net (**not** example.net).
  **Never** shorten a hostname with subdomains to its root domain — registering the whole example.com upon seeing xxx.example.com expands the scope beyond the user's target and violates the minimal-scope principle.
- Only when the user gives a **bare root domain without any subdomain** (e.g. writes example.com directly), or explicitly says "the whole site / all subdomains / the entire domain" → use kind=root_domain, value=example.com.
- A plain IP or network range → kind=ip / cidr, value=IP or CIDR.
- **Do not** register a company scope (company) — the task was just created and the company usually does not exist in the asset system yet, so it cannot be registered; company-level scope is handled by the later plan stage.
Other rules:
- Register only scope **explicitly written in the goal/description**; never invent or infer domains/IPs that were not mentioned.
- In reason, briefly state which sentence the basis comes from, for auditability.
- If the goal/description contains no explicit asset scope, **do not** call add_task_scope.
First register the scope with add_task_scope (if any), then call set_goals to submit the goals.`

// GoalSpec is one decomposed objective.
type GoalSpec struct {
	Text      string `json:"text"`
	VulnClass string `json:"vulnclass,omitempty"`
}

// DecomposeGoals asks the LLM to break a pentest task goal into discrete,
// independently-verifiable objectives (each becomes a goal node). Returns nil if
// no provider is configured or the call yields nothing — the caller then falls
// back to a rule-based split so goal nodes always exist.
//
// prov is supplied by the caller (rather than built here from a Config) so goal
// decomposition rides the SAME provider instance as the rest of the engine — it
// shares the rate limiter, gets recorded by llmrec, and participates in LLM
// failover instead of quietly bypassing all three.
//
// desc is the task's free-text description (背景：靶标范围/flag 数量/交战说明等).
// It is fed alongside the goal so the decomposer no longer splits blind — the
// prompt still forbids inventing anything the two texts don't state.
//
// emit, when non-nil, receives every LLM step (thinking/tool_use/result) with
// Worker="planner" so the round-0 goal-decomposition activity is visible in the UI.
//
// as + taskID, when non-nil/positive, wire the add_task_scope tool so the
// decomposer can register the explicit asset scope it extracts from the goal.
//
// ts is the task's exploration store: set_goals writes the decomposed goal nodes
// straight into it (the same managed tool the main agent uses to add goals at
// runtime). The returned specs are read back from the store so callers can emit
// per-goal activity and detect the "LLM produced nothing" case for their fallback.
func DecomposeGoals(ctx context.Context, prov llm.Provider, dataDir, goalText, desc string, as *db.AssetStore, ts *db.ExplorationStore, taskID int64, emit func(db.Activity)) []GoalSpec {
	if prov == nil {
		return nil
	}
	return DecomposeGoalsWithProvider(ctx, prov, dataDir, goalText, desc, as, ts, taskID, false, 0, emit)
}

// DecomposeGoalsWithProvider is the task-runtime variant used when a task has an
// ordered provider chain. It preserves the same tools and write behavior while
// letting the caller own provider selection/failover. maxTokens is the profile's
// per-reply output cap (0 = send none).
func DecomposeGoalsWithProvider(ctx context.Context, prov llm.Provider, dataDir, goalText, desc string, as *db.AssetStore, ts *db.ExplorationStore, taskID int64, nonStreaming bool, maxTokens int, emit func(db.Activity)) []GoalSpec {
	if prov == nil {
		return nil
	}
	// 目标拆解是一次性调用：不挂 transcript store，所以 agentcore 不会往 ctx 上挂
	// session id（它只在有 writer 时才挂，见 agentcore.Prompt）。而按 session-id 头
	// 做提示缓存/粘性路由的网关（opencode zen 缺 x-opencode-session 直接 400
	// MissingSessionID）读的就是 ctx 上这个值——不补就是「对话正常、拆解 400」。
	// 显式挂一个稳定 id：同一探索的拆解请求共享它（利于命中缓存），且命名与
	// planner/worker 不冲突，能被 llmrec.parseSession 正确归因。
	if ts != nil {
		ctx = transcript.WithSessionID(ctx, fmt.Sprintf("exp%d-goals", ts.ID()))
	}
	// worker="goals" tags the goal nodes' provenance; ts/taskID let set_goals link
	// each goal under the task root. This is the catalog's real set_goals tool, so a
	// web-edited description/schema on it applies here too.
	tsx := &ToolSet{as: as, ts: ts, taskID: taskID, worker: "goals"}
	// Description rides in the user message (same channel as the goal), NOT via the
	// {{.EngagementDescription}} template var — else a prompt that references the var
	// would inject the description twice. System prompt stays pure static instructions.
	sys := renderSystem("goals", goalsDefaultTmpl, GoalsVars{DataDir: dataDir, Now: nowStr()})
	// set_constraints 始终可用(不依赖 asset store):正文已含「先抽操作约束再拆目标」这步
	// (可在 agent 编辑页改措辞),这里只需接上工具。
	tools := []actool.CoreTool{tsx.setGoals(), tsx.setConstraints()}
	// Wire add_task_scope only when we have a real asset store + task to write to.
	// The scope-extraction tail is appended in lockstep so the prompt never asks for
	// a tool that isn't present.
	if as != nil && taskID > 0 {
		tools = append(tools, tsx.addTaskScope())
		sys += goalsScopeTail
	}
	userMsg := "Task goal:\n" + goalText
	if d := strings.TrimSpace(desc); d != "" {
		userMsg += "\n\nTask description (background info; may include target scope / number of flags / rules of engagement; for reference only — do not invent anything it does not mention):\n" + d
	}
	// Use captureRun so every LLM step is emitted as an activity record (visible in
	// the plan tab under the round-0 marker). Falls back gracefully when emit is nil.
	captureEmit := func(r db.Activity) {
		if emit != nil {
			r.Worker = "planner"
			emit(r)
		}
	}
	captureRun(ctx, agentcore.Options{
		Provider:               prov,
		SystemPrompt:           []string{sys},
		Tools:                  tools,
		PermissionMode:         acperm.ModeBypass,
		DisableBackgroundTasks: true,
		// 3 步(抽约束 → 登记范围 → 拆目标)各需一次工具调用,给足回合避免收尾前漏调 set_goals。
		MaxTurns:     8,
		NonStreaming: nonStreaming, // 该 profile 选非流式时走 Provider.Complete
		MaxTokens:    maxTokens,    // 0 = 不发上限,由服务端默认值决定
	}, userMsg, captureEmit)
	// set_goals persisted the goals directly; read them back so the caller sees what
	// was written (empty slice ⇒ the LLM produced nothing ⇒ caller falls back).
	if ts == nil {
		return nil
	}
	nodes, _ := ts.ListByKind(db.KindGoal, 10000)
	var out []GoalSpec
	for _, n := range nodes {
		var p struct {
			Text      string `json:"text"`
			VulnClass string `json:"vulnclass"`
		}
		_ = json.Unmarshal(n.Payload, &p)
		if strings.TrimSpace(p.Text) != "" {
			out = append(out, GoalSpec{Text: p.Text, VulnClass: p.VulnClass})
		}
	}
	return out
}
