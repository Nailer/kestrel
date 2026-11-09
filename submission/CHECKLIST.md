# What is left — validity first, then points (researched 2026-11-06)

Sources: DoraHacks page + rubric doc (read), Eventbrite page, otari GitHub issues/PRs. **Discord was not readable** (login required) — ask there for anything not listed.
Deadline: **2026-11-11 23:59 UTC+1 = 22:59 UTC.** Aim to submit by Nov 11 18:00 UTC. Registered hackers: 97 (was 78 on Nov 4).

## A. Validity — miss any of these and you are "not eligible for prizes" (organizer's words)
- [ ] Registered on DoraHacks: name/pseudonym, **the email you use on Otari.ai**, one-line project.
- [ ] Signed up at otari.ai (done) with that same email.
- [ ] Joined the Mozilla OSAI Discord + took the `devs-wilding` role (updates and questions).
- [ ] Starred https://github.com/mozilla-ai/otari
- [ ] **GitHub repo is PUBLIC** (it is private now) + branch name `hackathon`.
- [ ] First-commit link: `https://github.com/Nailer/kestrel/commit/41a25e52d63caea1af691d1f970fe5d0496b4d1b`
- [ ] Otari features used — listed in `description.md`.
- [ ] Issues/PRs opened on the Otari repo (optional field; drafts in `ISSUE-DRAFTS.md`).
- [ ] **Demo video, 3–5 min**, screen recording WITH your own voice. No AI voiceover/AI-generated video.
- [ ] **Feedback**: screen recording 3–5 min answering the 4 questions, and/or written answers to the 3 questions — do both.

## B. Points (100): where Kestrel stands
| Rubric | Max | Kestrel | Do this to protect it |
|---|---|---|---|
| ≥1 open-weight model, meaningfully | 20 | yes | say it in the video |
| ≥2 open-weight models in different roles | +10 | yes (4 families) | show the per-stage model list |
| Otari features, 10 each, cap 60 (routing/fallback, MCP, web search/fetch, code exec, budgets, multi-model roles, guardrails, per-user budgets) | 60 | 7 verified live + routing policy once you create it (cap is 60, so 6 suffice) | **only counts if the app uses it** — in the video run one real scout and point at each tool call in the pipeline panel |
| Works + real use case | 5 | yes | run it live, once, end to end |
| Video clearly explains Otari integration and shows capabilities | 5 | depends on you | follow `docs/VIDEO-SCRIPT.md`; say which feature each stage uses |

## C. Risks that could lose the submission
1. **Rotating keys too early breaks the demo.** "Rotate afterwards" means after judging. The live site uses `OTARI_API_KEY`/`OTARI_SERVICE_KEY` in Vercel. If you rotate either, update Vercel in the same minute.
2. **Wallet balance.** It was ~$1.93 on Nov 4 before many test runs; each run is $0.05–0.10 and the workspace ceiling is $1.50/month. If the balance hits zero judges get a billing error. Check Otari → Billing before you submit; topping up is your call (4.5% fee).
3. **Demo seats are tiny** ($0.15/day each, 3 seats). They reset at 00:00 UTC. Judges can always paste their own Otari key (explained on the page).
4. **Repo still private** → link 404s → no valid code link.
5. **Do not show secrets in videos**: hide API keys on the Otari dashboard (Keys page), `.env.local`, Vercel env screens.
6. **Date confusion**: DoraHacks says deadline Nov 11 23:59 UTC+1; the Eventbrite listing says Oct 29–Nov 12. Trust DoraHacks and submit early; ask in Discord if you want certainty.
7. **Videos can't use AI.** Record in QuickTime/OBS/Loom with your mic on; no AI captions or voice.
8. Don't claim what isn't proven: Kestrel's guardrail is a heuristic; DoraHacks pages can't be fetched by Otari; workspace ceiling is configured but was never tripped.

## D. Things that make it stronger (cheap)
- Mention in the video that your findings match real open Otari issues (#2955 guardrail credential not sent, #2722 keyless guardrail on hosted): your custom `url` guardrail is the documented workaround.
- File the 3 issues in `ISSUE-DRAFTS.md` (≈10 min) — the form asks for them and maintainers read them.
- In the feedback video use `docs/FEEDBACK-LOG.md` as a reminder of what actually cost time (web tools disabled by default, MCP silent no-op, service-key budget setup).
- Prize is 1st $1,000 + 3h with Mozilla.ai engineers; 2nd $200; 3rd 1h. Ask for the mentoring time to be about routing and hosted guardrails.

## E. Updated 2026-11-09 after the rubric review
- MCP is now its own stage and runs deterministically every time a sponsor repo is known (GitHub link, or Otari/known sponsors). Verified live: `mcp:completed`.
- The guardrail verdict (`Otari-Guardrails` header: valid, score, mode) and failed-tool-call reasons are now shown in the UI.
- Three examples on the page: a GitHub PR (fetch works), DoraHacks with the pasted rules (so the brief is rich), and a Devpost list.
- Each model is labelled open-weight (with licence) in the pipeline panel.
- The description's routing-policy wording is only true after you create policy `kestrel-research` AND set `KESTREL_ROUTING_POLICY=kestrel-research` in Vercel. If you skip that, delete "via Otari routing policy `kestrel-research`, DeepSeek V3.2 as backup" and "routing policy and" from `description.md`, and do not claim routing in the video.
