# STOP: do not submit the silent videos. Use this only as a script and teleprompter.

The official page says: "video demonstration and video feedback cannot use AI. It must be a screen recording with audio of the hackathon participant demonstrating their project." The silent videos in `submission/videos/` were recorded by an automated browser and assembled with generated cards, so they do not meet that rule and could cost the 10 demo points or the eligibility. Record your own screen with your own voice instead. The timeline and the "Say" tables below, and the `*-WITH-LYRICS-guide.mp4` files, are fine to use as a script to read from while you record.

Fast way to record: QuickTime → File → New Screen Recording, microphone on, then follow the demo table below in order, using `seat-demo` for the main run (`seat-judge` has too little budget left today for a full run) and `seat-guest` for the budget-refusal moment.

---

# Video production: silent videos made for you, you add your own voice

Files are in `submission/videos/` (not committed to git, they are large):

| File | Use |
|---|---|
| `kestrel-demo-silent.mp4` (4:25) | The demo video, no audio. Add your voice, upload this. |
| `kestrel-feedback-silent.mp4` (3:30) | The feedback video, no audio. Add your voice, upload this. |
| `kestrel-demo-WITH-LYRICS-guide.mp4` | Same video with the words to say shown on screen. Play it while you read. **Never upload this one.** |
| `kestrel-feedback-WITH-LYRICS-guide.mp4` | Same, for the feedback video. |
| `demo-lyrics.srt`, `feedback-lyrics.srt` | The same words as subtitles, if your editor can import them. |

## What the footage is
Real screen recordings of the live app at https://kestrel-inky-psi.vercel.app, captured with an automated browser on 2026-11-11 (about 18:00 UTC): one real run on `seat-judge`, a real prompt-injection block, a real budget refusal on `seat-guest`, plus screenshots of your real Otari dashboard (Requests, Routing, Spend & budgets). Nothing is mocked or generated. The waiting parts are sped up and labelled "Time-lapse". Text cards and labels were added on top.

Because the footage was recorded by automation and not by you by hand, say so in your email in one line (suggested wording at the bottom). If you would rather record by hand, `docs/VIDEO-SCRIPT.md` still has the step-by-step version.

