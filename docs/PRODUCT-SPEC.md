# Kestrel — product spec

**Tagline:** Scout a bounty before you spend a week on it.
**One line:** Paste a hackathon or bounty URL; Kestrel reads the rules, researches the sponsor, computes the odds and effort, and returns a go / no-go brief.
**User:** Solo developers who chase hackathons and bounties for income and lose days to opportunities with hidden deadlines, ineligibility, or crowded fields.
**Why Otari:** The job needs several different models, live web access, sandboxed arithmetic, tool servers, spend control per teammate, and an input guard. Otari provides all of that behind one endpoint so none of it has to be hand-built.

## Pipeline (each stage is a distinct model role)

| Stage | Role | Model class | Otari feature(s) |
|---|---|---|---|
| 0 | Input guard | — | `guardrails: [{profile:"prompt-injection", mode:"block"}]` |
| 1 | Triage — classify the page, plan what to verify | small open-weight | routing alias + fallback policy |
| 2 | Researcher — fetch the page, search the sponsor ecosystem, read sponsor repo docs | tool-capable open-weight | `otari_web_fetch`, `otari_web_search`, `mcp_servers` (DeepWiki) |
| 3 | Analyst — deadline math, expected-value, effort-vs-prize | open-weight (code-capable) | `otari_code_execution` |
| 4 | Writer — strict JSON brief for the UI | second/third open-weight | multiple models, distinct roles |
| — | Seats | each teammate is an end user | per-user budgets (`user` field), budget_exceeded handling, workspace spend cap |

## Demo moment
Paste `https://dorahacks.io/hackathon/mozilla-devs-wilding` → in ~60s see: deadline countdown (computed in the sandbox, not guessed), prize breakdown, rubric, risk flags, EV range, verdict. Then show the per-seat budget tripping with a 403 and the dashboard Activity view proving which models served which stage.

## Honesty rules
- Every brief field carries its source URL or tool-call evidence; unknown stays "unknown".
- The brief never states win probabilities.
- UI shows the real Otari response metadata (model used, fallback taken, guardrail verdict, cost).

## Out of scope
Auth/accounts of our own, persistence beyond a JSON file, payments.
