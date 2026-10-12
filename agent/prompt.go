package agent

import (
	"bytes"
	"text/template"
	"time"
)

// PromptOverride, if set, returns the stored system-prompt template for an agent
// key and whether one exists. The server wires it to the PG agent_prompts table.
// When nil or no override exists, agents use their built-in default prompt — so
// behavior is identical until a user edits a prompt in the UI.
var PromptOverride func(agentKey string) (string, bool)

// OutputLanguage, if set, returns the configured language for human-readable agent
// output ("en", "pt-BR", "zh-CN"). renderSystem appends a matching directive after
// the (editable) prompt body so the choice applies to built-in and custom agents
// alike, without users having to edit every prompt. Nil or "" → no directive.
var OutputLanguage func() string

var languageNames = map[string]string{
	"en":    "English",
	"pt-BR": "Brazilian Portuguese (pt-BR)",
	"zh-CN": "Simplified Chinese (zh-CN)",
}

// languageDirective is the code-owned tail that pins the output language.
func languageDirective() string {
	if OutputLanguage == nil {
		return ""
	}
	name, ok := languageNames[OutputLanguage()]
	if !ok {
		return ""
	}
	return "\n\n━━ Output language ━━\n" +
		"Write everything meant for a human reader — chat replies, summaries, todo items, finding summaries and notes, reports, retest conclusions — in " + name + ". " +
		"Keep tool names, tool arguments, code, commands, payloads, HTTP requests/responses, file paths and other technical identifiers verbatim; do not translate data you quote."
}

// Prompt-variable structs — fields mirror each agent's catalog (docs §5a) so a
// user template referencing a catalog variable renders; referencing anything else
// fails template execution and falls back to the built-in default.
type PlannerVars struct{ Goal, Scope, AssetSummary, DataDir, Now string }
type WorkerVars struct{ ProxyAddr, WorkerName, DataDir, Now string }
type MainVars struct{ Goal, AssetSummary, FindingsSummary, DataDir, Now string }
type GoalsVars struct{ EngagementDescription, DataDir, Now string }

// nowStr is the server-local wall-clock string exposed as the universal {{.Now}}
// prompt variable. renderSystem runs on every agent turn/round, so this is fresh
// each run — a prompt can subtract it from a fixed start stamp to reason about
// elapsed time (e.g. a timed benchmark's "last N hours" window).
func nowStr() string { return time.Now().Format("2006-01-02 15:04:05 MST") }

// renderSystem returns the rendered system-prompt BODY (段 [A]) for agentKey.
// Precedence: the DB-stored template (if any) over the built-in default template
// (def). BOTH are Go templates now — the built-in default is seeded into the DB
// verbatim, so the two paths render identically until a user edits the prompt.
// Rendering always runs (def used to be pre-substituted plain text; it is now a
// {{.Var}} template like the DB one). On any render error we fall back to the
// default template, then to the raw default string — an agent never starts with a
// half-rendered prompt. Callers append the code-owned tail (trafficTool / 中间产物
// 输出规约) AFTER this, so those can't be edited away via the DB body.
func renderSystem(agentKey, def string, vars any) string {
	tmpl := def
	if PromptOverride != nil {
		if t, ok := PromptOverride(agentKey); ok && t != "" {
			tmpl = t
		}
	}
	lang := languageDirective()
	if out, err := renderTmpl(tmpl, vars); err == nil {
		return out + lang
	}
	// DB template broke (e.g. references an out-of-catalog var) → code default.
	if out, err := renderTmpl(def, vars); err == nil {
		return out + lang
	}
	return def + lang
}

func renderTmpl(tmpl string, vars any) (string, error) {
	t, err := template.New("p").Option("missingkey=error").Parse(tmpl)
	if err != nil {
		return "", err
	}
	var b bytes.Buffer
	if err := t.Execute(&b, vars); err != nil {
		return "", err
	}
	return b.String(), nil
}
