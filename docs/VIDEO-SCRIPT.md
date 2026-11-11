# Video scripts: you record these (your screen, your own voice, NO AI voice, avatars or generated footage)

The "Say" lines are prompts. Put them in your own words; reading them stiffly sounds worse than speaking naturally. Say only what is true.

**Deadline: the page says November 11, 11:59 PM with no time zone. Send the final email by 18:00 UTC today.**

## Before you press record (10 minutes)

1. **Set up two browser tabs** in Chrome, one window, side by side in order:
   - Tab 1: https://kestrel-inky-psi.vercel.app
   - Tab 2: Otari dashboard (https://otari.ai/dashboard/), signed in, on the **Requests** page (Overview → Requests tab). Do not open API keys.
2. **Prove the seat budget first** (so you can show it in the video): open the app, choose `seat-guest`, run any link until it says "This demo seat has used its daily budget". Leave that for the budget moment. `seat-guest` may already be close to its limit from my tests.
3. **Keep `seat-judge` fresh** for the main run (do not run it before recording). If it says the budget is used, use `seat-demo` instead.
4. Hide secrets: never open the Otari **API keys** page, `.env.local`, or Vercel environment variables on screen. Close other tabs and turn on Do Not Disturb.
5. Record with QuickTime (File → New Screen Recording), microphone on, 1080p or the full screen. One take is fine; small pauses are fine, you can trim them.
6. **The run takes 2 to 3 minutes. That is expected.** You will narrate through it (the plan below uses that time on purpose).

---

## VIDEO 1: Project demo (target 4:45, hard limit 5:00)

| When | DO (exact clicks) | SAY (your words, about this) |
|---|---|---|
| **0:00** | Tab 1, landing page top. Do not scroll yet. | "This is Kestrel. If you chase hackathons and bounties for income, you lose days on ones with hidden deadlines or bad odds. Kestrel reads the link and gives you a go, maybe or no-go brief in about three minutes. I built it for the Otari hackathon, and every model and tool call goes through hosted Otari." |
| **0:30** | Scroll slowly. The screen turns into five glowing strands, with captions: "A link goes in", "Open-weight models, one job each", "Tools run inside the gateway". Keep scrolling until the word **Otari** appears. | "Each strand is a stage of the pipeline. Open-weight models hand work to one another, the tools run inside the gateway, and everything passes through Otari." |
| **1:00** | Keep scrolling. Pause on **"Five stages. Four open-weight model families."** | "Five stages: Mistral Small triages, gpt-oss-120b reads sponsor docs and researches, DeepSeek does the analysis, gpt-oss-20b writes the brief. All open-weight." |
| **1:15** | Scroll to **"What Otari does in this app"**, then click **Open the app**. | "These are the Otari features the app really uses: web search and fetch, MCP, code execution, guardrails, per-user budgets, spend limits, routing and fallbacks." |
| **1:25** | On the app page: click the chip **Otari announcement (GitHub)**. Leave the seat on `seat-judge`. Click **Scout this link**. | "I pick an example, use a demo seat, and press Scout. Nothing is mocked. Each stage on the right is a separate Otari call." |
| **1:40** | Triage and Sponsor docs finish quickly. Point the cursor at the **Guardrail verdict** line under stage 1. | "Stage 1 is Mistral Small. Before any model sees my text, Otari calls my own validation endpoint. The verdict comes back in the Otari-Guardrails header: valid, score zero, mode block." |
| **2:00** | Expand the **mcp** tool call under **Sponsor docs** (click it). | "Stage 2 is MCP. gpt-oss-120b asks DeepWiki about the sponsor's repository. The gateway ran the call, and this is the record of it." |
| **2:20** | Research is running (the slow part). Switch to Tab 2 (Otari dashboard): **Requests**, then **Routing → Policies**. | "While it researches, here is the Otari side. Requests are grouped by model. And here is my routing policy, kestrel-research: gpt-oss-120b first, DeepSeek as backup." |
| **3:00** | Back to Tab 1. When Research is done, point at the line "Called through Otari routing policy kestrel-research" and the feature chips (web search, web fetch, routing and fallbacks). Expand one **web_fetch failed** call. | "Research ran through the routing policy. Web search and fetch ran in the gateway. Some fetches fail because sites block readers, and the app shows why instead of hiding it." |
| **3:30** | Analysis finishes. Expand the **code_execution** call and show the code and output. | "Stage 4 runs the date maths in Otari's code sandbox. This is the code and its output. The deadline countdown is computed, not guessed." |
| **3:50** | Brief appears. Scroll to the verdict, the deadline, days remaining, and **Still unknown**. Point at the line under the pipeline ("Otari features exercised... billed to per-user budget"). | "Stage 5 writes the brief. Anything it could not verify stays unknown. At the bottom: the features used this run, the total cost, and the per-user budget it was billed to." |
| **4:10** | Click **Page text (optional)**, then **Test the guardrail with a prompt-injection attack**, then **Scout this link**. A red "Blocked by the prompt-injection guardrail" panel appears in a few seconds. | "Now I paste a prompt injection. Otari asks my validator, gets a block, and returns HTTP 403 before any model runs." |
| **4:25** | Set the seat to the exhausted one (`seat-guest`), click **Scout this link**. The panel says the seat has used its daily budget. | "Each seat is an Otari end user with a 15 cent daily budget. Over the limit, Otari returns 403 budget exceeded." |
| **4:40** | Tab 2: bottom-left **Organization** → **Spend & budgets**. Show `kestrel-workspace-cap` and `kestrel-seat`. | "The workspace also has a spend ceiling of five dollars a month. Budgets and routing are configured in the dashboard and enforced by the gateway." |
| **4:50** | Stop. | "Kestrel is open source and the README lists each stage's Otari feature. Thanks for watching." |

If you are running long: drop the **0:30 to 1:15** scroll narration to a quick scroll, skip the Requests page, and keep the guardrail and budget moments (they are quick and prove features).

### If something goes wrong while recording
- **"Seat has used its daily budget" on the main run:** choose another seat in the dropdown and run again. Cut the failed take.
- **Research stage says the primary model returned empty and failed over to DeepSeek:** keep going and say so. It is real and the note is on screen.
- **A stage fails:** say what the panel says; do not hide it. Stop and restart if it ruins the take.
- **The run is slow:** keep talking about the dashboard (Tab 2) until it finishes.

### Every feature on screen = points
Guardrails (verdict line + block panel), MCP (mcp call), web search/fetch (research calls), code execution (code and output), per-user budgets (seat message), budgets and spending limits (Spend & budgets page), routing and fallbacks (policy line + policy page), open-weight models (badges), multiple models in distinct roles (five stages).

---

## VIDEO 2: Otari feedback (3 to 5 min). Screen recording, your own words

Answer the four questions in this order. Use `docs/FEEDBACK-LOG.md` only as a memory aid. Say only what you really experienced.

| When | Question | DO | Points you can make (if they happened to you) |
|---|---|---|---|
| **0:00** | **1. What did you build and which features?** | Show the landing page for 10 seconds, then the app with the pipeline panel from a finished run. | "Kestrel scouts hackathon and bounty links. I used open-weight models in distinct roles, web search and fetch, MCP, code execution, a custom guardrail, per-user budgets, a workspace spend ceiling, and a routing policy with fallback." |
| **1:00** | **2. What worked well, what surprised you?** | Show one `Otari-*` response header, `otari_tool_calls` in the UI, and the Requests page. | One OpenAI-compatible endpoint for many models. Gateway-run tools return a record of every call. The `Otari-Provider`, `Otari-Fallback` and `Otari-Guardrails` headers make behaviour visible. Per-user budgets returned a clear 403 with the reset time. Creating a fallback policy in the dashboard was quick. |
| **2:15** | **3. What did not work? Friction, with repro** | Reproduce on screen where you can (see list). | Web search, fetch and code execution were disabled by default and I had to find where to enable them. An MCP `allowed_tools` name that the server does not offer silently exposed zero tools and returned HTTP 200. The per-user budget header accepted the budget ID but not its name. Request-level guardrails with a custom URL have no credential, and failures say only "evaluation failed". `gpt-oss-120b` sometimes returned empty text after a tool loop, so I added failover. A new routing policy was briefly "unknown model" right after I created it. The dashboard's two regions (EU vs US) were confusing until I found the right one. Failed `web_fetch` calls show little reason. A workspace spend ceiling nearly blocked my own demo and I only noticed through a banner. |
| **4:00** | **4. What is missing, what would you change?** | Show the Policies or Guardrails page. | A hosted guardrail that needs no setup (there is an open issue for this). Clearer errors when MCP tools do not match. Budget warnings before a ceiling blocks users. Documentation of the `/v1` vs `/api/v1` base URL. |

Keep it honest and specific. Judges value a real bug with steps over praise.

## Written feedback (write in your own words, only what is true)
- **When were you most tempted to skip Otari and call the provider directly? What happened?** (Think: the web tools being off, the MCP silent no-op, or the guardrail credential issue.)
- **What did you build yourself that Otari should have done?** (Think: failover when a model returns empty text, and debugging the guardrail.)
- **If the rules had not required Otari, would you keep using it? Why or why not?**

## Upload
Upload both videos as **Unlisted** on YouTube (or Loom), open the links in a private window to check they play, and paste them into the email (`submission/EMAIL-SUBMISSION.md`, section B).
