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
| T11 | No access code | 401 | 401 | PASS |
| T12 | Unknown seat id | 400 | `Unknown seat` | PASS |
| T13 | Service key + `user` | accepted, spend tracked per end user | `/end-users` shows seat-demo, seat-guest with own spend | PASS |
| T14 | Per-seat budget trip | 403 `budget_exceeded` | **not tripped**: end users have `budget_id: null`; service key may not assign budgets (`end_user_budget_not_allowed`), budgets API needs a master key | BLOCKED (needs dashboard) |
| T15 | Workspace ceiling $1.50/month | created | visible in Spend & budgets | CONFIGURED (not tripped) |
| T16 | Mobile 375px | no overflow, readable | scrollWidth 375, light theme | PASS |

## Defects
See `docs/BUG-LOG.md`.
