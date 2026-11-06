# Kestrel — scout a bounty before you build

> Paste a hackathon or bounty URL. Kestrel reads the rules, researches the sponsor, computes the deadline and effort maths in a sandbox, and returns a go / maybe / no-go brief — with every stage served by a different open-weight model through the hosted [Otari](https://otari.ai) gateway.

Built for **Mozilla's Developers Wilding: Online hackathon** (https://dorahacks.io/hackathon/mozilla-devs-wilding).

**Live demo:** https://kestrel-inky-psi.vercel.app (gated by an access code to protect the Otari budget; judges get the code in the submission)

## Problem
Solo developers who chase hackathons and bounties lose days on opportunities with hidden deadlines, ineligibility, or poor odds. The facts live on JS-heavy pages, scattered docs and sponsor repos.

## What it does
Four distinct model roles, each a separate Otari call (all open-weight):

| Stage | Role | Model (default) | Otari features used |
|---|---|---|---|
| 1 | Triage + input guard | `mistralai/mistral-small-3.2-24b-instruct-2506` | **Guardrails** (custom prompt-injection service), **multi-model roles** |
| 2 | Research | `openai/gpt-oss-120b`, failover `deepseek/deepseek-v3.2` | **Web search**, **web fetch**, **MCP** (DeepWiki), model failover |
| 3 | Analysis | `deepseek/deepseek-v3.2` (12.7s vs 126–191s for `qwen-3.5-35b` on the same sandbox task) | **Code execution** (deadline + prize-per-effort maths in the sandbox) |
| 4 | Brief | `openai/gpt-oss-20b` | **Multi-model roles** |
| — | Seats | `seat-judge`, `seat-demo`, `seat-guest` | **Per-user (end-user) tracking** via an Otari service key; **workspace budget** ($1.50/month ceiling); automatic provider fallback |

The UI shows, for each stage, the model that actually served it, its provider, whether a fallback happened, latency, cost, which gateway tool calls ran (with the sandbox code and stdout), and the guardrail verdict. Nothing is mocked: if a tool is unavailable the stage says so.

## Architecture
```
Browser ──POST /api/scout (NDJSON stream, x-kestrel-code)──▶ Next.js route (server only)
                                                              │  OTARI_* keys never reach the browser
                                                              ▼
                         lib/pipeline.ts ──▶ Otari gateway (https://eu.api.otari.ai/api/v1)
                           triage  ─ guardrails:[{profile:"prompt-injection", url:<our /api/guard>}]
                           research─ tools:[otari_web_search, otari_web_fetch] + mcp_servers:[deepwiki]
                           analysis─ tools:[otari_code_execution]
                           brief   ─ strict JSON
Otari ──POST /api/guard/validate──▶ lib/guard.ts   (heuristic prompt-injection screen)
```
Key files: `lib/otari.ts` (client), `lib/pipeline.ts` (stages), `lib/guard.ts` + `app/api/guard/*` (guardrail service), `lib/seats.ts`, `app/page.tsx`.

## Run locally
Prereqs: Node 20+, an Otari account and API key (https://otari.ai).
```bash
npm install
cp .env.example .env.local   # fill in OTARI_API_KEY (+ OTARI_BASE_URL for EU keys)
npm run dev                  # http://localhost:3000
npx tsx scripts/run-scout.ts https://dorahacks.io/hackathon/mozilla-devs-wilding   # CLI run
```
Environment variables: see `.env.example`. `OTARI_SERVICE_KEY` (a *service key*) is needed for per-seat attribution; `KESTREL_ACCESS_CODE` gates the API; `KESTREL_GUARDRAIL_URL` points Otari at the validator (`https://<host>/api/guard`).

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
- The API is gated by an access code and a fixed seat allow-list so strangers can't mint end users or spend credit; a workspace spend ceiling caps total spend.
- Fetched web content is untrusted: the research prompt forbids following instructions inside it.
- The guardrail is a transparent **heuristic** (regex scoring), not an ML classifier. Request-level Otari guardrail entries carry no credential, so the validator endpoint is unauthenticated by design (stateless, input-capped). For production use a vendor profile (Lakera, Azure Prompt Shields) via the Otari dashboard.

## Known limitations
- Some hackathon sites (including DoraHacks) block Otari's fetcher (HTTP 405); Kestrel then relies on search results and says `unknown` where it can't verify.
- Per-user *budget limits* require an end-user budget attached to the service key, which hosted Otari only lets an operator assign; seats are tracked per user but not individually capped (see `docs/FEEDBACK-LOG.md`).
- A full run costs roughly $0.05–0.10 and takes about 2–3 minutes (measured 167s on the live site, 2026-11-06).
- Effort/EV figures appear only when a source states them; Kestrel never invents probabilities.

## License
MIT — see `LICENSE`. Otari (Apache-2.0), any-llm and DeepWiki MCP are used as external services.
