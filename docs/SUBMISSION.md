# DoraHacks submission pack — Mozilla Otari Hackathon

Deadline: **2026-11-11 23:59 UTC+1 (22:59 UTC)**. Submit by Nov 11 18:00 UTC at the latest.

## Fields (copy/paste)

| Field | Value |
|---|---|
| Project name | Kestrel |
| Otari sign-up email | **YOUR_EMAIL_USED_ON_OTARI** ← you fill this (must match your DoraHacks registration) |
| One line | Paste a hackathon or bounty URL and get a verified go/no-go brief, built from four open-weight models, live web research, MCP, and sandboxed code execution through Otari. |
| Public GitHub repo | https://github.com/Nailer/kestrel (**must be made public first**) |
| Hackathon branch | `hackathon` |
| First commit where Otari came in | https://github.com/Nailer/kestrel/commit/41a25e5 (verify the full SHA with `git rev-parse 41a25e5` after the repo is public) |
| Live demo | https://kestrel-inky-psi.vercel.app — access code: see `KESTREL_ACCESS_CODE` in `kestrel/.env.local` (give it to judges in the description) |
| PRs / issues opened on mozilla-ai/otari | none yet — see "Optional upstream issues" below |
| Demo video (3–5 min, your own screen + voice, no AI) | you record: `docs/VIDEO-SCRIPT.md` |
| Feedback screen recording (3–5 min) | you record: `docs/VIDEO-SCRIPT.md` |
| Written feedback | your words, from your experience; factual memory aid in `docs/FEEDBACK-LOG.md` |

## Otari features used (only what is verified live)
| Rubric feature | Used in app | Evidence |
|---|---|---|
| Multiple open-weight models in distinct roles | triage: mistral-small-3.2-24b · research: gpt-oss-120b (failover deepseek-v3.2) · analysis: qwen-3.5-35b-a3b / deepseek-v3.2 · brief: deepseek-v3.2 / gpt-oss-20b | per-stage model/provider shown in UI + `Otari-Model`/`Otari-Provider` headers |
| Web search | research stage `otari_web_search` | `web_search:completed` in UI |
| Web fetch | research stage `otari_web_fetch` | completes on many pages; DoraHacks itself returns 405 |
| MCP | DeepWiki `ask_wiki_question` | `mcp:completed` when the model chooses to call it (a run may skip/fail it) |
| Code execution | analysis stage `otari_code_execution` | sandbox code + stdout shown in UI |
| Guardrails | custom prompt-injection service via request-level `url` | 403 `guardrail_violation` on injection; `evaluated` on normal input (docs/TEST-REPORT T7–T9) |
| Budgets / spending limits | workspace ceiling $1.50/month (dashboard Spend & budgets) | configured; **not yet tripped in a demo** |
| Per-user budgets | seats are Otari end users (service key + `user`), each on the `kestrel-seat` budget ($0.15/day) | **enforced and verified 2026-11-06**: `seat-guest` over its cap gets 403 `budget_exceeded` (`otari-budget-scope: user`), both calling Otari directly and through the live app. Evidence: `docs/TEST-REPORT.md` T14 |
| Routing & fallbacks | automatic multi-provider fallback + app-level model failover | named policy `kestrel-research` not created yet (user step U5) |

Be exact in the video: say "tracked per user" not "capped per user" unless U4 is done.

## Optional upstream issues (genuine findings only — good for the "PRs/issues" field)
From `docs/FEEDBACK-LOG.md`: #11 (silent no-op on mismatched `allowed_tools`), #14 (empty content after tool loop), #18 (request-level guardrail has no credential; failures give no reason), #19 (end-user budget setup: header by name rejected, by id accepted; existing users need PATCH by id). Open issues yourself at https://github.com/mozilla-ai/otari/issues in your own words, then paste the links above.
