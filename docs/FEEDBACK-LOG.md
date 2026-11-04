# Otari friction log (factual, timestamped — raw material for the feedback videos)

Written by the build agent from real observed API behaviour on 2026-11-04. The submission's written feedback and videos must be the participant's own words and experience; use this only as a memory aid.

| # | Observed | Evidence | Impact |
|---|---|---|---|
| 1 | `otari_web_fetch` / `otari_web_search` return 403 "web access is not enabled for this workspace" on a fresh hosted workspace; `GET /tools` shows `workspace_disabled` | docs/PROBE-RESULTS.md | Core demo needs a dashboard toggle that the API key can't flip |
| 2 | Admin endpoints (`/organizations/me`, `/routing/policies`, `/budgets`, `/tool-settings`) reject an `otk_` key with 401 "Invalid master key" | probe | Everything operational (routing policy, budgets, service key) is dashboard-only for hosted users; can't be scripted from the app repo |
| 3 | `guardrails: [{profile:"prompt-injection", mode:"block"}]` → 502 "no guardrails service is configured. Set OTARI_GUARDRAILS_URL on the gateway or pass `url` on the guardrail entry"; `monitor` mode silently succeeds with `status: unavailable` | probe | Hosted gateway ships no default guardrails service; `monitor` fails open so it looks like it works |
| 4 | `user` field → 403 "'user' field does not match the authenticated API key's user" | probe | Per-user budgets need a service key, not obtainable with a normal hosted key via API |
| 5 | `mcp_servers` with the public DeepWiki MCP returned HTTP 200 with a generic answer, no `otari_tool_calls`, and ~85 prompt tokens (no tool schema injected) — the MCP server appears not to have been called, and nothing in the response says so | probe; gpt-oss-120b and deepseek-v3.2 | Silent no-op: hard to tell MCP did not run. Needs verification via a workspace-stored server |
| 6 | Reasoning model `alibaba/qwen-3.5-35b-a3b` with `max_tokens:1500` hit `finish_reason: length` with empty `content` (all budget in `reasoning`) | probe | Non-obvious token budgeting for reasoning models |
| 7 | `meta/llama-3.3-70b-instruct` with `response_format: json_object` returned an empty, non-JSON body (plain chat works, served by bedrock) | curl | JSON mode inconsistent across providers |
| 8 | Code execution works for open-weight Qwen via `otari_code_execution`; response includes `otari_tool_calls[]` with code/stdout/exit_code | pipeline run | Positive: clear evidence trail |
| 9 | `Otari-*` response headers (provider, fallback, attempt-count, request-id) are very useful | probe | Positive |
| 10 | Research step returned near-empty content once (same prompt later succeeded) | run-scout | Added a retry guard |
| 11 | Corrects #5: MCP did work once the tool name was right. DeepWiki's tool is `ask_wiki_question`; I had `allowed_tools: ["ask_question"]`. Otari silently exposed **zero** tools (HTTP 200, no error, ~85 prompt tokens) and the model hallucinated an answer. The dashboard "Test connection" showed the real tool names ("Not offered by the server: ask_question"), which is how I found it | dashboard + scripts/mcp-check.mjs | A mismatched `allowed_tools` entry should be a 4xx or response warning, not a silent no-op |
| 12 | Two accounts (US and EU) share one sign-in page (otari.ai/dashboard) and key prefixes (`otk_v1_us_` / `otk_v1_eu_`) are the only hint which region a key belongs to; I configured the wrong region's workspace before noticing | session | Region is easy to mix up |
| 13 | `otari_web_search` works on open-weight gpt-oss-120b (~$0.02/search). `otari_web_fetch` is enabled but DoraHacks returns upstream HTTP 405 to the built-in fetcher (`status: failed`, `retryable: false`) | scripts/tool-check.mjs | Fetch can't read bot-blocking/SPA hackathon sites; search sources partly cover it |
