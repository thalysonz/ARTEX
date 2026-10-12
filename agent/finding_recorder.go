package agent

import (
	"context"

	"github.com/Autumn-27/artex/db"
)

// FindingRecorder is injected by the host; agents never synthesize or copy
// evidence bodies themselves. Its implementation owns the atomic write.
type FindingRecorder interface {
	Record(context.Context, db.RecordFindingInput, []db.TrafficRef) (*db.RecordedFinding, error)
}

// Tool-use guidance is appended without replacing the user's editable prompt.
// It does not require capture or claim that unavailable traffic tools exist.
const findingTrafficGuidance = "\n\n**Vulnerability traffic evidence (optional)**: when calling report_finding to report a vulnerability, if you have HTTP requests/responses that you have inspected and confirmed support the finding, you may bind their real IDs via traffic_refs in reproduction order; domain and time are only for filtering candidates and do not imply a link. For TCP or other non-HTTP vulnerabilities, when traffic was not captured, or when there is no exact match, omit it or pass [], keep other verifiable evidence (command output, logs, etc.) in evidence, and preferably explain why nothing was bound. Do not guess IDs, and do not re-probe solely to obtain packets."

func (t *ToolSet) SetFindingRecorder(r FindingRecorder)   { t.findingRecorder = r }
func (w *Worker) SetFindingRecorder(r FindingRecorder)    { w.findingRecorder = r }
func (p *Planner) SetFindingRecorder(r FindingRecorder)   { p.findingRecorder = r }
func (m *MainAgent) SetFindingRecorder(r FindingRecorder) { m.findingRecorder = r }
