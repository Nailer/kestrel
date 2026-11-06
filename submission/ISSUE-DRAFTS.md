# Optional: issues to open on https://github.com/mozilla-ai/otari/issues (your own words)

I searched the repo's issues on 2026-11-06. These three problems were observed in real calls and **no matching issue was found** (the search page only shows what matched my keywords, so search again before filing). Rewrite in your own words; keep the repro. Don't file anything you can't reproduce yourself.

Already filed by others — do NOT duplicate: guardrail `credential` field accepted but not sent (#2955); keyless open-weight guardrail on hosted (#2722); docs `/v1` vs `/api/v1` (#2898, #2705).

## 1. MCP `allowed_tools` naming a tool the server doesn't offer silently exposes zero tools
- Request: `POST /api/v1/chat/completions` with `mcp_servers:[{name:"deepwiki", url:"https://mcp.deepwiki.com/mcp", allowed_tools:["ask_question"]}]`.
- Actual: HTTP 200, no `otari_tool_calls`, ~85 prompt tokens, and the model answers from imagination.
- The server's real tool is `ask_wiki_question` (the dashboard "Test connection" showed "Not offered by the server: ask_question").
- Expected: a 4xx or a warning field when `allowed_tools` matches nothing.

## 2. `Otari-End-User-Budget` header rejects the budget name but accepts the budget id
- Service key with the budget allowed and set as default. `Otari-End-User-Budget: kestrel-seat` → 403 `end_user_budget_not_allowed`; the same request with the budget's id (`a6b0bb25-…`) → 200.
- Also: PATCH `/end-users?external_id=…` returns the same 403 until the key's End-user budgets are saved, then works only with the id.
- Expected: accept the name shown in the dashboard, or say "use the id" in the error.

## 3. `openai/gpt-oss-120b` + `otari_web_search` can finish with empty `content`
- HTTP 200, `finish_reason: "stop"`, `message.content: ""` after a completed `web_search` call (reasoning only). Reproduced several times on 2026-11-04.
- Expected: a final assistant message, or a non-"stop" finish reason so clients can detect it.
