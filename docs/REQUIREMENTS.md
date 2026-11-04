# Requirements Matrix — Mozilla Otari Hackathon (Developers Wilding: Online)

Source: https://dorahacks.io/hackathon/mozilla-devs-wilding (read 2026-11-04)
Rubric: https://docs.google.com/document/d/1-spnCZ3f2SSki8cb6FnochjchdyttUsjjxfoE6aBnF4 (read 2026-11-04)

## Facts (verified from the sources above)

| Item | Value |
|---|---|
| Organizer | Mozilla.ai / Mozilla.org (MozFest "Developers Wilding: Online"), hosted on DoraHacks |
| Window | 2026-10-28 → **2026-11-11 23:59 UTC+1 (= 22:59 UTC)** |
| Today | 2026-11-04 → ~7 days left |
| Prizes | 1st $1,000 + 3h Mozilla.ai engineers; 2nd $200 + 2h; 3rd 1h engineers. Total cash $1,200 |
| Registered hackers | 78 (DoraHacks page, 2026-11-04) |
| Eligibility | No geographic/age restriction stated on page. UNKNOWN: DoraHacks/Mozilla fine print |
| Mandatory tech | Hosted gateway at https://otari.ai (not a self-hosted gateway) |
| AI-generated code | Not addressed. Video demo + video feedback **must not use AI** (screen recording with the participant's own audio) |

## Judging rubric (100 pts)

| Category | Points | How to earn |
|---|---|---|
| Open-weight models | 30 | 20 for ≥1 open-weight model used meaningfully; +10 for ≥2 open-weight models in different roles |
| Otari features | up to 60 | 10 per advanced feature actually *used by the app* (dashboard-only doesn't count): model routing & fallbacks · MCP integrations · web search / web fetch · code execution · budgets & spending limits · multiple models in distinct roles · guardrails · per-user budgets |
| Project + demo | 10 | 5 working app / real use case; 5 video clearly explains Otari integration and shows the capabilities |

Kestrel targets **all 8** Otari features (cap is 6, so two can fail on hosted without losing the score).

## Hard submission requirements (miss any ⇒ not eligible for prizes)

| ID | Requirement | Owner | Evidence | Status |
|---|---|---|---|---|
| R1 | DoraHacks sign-up: name/pseudonym, Otari.ai sign-up email, one-line project | USER | DoraHacks registration | UNSTARTED |
| R2 | Sign up at otari.ai (first 200 get $20 tokens) | USER (account creation) | dashboard | UNSTARTED |
| R3 | Join Mozilla OSAI Discord + `devs-wilding` role (https://discord.gg/TqvzGH9mwz) | USER | Discord | UNSTARTED |
| R4 | Star https://github.com/mozilla-ai/otari | USER | GitHub | UNSTARTED |
| R5 | Public GitHub repo + hackathon branch name | Claude prepares, USER pushes/authorizes | repo URL | IN PROGRESS (local repo) |
| R6 | Link to **first commit** on the branch where Otari was introduced | Claude (commit discipline) | commit SHA | PLANNED |
| R7 | List of Otari features used | Claude | README + `docs/SUBMISSION.md` | PLANNED |
| R8 | Any PRs/issues opened on the Otari repo | USER (genuine findings only) | issue links | PLANNED — log friction in `docs/FEEDBACK-LOG.md` as it happens |
| R9 | 3–5 min project demo video, screen recording + own audio, no AI | USER records; Claude writes script | video URL | UNSTARTED |
| R10 | 3–5 min Otari feedback screen recording answering 4 questions | USER records | video URL | UNSTARTED |
| R11 | Written feedback (3 questions) | USER's own words; Claude supplies a factual friction log | doc | UNSTARTED |
| R12 | Project name, Otari signup email, one-liner | Claude drafts | `docs/SUBMISSION.md` | PLANNED |

## Unknowns to resolve once an Otari key exists
- U1: Which open-weight models the hosted catalog exposes (`GET /api/v1/models`) and their ids.
- U2: Whether guardrails (`prompt-injection` profile) are available on hosted otari.ai.
- U3: Whether hosted workspaces can mint service keys / end-user budgets (per-user budgets) via the org routes.
- U4: Whether `otari_web_fetch`, `otari_web_search`, `otari_code_execution` are enabled for hosted workspaces.
- U5: Whether managed MCP (`mcp_servers`) works against the public DeepWiki MCP (https://mcp.deepwiki.com/mcp — verified live 2026-11-04).
- U6: Whether routing policies can be created on hosted via dashboard / `/api/v1/organizations/me/routing-policies`.
