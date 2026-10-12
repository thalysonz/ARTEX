package server

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"log"
	"unicode"

	"github.com/Autumn-27/artex/agent"
	"github.com/Autumn-27/artex/db"
)

// legacyZhPromptSHA256 holds the SHA-256 of each agent's Chinese default prompt as
// shipped upstream right before the English translation (commit f3e3f54). A stored
// prompt is only replaced when it still hashes to exactly this value, i.e. nobody
// edited it — customized prompts are never touched.
var legacyZhPromptSHA256 = map[string]string{
	"auto":                   "b2a71b82243607337b19f0642317fed88c144d536412d80eaaf90807f2905a1d",
	"goals":                  "72a7a0159443b41dde29dfba8a3de6a2c8a15b273935495a7b88561fa708aa68",
	"mainagent":              "12bb69ee0886c4fb9beb936d882021a91104860f1da69a5e3eda3d9e345cd399",
	"pentest":                "a54bd5713b1c121d0f2ff3a72e0304820b1368c4b4b8159d5d651895663ac652",
	"planner":                "14e163f4a44da9fee20a214048a607adc3659b2025275569eb512532ca8c15d5",
	"worker":                 "80fbb1c610dd57e266c20b9145793339eee540b809f6db8f5336261b45879f08",
	"reporter":               "8ba98208f6c5f2ccb103c88ef13239c4264733400c0e3dfec96d3a3572d78d39",
	db.FindingRetestAgentKey: "d08326aa9fbd9a1367e716cf7ef46533e9096e9a56493f77d364efbf696f7fe0",
}

// legacyZhAgentNames maps the Chinese name/description seeded for the non-builtin
// default agents onto their English replacement. Built-in agents are re-synced on
// every start; these two are seeded once, so a renamed agent is left alone.
var legacyZhAgentNames = map[string]struct{ oldName, name, desc string }{
	"reporter": {"报告撰写", "Report Writer",
		"Detailed vulnerability report writer: triggered automatically when a vulnerability is found; gathers the evidence and execution trace, then writes a Markdown report and saves it back."},
	db.FindingRetestAgentKey: {"漏洞复测", "Finding Retest",
		"Started manually from finding details; reads the original evidence and saves an independent retest verdict."},
}

func hasHan(s string) bool {
	for _, r := range s {
		if unicode.Is(unicode.Han, r) {
			return true
		}
	}
	return false
}

func defaultPromptFor(key string) string {
	switch key {
	case "reporter":
		return agent.ReporterDefaultPrompt
	case db.FindingRetestAgentKey:
		return agent.RetesterDefaultPrompt
	}
	return agent.BuiltinPromptSeeds()[key]
}

// migrateEnglishDefaults moves an existing database onto the English defaults once:
//   - unedited Chinese default prompts get a new version with the English default
//     (ResetPromptToDefault appends a version, so the old one stays in history);
//   - system tools whose description is still Chinese get the code description and
//     schema (same mechanism as refreshBuiltinToolSchemas);
//   - the reporter/retester agents get English names if still at the seeded name.
//
// Fresh databases are seeded in English already, so nothing matches there.
func (s *Server) migrateEnglishDefaults() {
	const flag = "locale_english_defaults_v1"
	if v, _, _ := s.m.pg.GetSetting(flag); v == "true" {
		return
	}
	defer func() { _ = s.m.pg.SetSetting(flag, "true") }() // one attempt only

	for key, oldHash := range legacyZhPromptSHA256 {
		a, err := s.m.pg.GetAgentByKey(key)
		if err != nil || a == nil {
			continue
		}
		cur, err := s.m.pg.CurrentPrompt(a.ID)
		if err != nil {
			continue
		}
		sum := sha256.Sum256([]byte(cur))
		if hex.EncodeToString(sum[:]) != oldHash {
			continue // edited by a user, or already migrated
		}
		tmpl := defaultPromptFor(key)
		if tmpl == "" {
			continue
		}
		if _, err := s.m.pg.ResetPromptToDefault(a.ID, tmpl); err != nil {
			log.Printf("[prompts] failed to switch %s prompt to English default: %v", key, err)
			continue
		}
		log.Printf("[prompts] %s: appended English default prompt version (previous version kept in history)", key)
	}

	refresh := func(key, desc string, schema json.RawMessage) {
		t, err := s.m.pg.GetTool(key)
		if err != nil || t == nil || !t.System || !hasHan(t.Description) {
			return
		}
		if err := s.m.pg.RefreshToolDefaults(key, desc, schema); err != nil {
			log.Printf("[tools] failed to refresh %s to English description: %v", key, err)
		}
	}
	for _, t := range append(s.orchestrationTools(), s.platformTools()...) {
		schema, _ := json.Marshal(t.InputSchema())
		refresh(t.Name(), t.Description(), schema)
	}
	for _, sd := range agent.BuiltinToolSeeds() {
		schema, _ := json.Marshal(sd.Schema)
		refresh(sd.Key, sd.Desc, schema)
	}

	for key, n := range legacyZhAgentNames {
		if _, err := s.m.pg.Exec(`UPDATE agents SET name=$1, description=$2 WHERE key=$3 AND name=$4`,
			n.name, n.desc, key, n.oldName); err != nil {
			log.Printf("[agents] failed to rename %s: %v", key, err)
		}
	}
}
