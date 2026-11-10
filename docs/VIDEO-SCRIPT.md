# Video scripts — you record these (screen + your own voice; NO AI voice, avatars or generated footage)

Tips: 1080p, close other tabs, hide notifications, rehearse once. A cut-down version of the same run is fine. Use QuickTime (File → New Screen Recording) or Loom; upload unlisted to YouTube/Loom and paste the link.

## Video 1 — Project demo (3–5 min). Scoring: every Otari feature below must be SHOWN running, not just said.
Before recording: one warm-up run the day before (so you know it works), close other tabs, hide the Otari Keys page / `.env.local` / Vercel env screens. Reset: use `seat-judge` (fresh each UTC day).

| Time | Show | Say (in your own words) | Rubric points it proves |
|---|---|---|---|
| 0:00 | Landing page: hero, then slowly scroll the animation until the word Otari appears | "Solo devs lose days on hackathons with hidden deadlines or bad odds. Kestrel gives a go/no-go brief in about two minutes." | project + real use case |
| 0:25 | Landing page: scroll past the animation to the "Five stages" list | "Five stages, four open-weight model families, every call goes through hosted Otari." | open-weight models (30) |
| 0:45 | Scroll to the end, press **Open the app** (the /scout page). Click the **Otari announcement (GitHub)** chip, keep seat `seat-judge`, press **Scout this link** | Narrate each stage as it appears. | — |
| 1:00 | Stage 1 (triage) | "Mistral Small. Otari calls my own validator before the model sees the text. Here is the verdict header: valid, score 0, mode block." (point at the *Guardrail verdict* line) | guardrails |
| 1:30 | Stage 2 (sponsor docs) + expand `mcp` tool call | "gpt-oss-120b asks the sponsor's repo docs through a managed MCP server (DeepWiki). The gateway ran the call, here is the tool-call record." | MCP |
| 2:00 | Stage 3 (research) + expand web_search / web_fetch | "Web search and web fetch run inside Otari. A failed fetch shows why. If gpt-oss returns empty text, Kestrel fails over to DeepSeek; Otari's routing policy handles provider failures." Point at the routing/policy line if shown. | web search/fetch, routing and fallbacks |
| 2:30 | Stage 4 (analysis) + expand code | "DeepSeek runs the date maths in Otari's sandbox; here is the code and its output." | code execution |
| 3:00 | Brief | Verdict, deadline, days remaining, "unknown" list. Point at the bottom line: features exercised, total cost, per-user budget "seat-judge". | project works |
| 3:20 | Guardrail demo: **Page text (optional) → Test the guardrail with a prompt-injection attack**, Scout | "Blocked before any model ran: Otari returned 403 guardrail_violation." | guardrails (shown blocking) |
| 3:45 | Per-user budget: choose an exhausted seat (see "Budget proof" below) and Scout | "Each seat is an Otari end user with a $0.15/day budget. Over budget: 403 budget_exceeded, with the reset time." | per-user budgets, budgets and spending limits |
| 4:10 | Otari dashboard → Requests (rows by model) → Spend & budgets (the $1.50 workspace ceiling, the seat budget) | "Four models in the requests list. Budget policy is set in the dashboard and enforced by the gateway." | multi-model, budgets |
| 4:40 | GitHub repo, README table | "Open source; README lists each stage's Otari feature." | — |

Budget proof (do this once before recording, so a seat is already exhausted): run 2 scouts back to back on `seat-guest` until it answers `budget_exceeded`; it stays blocked until 00:00 UTC. Record that seat for the 3:45 segment and use `seat-judge` for the main run.

## Video 2 — Otari feedback (3–5 min), answer these on screen
1. What did you build with Otari and which features? (walk through quickly)
2. What worked well? (e.g. one OpenAI-compatible endpoint, gateway-run tools returning `otari_tool_calls` evidence, Otari-* headers)
3. What didn't work? Reproduce on screen. Candidates you actually hit (see `docs/FEEDBACK-LOG.md` for details/evidence): web tools disabled by default; MCP wrong tool name = silent no-op; empty content after tool loop; guardrail `url` has no credential and failures say only `evaluation_failed`; per-user budgets setup friction (name vs ID); admin endpoints reject normal keys.
4. What's missing / what would you change?

## Written feedback (write in your own words, honestly — only what you really felt)
- When were you most tempted to skip Otari and call the provider directly? What happened?
- What did you build yourself that Otari should've done? (e.g. model failover on empty replies; guardrail debugging)
- If the rules hadn't required Otari, would you keep using it? Why/why not?
