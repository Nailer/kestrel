# Kestrel — scout a bounty before you build

> Paste a hackathon or bounty URL. Kestrel reads the rules, researches the sponsor, computes the deadline and effort maths in a sandbox, and returns a go / maybe / no-go brief — with every stage served by a different open-weight model through the hosted [Otari](https://otari.ai) gateway.

Built for **Mozilla's Developers Wilding: Online hackathon** (https://dorahacks.io/hackathon/mozilla-devs-wilding).

**Live demo:** https://kestrel-inky-psi.vercel.app — no sign-up and no access code. Pick a free demo seat (small daily budget each) or paste your own Otari key for unlimited runs (used for that request only, never stored).

## Problem
Solo developers who chase hackathons and bounties lose days on opportunities with hidden deadlines, ineligibility, or poor odds. The facts live on JS-heavy pages, scattered docs and sponsor repos.

## What it does
Four open-weight model families in five separate Otari calls (each stage is its own call):

| Stage | Role | Model (default) | Otari features used |
|---|---|---|---|
| 1 | Triage + input guard | `mistralai/mistral-small-3.2-24b-instruct-2506` | **Guardrails** (custom prompt-injection service), **multi-model roles** |
| 2 | Sponsor docs | `openai/gpt-oss-120b` | **MCP**: one managed DeepWiki `ask_wiki_question` call per run on the sponsor's repo (repo taken from a GitHub link or a known-sponsor map; skipped and said so otherwise) |
| 3 | Research | `openai/gpt-oss-120b`, failover `deepseek/deepseek-v3.2` → `qwen-3.5-35b`; optionally called through the Otari **routing policy** named by `KESTREL_ROUTING_POLICY` | **Web search**, **web fetch**, **routing and fallbacks** (only when the policy or an Otari provider fallback really served the call) |
| 4 | Analysis | `deepseek/deepseek-v3.2` (12.7s vs 126–191s for `qwen-3.5-35b` on the same sandbox task) | **Code execution** (deadline + prize-per-effort maths in the sandbox) |
| 5 | Brief | `openai/gpt-oss-20b` | **Multi-model roles** |
| — | Seats | `seat-judge`, `seat-demo`, `seat-guest` | **Per-user budgets** (Otari service key + `user` field; each seat capped at $0.15/day, `403 budget_exceeded` when exceeded); **workspace budget** ($5.00/month ceiling); automatic provider fallback |

The UI shows, for each stage, the model that actually served it, its provider, whether a fallback happened, latency, cost, which gateway tool calls ran (with the sandbox code and stdout), and the guardrail verdict. Nothing is mocked: if a tool is unavailable the stage says so.

## Architecture
```
Browser ──POST /api/scout (NDJSON stream; demo seat or visitor Otari key)──▶ Next.js route (server only)
                                                              │  OTARI_* keys never reach the browser
                                                              ▼
                         lib/pipeline.ts ──▶ Otari gateway (https://eu.api.otari.ai/api/v1)
                           triage  ─ guardrails:[{profile:"prompt-injection", url:<our /api/guard>}]
                           docs    ─ mcp_servers:[deepwiki]  (forced, retried once if the model skips the tool)
                           research─ model: <routing policy | gpt-oss-120b>, tools:[otari_web_search, otari_web_fetch]
                           analysis─ tools:[otari_code_execution]
                           brief   ─ strict JSON
Otari ──POST /api/guard/validate──▶ lib/guard.ts   (heuristic prompt-injection screen)
```
Routes: `/` is the landing page (hero, scroll-driven animation `components/Flow.tsx`, how it works, Otari features); `/scout` is the app. Key files: `lib/otari.ts` (client), `lib/pipeline.ts` (stages), `lib/guard.ts` + `app/api/guard/*` (guardrail service), `lib/seats.ts`, `app/page.tsx` (landing), `app/scout/page.tsx` (app).

## Run locally
Prereqs: Node 20+, an Otari account and API key (https://otari.ai).
```bash
npm install
cp .env.example .env.local   # fill in OTARI_API_KEY (+ OTARI_BASE_URL for EU keys)
npm run dev                  # http://localhost:3000
npx tsx scripts/run-scout.ts https://dorahacks.io/hackathon/mozilla-devs-wilding   # CLI run
```
Environment variables: see `.env.example`. `OTARI_SERVICE_KEY` (a *service key*) is needed for per-seat attribution; `KESTREL_GUARDRAIL_URL` points Otari at the validator (`https://<host>/api/guard`).

Workspace prerequisites in the Otari dashboard: enable web access (Tools → Web search), optional MCP server registration.

## Tests and verification scripts
```bash
npx tsc --noEmit && npm run lint
npx tsx scripts/guard-test.ts      # guardrail unit tests
node scripts/probe.mjs             # feature probe against your Otari workspace
node scripts/tool-check.mjs        # web search/fetch end-to-end
node scripts/mcp-check.mjs         # MCP end-to-end (asserts a real tool call ran)
```
Evidence of live verification is in `docs/` (probe results, friction log, test report).

## Security notes
- API keys live only in server env (Vercel encrypted env vars). `.env*` is git-ignored except `.env.example`.
- No shared secret to hand out: abuse is bounded by a fixed seat allow-list (visitors cannot mint end users), per-seat daily budgets ($0.15) and a workspace spend ceiling ($5.00/month). A visitor's own Otari key is validated by format, forwarded for that single request, and never stored or logged.
- Fetched web content is untrusted: the research prompt forbids following instructions inside it.
- The guardrail is a transparent **heuristic** (regex scoring), not an ML classifier. Request-level Otari guardrail entries carry no credential, so the validator endpoint is unauthenticated by design (stateless, input-capped). For production use a vendor profile (Lakera, Azure Prompt Shields) via the Otari dashboard.

## Known limitations
- Some hackathon sites (including DoraHacks) block Otari's fetcher (HTTP 405); Kestrel then relies on search results and says `unknown` where it can't verify.
- Per-seat limits come from an Otari **service key** whose *End-user budgets* include `kestrel-seat` ($0.15/day, set as the default). Each seat's spend is capped independently; a seat over its cap gets `403 budget_exceeded`, which the UI shows as "Budget reached for this seat". Setting this up in the dashboard is fiddly (see `docs/FEEDBACK-LOG.md` #23).
- A full run costs roughly $0.05–0.10 and takes about 2–3 minutes (measured 167s on the live site, 2026-11-06).
- Effort/EV figures appear only when a source states them; Kestrel never invents probabilities.

## License
MIT — see `LICENSE`. Otari (Apache-2.0), any-llm and DeepWiki MCP are used as external services.
