## Kestrel — scout a bounty before you spend a week on it

**Try it (no sign-up, no code):** https://kestrel-inky-psi.vercel.app — use a free demo seat, or paste your own Otari key for unlimited runs.
**Source:** https://github.com/Nailer/kestrel (branch `hackathon`)
**Demo video:** YOUR_DEMO_VIDEO_URL

### The problem
Solo developers who chase hackathons and bounties for income lose days on opportunities with hidden deadlines, ineligibility, or poor odds. The facts are scattered across JavaScript-heavy pages, rules documents and sponsor repos.

### What Kestrel does
Paste a hackathon or bounty link. In about 2–3 minutes Kestrel returns a **go / maybe / no-go brief**: deadline and days remaining, prizes, mandatory requirements, eligibility flags, risks, and an explicit list of what it could not verify. Every figure is computed by code in a sandbox, never guessed, and unknowns stay "unknown".

### How it works — open-weight models (four families), one job per stage, all through Otari
| Stage | Model (open-weight) | Otari features used |
|---|---|---|
| 1. Triage | Mistral Small 3.2 24B | **Guardrails** (prompt-injection check via our own validator service, called by Otari), multi-model roles |
| 2. Sponsor docs | gpt-oss-120b | **MCP** — a managed DeepWiki `ask_wiki_question` call on the sponsor's GitHub repo, every run where a repo is known |
| 3. Research | gpt-oss-120b (via Otari routing policy `kestrel-research`, DeepSeek V3.2 as backup) | **Web search, web fetch, routing and fallbacks** |
| 4. Analysis | DeepSeek V3.2 | **Code execution** — days-to-deadline and prize-per-effort maths run in Otari's sandbox |
| 5. Brief | gpt-oss-20b | multi-model roles |
| Seats | Otari service key + `user` field | **Per-user budgets** ($0.15/day per seat, `403 budget_exceeded` when exceeded) and a **workspace spend ceiling** ($5.00/month) |

The UI shows, for every stage, which model and provider actually served it, whether a fallback happened, cost, and the real gateway tool calls with the sandbox code and output.

### Otari features actually used by the app
Multiple open-weight models in distinct roles · web search · web fetch · MCP · code execution · guardrails · per-user budgets · workspace budget · routing policy and fallbacks. Enabling something in the dashboard was never counted as "used": each one is exercised by a live run.

### Why Otari
One endpoint gave the app model choice (4 families), live web access, a code sandbox, tool servers, an input guard and per-user spend control without building any of that infrastructure. Provider fallback fired for real during testing (`gpt-oss-120b`: DeepInfra → OVHcloud).

### Honest limits
- Some sites block Otari's page reader (DoraHacks returns HTTP 405), so Kestrel then relies on search results and marks fields "unknown".
- The guardrail is a transparent heuristic screen, not an ML classifier.
- A run costs roughly $0.05–0.10 and takes about 2–3 minutes.

### Tech stack
Next.js (App Router), TypeScript, Tailwind CSS, Vercel; Otari hosted gateway (EU), DeepWiki MCP server.

### Hackathon requirements
- Otari.ai sign-up email: YOUR_OTARI_EMAIL
- Hackathon branch: `hackathon` — https://github.com/Nailer/kestrel/tree/hackathon
- First commit where Otari came in: https://github.com/Nailer/kestrel/commit/41a25e52d63caea1af691d1f970fe5d0496b4d1b
- Issues/PRs opened on mozilla-ai/otari: YOUR_ISSUE_LINKS_OR_NONE
- Otari feedback screen recording: YOUR_FEEDBACK_VIDEO_URL
