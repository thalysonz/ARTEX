package intercept

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestParseVerdict(t *testing.T) {
	for _, action := range []string{"allow", "ask", "deny"} {
		t.Run(action, func(t *testing.T) {
			reason := "Actual operation: writes a report containing the words ALLOW, DENY and ASK; Consequence on success: saves the text without executing the commands in the body; Rule matched: custom clause"
			raw, _ := json.Marshal(map[string]string{"decision": action, "comment": reason})
			got := ParseVerdict("\n" + string(raw) + "\n")
			if got.Action != action || got.Reason != reason {
				t.Fatalf("lost verdict or explanation: %+v", got)
			}
		})
	}
}

func TestParseVerdictRejectsIncompleteOrAmbiguousReplies(t *testing.T) {
	valid := `{"decision":"allow","comment":"Actual operation: reads a file; Consequence on success: returns the contents; Rule matched: A5"}`
	for _, reply := range []string{
		"", "ALLOW", "DENY:命中D4", "放行:ALLOW", "ASK:归属不明",
		`{"decision":"allow"}`, `{"decision":"approve","comment":"Actual operation: reads; Consequence on success: returns the contents; Rule matched: A5"}`,
		`{"decision":"allow","comment":null}`, `{"decision":"allow","comment":123}`,
		strings.Replace(valid, "Actual operation: reads a file", "Actual operation: ", 1),
		strings.Replace(valid, "Consequence on success: returns the contents", "Consequence on success: ", 1),
		strings.Replace(valid, "Rule matched: A5", "Rule matched: ", 1),
		strings.Replace(valid, "; Rule matched: A5", "", 1),
		strings.Replace(valid, `"decision":"allow"`, `"decision":"deny","decision":"allow"`, 1),
		strings.Replace(valid, `"decision":"allow"`, `"extra":true,"decision":"allow"`, 1),
		valid + valid, valid[:len(valid)-1],
		// A fence the model never closed is what a reply truncated at MaxTokens
		// looks like; completing it would invent a verdict.
		"```json\n" + valid[:len(valid)-1],
		"```json\n" + valid + "\n```\nI also recommend a human review afterwards.",
		"My ruling is:\n" + valid,
	} {
		if got := ParseVerdict(reply); got.Action != "" {
			t.Errorf("accepted incomplete/ambiguous verdict: %q => %+v", reply, got)
		}
	}
}

// Wrapping JSON in markdown is the one deviation models make routinely. Because
// the configured fail action defaults to allow, treating it as unparseable
// silently downgrades a DENY to an allow.
func TestParseVerdictUnwrapsCodeFence(t *testing.T) {
	deny := `{"decision":"deny","comment":"Actual operation: deletes a production file; Consequence on success: business data is lost; Rule matched: D4"}`
	for _, reply := range []string{
		"```json\n" + deny + "\n```",
		"```JSON\n" + deny + "\n```",
		"```\n" + deny + "\n```",
		"  ```json\n" + deny + "\n```  ",
	} {
		got := ParseVerdict(reply)
		if got.Action != "deny" || !strings.HasSuffix(got.Reason, "Rule matched: D4") {
			t.Errorf("fenced verdict lost: %q => %+v", reply, got)
		}
	}
}

func TestParseVerdictKeepsCompleteExplanation(t *testing.T) {
	reason := "Actual operation: " + strings.Repeat("writes a report ", 30) + "; Consequence on success: only saves the file; Rule matched: A2"
	raw, _ := json.Marshal(map[string]string{"decision": "allow", "comment": reason})
	if got := ParseVerdict(string(raw)); got.Reason != reason {
		t.Fatal("explanation was truncated or lost its rule")
	}
	// Legacy Chinese labels (saved custom prompts written against the old contract) still parse.
	legacy := "实际操作：" + strings.Repeat("写入报告", 30) + "；成功后的后果：只保存文件；命中规则：A2"
	raw, _ = json.Marshal(map[string]string{"decision": "allow", "comment": legacy})
	if got := ParseVerdict(string(raw)); got.Reason != legacy {
		t.Fatal("legacy explanation was truncated or lost its rule")
	}
	// Mixed label sets are not a complete verdict.
	raw, _ = json.Marshal(map[string]string{"decision": "allow", "comment": "Actual operation: reads；成功后的后果：返回内容；命中规则：A5"})
	if got := ParseVerdict(string(raw)); got.Action != "" {
		t.Fatal("accepted mixed label sets")
	}
	raw, _ = json.Marshal(map[string]string{"decision": "allow", "comment": "Actual operation: " + strings.Repeat("x", 2400) + "; Consequence on success: y; Rule matched: A5"})
	if got := ParseVerdict(string(raw)); got.Action != "" {
		t.Fatal("accepted unbounded explanation")
	}
}
