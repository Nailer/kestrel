# Test report (live evidence, 2026-11-04 → 2026-11-06)

Target: https://kestrel-inky-psi.vercel.app (Vercel prod) and local CLI harness. Account: Otari EU.

## Static
| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npm run lint` | pass |
| `npm run build` | pass (after removing `runtime` exports incompatible with `cacheComponents`) |
| `npx tsx scripts/guard-test.ts` | 6/6 pass |

## Feature verification (real calls, no mocks)
| ID | Test | Expected | Actual | Result |
|---|---|---|---|---|
| T1 | `/tools` after enabling web access | web_search/web_fetch available | true/true | PASS |
| T2 | web_search via gpt-oss-120b | completed call, correct deadline | completed, 22:59 UTC | PASS |
| T3 | web_fetch DoraHacks | page text | upstream HTTP 405 (`failed`) | LIMITATION (site blocks bot) |
| T4 | MCP DeepWiki `ask_wiki_question` | `otari_tool_calls[type=mcp, completed]` | completed with real repo answer | PASS |
| T5 | MCP with wrong tool name | error | silent zero tools, hallucinated answer | FRICTION (logged #11) |
| T6 | code_execution (Qwen) | stdout in `otari_tool_calls` | present; deadline math = 7.26 days on Nov 4, 5.0 on Nov 6 | PASS |
| T7 | Guardrail via request `url` (injection) | 403 `guardrail_violation` | 403 + explanation + score 0.99 | PASS |
| T8 | Guardrail normal input | `evaluated`, valid | `{"valid":true,"status":"evaluated"}` | PASS |
| T9 | Live app, injection in notes | pipeline stops | `fatal 403 Request blocked by guardrail policy` | PASS |
| T10 | Live app, normal run in browser | 4 stages + brief | all done, brief correct | PASS |
| T11 | Invalid input paths (live) | 400 with clear message | no seat → `Unknown seat`; malformed key → "doesn't look like an Otari key" (access-code gate removed 2026-11-06 in favour of seats + own-key mode) | PASS |
| T12 | Unknown seat id | 400 | `Unknown seat` | PASS |
| T13 | Service key + `user` | accepted, spend tracked per end user | `/end-users` shows seat-demo, seat-guest with own spend | PASS |
| T14 | Per-seat budget trip | 403 `budget_exceeded` | PASS 2026-11-06: `seat-guest` (spent $0.32 vs $0.15/day) → 403 `budget_exceeded`, `otari-budget-scope: user`, `retry-after`; same through the live app (`fatal … budget_exceeded`). Earlier (Nov 4) a seat tripped at $0.147 + request estimate | PASS |
| T15 | Workspace ceiling $1.50/month | created | visible in Spend & budgets | CONFIGURED (not tripped) |
| T16 | Mobile 375px | no overflow, readable | scrollWidth 375, light theme | PASS |

## Defects
See `docs/BUG-LOG.md`.

## Added 2026-11-09 (rubric pass)
| # | Test | Expected | Actual | Result |
|---|---|---|---|---|
| T17 | Run on `github.com/mozilla-ai/otari/pull/2673` (CLI harness, service key) | docs stage runs MCP deterministically; guardrail verdict shown | triage guardrail `{valid:true, score:0, status:"evaluated"}`; docs stage `mcp:completed` in 23.7 s; research web_search/web_fetch completed; analysis `code_execution:completed`; total 133 s, about $0.06 | PASS |
| T18 | Same run: researcher gpt-oss-120b | non-empty text | empty text again, failed over to deepseek-v3.2 (recorded in the stage note) | KNOWN ISSUE (handled) |
| T19 | Live production, injection in notes (seat-guest) | blocked before any model | `fatal 403 "Request blocked by guardrail policy."` | PASS |
| T20 | Otari web fetch on candidate example links | readable | github.com repo/PR/issue and devpost.com/hackathons PASS; ethglobal.com and dorahacks.io fail | examples changed to readable links |