## Add your voice (about 20 minutes)
**Easiest: iMovie.**
1. iMovie → Create New → Movie. Import `kestrel-demo-silent.mp4` and drag it to the timeline.
2. Put the lyrics guide video (or this page's tables) on a second screen or your phone.
3. Click the microphone button under the viewer (Record Voiceover). Move the playhead to the start, press the red button after the 3-second countdown, and read the words for each section as the video plays. Press stop at the end.
4. Not happy with a part? Place the playhead there and record again; it replaces that part.
5. File → Share → File → 1080p. Do the same for the feedback video.

**Alternative:** record only your voice (QuickTime → File → New Audio Recording) while the guide video plays, save as `voice.m4a`, then merge:

```bash
ffmpeg -i kestrel-demo-silent.mp4 -i voice.m4a -map 0:v -map 1:a -c:v copy -c:a aac -shortest kestrel-demo-final.mp4
```

Tips: speak slower than feels natural, in your own words if you prefer (the lyrics are a guide, any sentence in a section is fine as long as it matches what is on screen). The times below are when each section starts; if your voice runs longer than a section, freeze that frame in iMovie (right-click clip → Add Freeze Frame).

## Check before you read
- Say only what you agree is true. The feedback points come from our real build log (`docs/FEEDBACK-LOG.md`), but the written feedback and your own voice are yours. Drop any line you do not stand behind.
- The demo verdict says No-go because the deadline is about six hours away at recording time. That is real; the lyrics say it that way.

## Demo video: what to say (in order)

| Starts | Length | Say |
|---|---|---|
| 0:00 | 7s | Hi, this is Kestrel, my entry for Developers Wilding, built on Otari. |
| 0:07 | 13s | If you chase bounties for income, you can lose days on one with a hidden deadline or bad odds. Kestrel reads the link and tells you if it is worth your week. |
| 0:19 | 23s | Scrolling turns the page into five strands, one for each stage of the pipeline. Open-weight models hand work to each other, the tools run inside the gateway, and all of it passes through one place: Otari. |
| 0:42 | 10s | Here is what you get: a brief with a verdict, the deadline, the prizes, and a plain list of what is still unknown. |
| 0:51 | 20s | Five stages, four open-weight model families. Mistral triages, gpt-oss reads the docs and researches, DeepSeek does the maths, and a small gpt-oss writes the brief. And these are the Otari features it uses, each one exercised by a real run. |
| 1:11 | 5s | Now let's open the app and run it for real on a live link. |
| 1:16 | 13s | I pick an example link, the Otari announcement on GitHub. I'm using the demo seat seat-judge, which is an Otari end user with its own budget. Then I press Scout. |
| 1:29 | 12s | Stage one is Mistral Small. Before it sees my text, Otari calls my own validator. The verdict comes back in the headers: valid, score zero, mode block. |
| 1:41 | 10s | Stage two is MCP. gpt-oss-120b asks DeepWiki about the sponsor's repo, and the gateway runs that call. |
| 1:51 | 9s | Stage three is research. Web search and fetch also run inside the gateway. It takes about a minute, so I'm speeding it up. |
| 2:00 | 7s | Stage four runs the date maths as real code in Otari's sandbox. Nothing is estimated in the model's head. |
| 2:07 | 6s | Stage five, gpt-oss-20b, writes the brief. Done in about two and a half minutes. |
| 2:13 | 9s | One honest detail: the primary researcher returned empty text, so the app failed over to DeepSeek. The note is right there on screen. |
| 2:22 | 28s | Every gateway tool call is recorded with its result. Here is the MCP call to DeepWiki, then web fetches and searches, one search that failed, shown instead of hidden, and the code Otari's sandbox ran for the date maths, with its output. |
| 2:50 | 17s | The verdict is No-go, because only about six hours remain before the deadline. Anything the sources did not state stays unknown. The line above shows the features used, the cost, and the budget it was billed to. |
| 3:07 | 16s | Now the guardrail. I paste a prompt-injection attack and press Scout. Otari asks my validator, gets a block, and returns a 403 before any model runs. |
| 3:23 | 9s | Now the per-user budget. seat-guest has already spent almost all of its 15 cents for today, so I run it anyway. |
| 3:32 | 6s | It starts, then Otari stops it part-way through. |
| 3:38 | 9s | The app shows that this seat has used its daily budget. The refusal comes from Otari, with a 403 budget exceeded. |
| 3:47 | 10s | On the Otari side, here are the requests: every call, per seat, and the routing policy that served the research step. |
| 3:57 | 10s | Here is the routing policy kestrel-research: gpt-oss-120b first, DeepSeek as the backup, plus the automatic fallback order for each model. |
| 4:07 | 10s | And the budgets: 15 cents a day per seat, and a five-dollar monthly ceiling on the whole workspace. |
| 4:17 | 8s | That's Kestrel: open source, live today, and every model, tool and budget goes through Otari. Thanks for watching. |

## Feedback video: what to say (in order)

| Starts | Length | Say |
|---|---|---|
| 0:00 | 8s | This is my feedback on Otari after building Kestrel for Developers Wilding: what worked, what didn't, and what I'd change. |
| 0:08 | 3s | Question one: what I built. |
| 0:11 | 9s | Kestrel takes a hackathon or bounty link and returns a go, maybe or no-go brief in about three minutes. |
| 0:20 | 14s | Five stages, each its own call through Otari, so the app can show which model answered, what it cost, and which tools ran. |
| 0:34 | 19s | I used four open-weight model families in distinct roles. Web search, fetch, code execution and a managed MCP server all run in the gateway. A request-level guardrail calls my own validator. And per-user budgets, a workspace ceiling and a routing policy control the spend. |
| 0:53 | 3s | Question two: what worked well. |
| 0:56 | 13s | The first thing I liked is how visible everything is. Every response carries headers for the provider, the attempt count, whether a fallback happened, the budget, and the guardrail verdict. |
| 1:09 | 10s | The dashboard's request log shows every call, per seat, and which routing policy served it. |
| 1:19 | 10s | Automatic provider fallback worked on its own. This table shows how often each model moved to another provider. |
| 1:29 | 20s | To sum up: one OpenAI-compatible endpoint for open-weight models, every gateway tool call returned with its code and output, clear 403s for budgets and guardrails, and an MCP Test connection button that found my mistake quickly. |
| 1:49 | 3s | Question three: what didn't work. |
| 1:52 | 21s | Setup was the hard part. Web search, fetch and code execution were off on a fresh workspace. Routing, budgets and service keys are dashboard-only. Per-user budgets returned 403 until I ticked the budget in the key's Edit dialog, and the ID works but the name doesn't. And I set up the wrong region first. |
| 2:13 | 22s | Failures were often silent. A wrong allowed-tools name for MCP exposed zero tools with an HTTP 200, and the model made up an answer. A custom guardrail had no credential field and failed with just 'evaluation failed'. And gpt-oss-120b sometimes returned empty text after a tool loop, so I built the failover myself. |
| 2:35 | 9s | This is that empty-response case live: the primary model returned nothing, and my app had to fail over to DeepSeek. |
| 2:44 | 10s | Smaller things: a new routing policy said invalid model for about twenty seconds, and my own demo came close to the workspace spend ceiling. |
| 2:54 | 3s | Question four: what I'd change. |
| 2:57 | 26s | I'd like a hosted guardrail that needs no service of my own, a warning when an MCP tool name doesn't match, and 'empty final message' as a trigger for routing fallback. Clearer failure reasons for web fetch, a warning before a spend ceiling blocks users, and one setup guide for service keys, budgets and regions. |
| 3:23 | 7s | Thanks to the Otari team. Kestrel is open source, and the link is in my email. |

