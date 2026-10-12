package server

import (
	"strings"

	"github.com/Autumn-27/artex/agent"
	"github.com/Autumn-27/artex/db"
)

// settingAgentOutputLang selects the language agents write human-readable output
// in (chat replies, findings, reports). See agent.OutputLanguage.
const settingAgentOutputLang = "agent_output_language"

const defaultAgentOutputLang = "en"

// normalizeOutputLang maps loose input onto a supported tag; ok=false if unknown.
func normalizeOutputLang(v string) (string, bool) {
	switch strings.ToLower(strings.TrimSpace(v)) {
	case "en", "en-us", "english":
		return "en", true
	case "pt", "pt-br", "portuguese":
		return "pt-BR", true
	case "zh", "zh-cn", "chinese":
		return "zh-CN", true
	}
	return "", false
}

// agentOutputLang returns the stored output language, defaulting to English.
func agentOutputLang(pg *db.DB) string {
	if pg != nil {
		if v, ok, _ := pg.GetSetting(settingAgentOutputLang); ok {
			if lang, ok := normalizeOutputLang(v); ok {
				return lang
			}
		}
	}
	return defaultAgentOutputLang
}

// wireOutputLanguage makes every rendered system prompt end with the configured
// output-language directive. Read per render, so a change applies to the next turn.
func wireOutputLanguage(pg *db.DB) {
	agent.OutputLanguage = func() string { return agentOutputLang(pg) }
}
