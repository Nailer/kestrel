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
