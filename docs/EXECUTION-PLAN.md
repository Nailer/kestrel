# Execution plan (deadline: 2026-11-11 22:59 UTC)

| Day | Milestone | Acceptance |
|---|---|---|
| Nov 4 | M0–M1 rules verified, concept chosen, repo scaffolded | docs/REQUIREMENTS.md, PRODUCT-SPEC.md |
| Nov 4–5 | **M2 feasibility** — once `OTARI_API_KEY` exists: probe `/models`, one chat call, one call each with web_fetch / web_search / code_execution / mcp_servers / guardrails | `scripts/probe.ts` output saved in docs/PROBE-RESULTS.md; resolves U1–U6 |
| Nov 5–7 | M3–M5 pipeline + API route + UI | one URL → full brief, live |
| Nov 8 | M6 seats / budgets / fallback demo, error states | budget_exceeded rendered |
| Nov 9 | M7 four-pass regression, security review (key never reaches the browser) | docs/TEST-REPORT.md |
| Nov 10 | M8 Vercel deploy + live verification; README | live URL verified |
| Nov 10–11 | M9 USER records both videos, writes feedback; submit on DoraHacks | receipt |

Buffer: submit by Nov 11 18:00 UTC at the latest.

## Blockers needing the user (everything else proceeds without them)
1. Create the Otari.ai account, make an API key, put it in `kestrel/.env.local` as `OTARI_API_KEY=...` (never in chat).
2. Create / authorize the public GitHub repo (`gh auth status`) so the first Otari commit can be linked.
3. Record the two videos with your own voice; write the written feedback in your own words.
4. Final DoraHacks submission.

## Fallback if a feature is unavailable on hosted
Score cap is 6 features and there are 8 targets, so up to 2 can fail. If more than 2 fail, drop the failing ones from the claims, do not mock them.

## Status log
**2026-11-04 (evening)** — Feature verification against hosted Otari (EU account):

| Rubric feature | Status | Evidence |
|---|---|---|
| ≥2 open-weight models in distinct roles | VERIFIED | mistral-small-3.2 (triage), gpt-oss-120b → deepseek-v3.2 failover (research), qwen-3.5-35b (analysis), deepseek-v3.2 (writer); `otari-model`/`otari-provider` headers per stage |
| Code execution | VERIFIED | `otari_tool_calls[type=code_execution]` with stdout; days_remaining computed in sandbox |
| Web search | VERIFIED | `web_search:completed` |
| Web fetch | VERIFIED (partial) | completed on some pages; DoraHacks itself returns upstream 405 |
| MCP | VERIFIED | `mcp:completed` via DeepWiki `ask_wiki_question` |
| Budgets / spend limits | CONFIGURED, not yet exercised | workspace ceiling $1.50/month on Default workspace; trip-test pending |
| Per-user budgets | BLOCKED on user | needs a Service key (dashboard → API keys → Create key → Service key) + budget `kestrel-seat` ($0.05/day, already created) |
| Guardrails | BUILT, needs public URL | `app/api/guard/*` implements the Otari guardrail contract; needs deploy, then `KESTREL_GUARDRAIL_URL` |
| Routing & fallbacks | PARTIAL | automatic multi-provider fallback exists (gpt-oss-120b has 4 providers); named policy `kestrel-research` not created (dashboard picker would not commit the backup under automation) |

Cost per full run ≈ $0.10 (research stage dominates: ~70k prompt tokens). Wallet ≈ $1.9; workspace cap $1.50/month.
