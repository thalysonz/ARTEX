package agent

import (
	"context"
	"errors"
	"fmt"
)

// AbortCause names why an agent run's context was cancelled. Every cancellation
// site should attach one so the activity trace can report the real initiator.
type AbortCause struct {
	Code  string
	Short string
	Text  string
}

func (c *AbortCause) Error() string { return c.Text }

func cause(code, short, text string) *AbortCause {
	return &AbortCause{Code: code, Short: short, Text: text}
}

// Causef builds a cause that includes runtime-specific detail.
func Causef(code, short, format string, args ...any) *AbortCause {
	return &AbortCause{Code: code, Short: short, Text: fmt.Sprintf(format, args...)}
}

var (
	// Task-level execution context.
	AbortPausedByUser = cause("paused_by_user", "User paused the task",
		"The user paused the task via the task control API (POST /api/tasks/{id}/control, action=pause). This Planner/Worker run was deliberately cancelled; running intents go back to the frontier (open) and are reclaimed and re-executed from scratch once the task resumes")
	AbortPausedByOrchestrator = cause("paused_by_orchestrator", "Orchestrator Agent paused the task",
		"The Orchestrator Agent called the pause_task tool to pause this task. This Planner/Worker run was deliberately cancelled; running intents go back to the frontier (open) and are re-executed after resuming")
	AbortTaskDeleted = cause("task_deleted", "Task was deleted",
		"The task is being deleted (DELETE /api/tasks/{id}); the deletion barrier cancelled the task's running Planner, Workers and Main Agent. The results of this run will not be used")
	AbortPausedOnReload = cause("paused_on_reload", "Backend restored task's paused state",
		"On startup the backend restored the task's paused state from the status persisted in the database. This run was cancelled; normally no Agent is running during the restore phase")
	AbortGoalMet = cause("goal_met", "Planner judged the task goal met",
		"The Planner judged the task goal met and set the task to done, then cancelled the Workers still running; those intents are marked stopped, not failed")
	AbortSettleDrainTimeout = cause("settle_drain_timeout", "Timeout wrap-up wait time exhausted",
		"After the task hit its timeout, it waited for running Workers to wrap up gracefully, but the 90-second drain grace period was not enough, so a hard cancel was performed; intents are marked exhausted, and facts and assets already written during wrap-up are kept")

	// Per-work context.
	AbortKilledByPlanner = cause("killed_by_planner", "Planner killed this intent",
		"The Planner called kill_work to deliberately terminate this intent, usually meaning it went off track or is no longer worth continuing; the intent is marked stopped and will not be reclaimed automatically")
	AbortWorkPausedByUser = cause("work_paused_by_user", "User paused this Worker intent",
		"The user paused the running Worker. This call was cancelled and the intent became paused; all registered intents, facts, findings and activity records are kept, and it is re-executed from scratch after resuming")
	AbortWorkCancelledByUser = cause("work_cancelled_by_user", "User deleted this Worker intent",
		"The user deleted the running Worker. This call was cancelled; once the Worker leaves its write section, the server handles the intent according to the deletion mode the user chose — a soft delete only marks it deleted and keeps all output, while a hard delete cascades to remove the intent and the downstream nodes supported only by it")
	AbortWorkFinished = cause("work_finished", "Worker finished and released context",
		"The Worker finished normally and the engine released its context resources in detachWork. This is not a run interruption; if it appears in an interruption message, the cancellation raced with the wrap-up event")
	AbortPausedRaceGuard = cause("paused_race_guard", "New runs refused while task paused",
		"While the task is paused, the engine refuses to issue new execution contexts, to prevent a race between claim and pause from letting Workers keep starting; claimed intents go back to the frontier")

	// Main Agent and standalone conversation contexts.
	AbortChatStoppedByUser = cause("chat_stopped_by_user", "User stopped this conversation turn",
		"The user clicked stop, deliberately aborting this turn of the Main Agent or conversation Agent. Activity records already produced are kept, and the next message can be sent as usual")
	AbortChatPausedWithTask = cause("chat_paused_with_task", "Task pause aborted Main Agent chat",
		"When the user paused the task, the running Main Agent conversation was cancelled along with it. Activity records already produced are kept; this turn's message is not replayed automatically after the task resumes")
	AbortChatTurnFinished = cause("chat_turn_finished", "Turn finished and released context",
		"This conversation turn finished normally and the server is releasing the turn's context resources. This is not a run interruption; if it appears in an interruption message, the cancellation raced with the wrap-up event")

	// Process-level and per-run hard backstop.
	AbortShutdown = cause("shutdown", "Backend process is shutting down",
		"The backend process received SIGINT or SIGTERM and is restarting, updating or shutting down. All running Agents are cancelled; leftover running intents are reset to open and re-executed after restart")
	AbortRunHardTimeout = cause("run_hard_timeout", "Per-run hard timeout backstop fired",
		"This run exceeded its soft wall-clock budget plus the extra grace period, meaning a model request or some tool did not return for a long time, so the normal turn-boundary wrap-up could not run. Check the last tool call that had not returned before the interruption")
)

// AbortReason resolves the named cause attached to a cancelled run context.
func AbortReason(ctx context.Context) (code, short, text string, ok bool) {
	c := context.Cause(ctx)
	if c == nil {
		return "", "", "", false
	}
	var ac *AbortCause
	if errors.As(c, &ac) {
		return ac.Code, ac.Short, ac.Text, true
	}
	switch {
	case errors.Is(c, context.DeadlineExceeded):
		return "deadline_exceeded", "Upstream context hit its deadline",
			"The upstream context hit its deadline, but whoever set it did not attach a named cause via WithTimeoutCause: " + c.Error(), true
	case errors.Is(c, context.Canceled):
		return "canceled_no_cause", "Canceller attached no named cause",
			"The upstream context was cancelled, but the canceller did not attach a named cause via context.WithCancelCause; register a cause in agent/cancelcause.go and wire it into that cancellation site", true
	default:
		return "other", firstLine(c.Error(), 80), c.Error(), true
	}
}
