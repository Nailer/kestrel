# The OFFICIAL way to enter and submit: email (per otari.ai/devs-wilding)

The organisers' own page says registration AND submission are by email to **marcus+wilding@mozilla.org**.
"If your submission email does not include these items, you will not be eligible for prizes."
Submit through this email in addition to any DoraHacks form. Send from the address you will use as your Otari sign-up email.

## A. If you have NOT yet registered by email (do this first, today)

To: marcus+wilding@mozilla.org
Subject: Developers Wilding sign-up

```
Name or pseudonym: YOUR_NAME
Email I will use to sign up to Otari.ai: YOUR_OTARI_EMAIL
My project in one sentence: Kestrel is a web app that takes a hackathon or bounty link and returns a verified go/no-go brief in about three minutes, built on Otari with four open-weight models, web search/fetch, MCP, code execution, a guardrail and per-user budgets.

Note: I am registering late (I found the email step after the original date). I have already built the project and am sending the full submission now or within hours. Please confirm I am registered.
```
(Only keep the "late" note if you did not register before Oct 28. If you did, skip section A and reply on the SAME thread in section B.)

## B. The submission: REPLY to the registration/confirmation thread (or send a new mail if you have none)

To: marcus+wilding@mozilla.org
Subject: Re: Developers Wilding sign-up (Kestrel submission)

```
1. Project
   Name: Kestrel
   Otari.ai sign-up email: YOUR_OTARI_EMAIL
   One line: Paste a hackathon or bounty link and get a verified go/no-go brief in about three minutes, built on Otari with four open-weight model families.
   Live app (no sign-up, no code): https://kestrel-inky-psi.vercel.app

2. Code
   Public repo: https://github.com/Nailer/kestrel
   Hackathon branch: hackathon  (https://github.com/Nailer/kestrel/tree/hackathon)
   First commit where Otari came in: https://github.com/Nailer/kestrel/commit/41a25e52d63caea1af691d1f970fe5d0496b4d1b

3. Otari features used (each exercised by the live app)
   - Open-weight models in distinct roles: Mistral Small 3.2 (triage), gpt-oss-120b (sponsor docs + research), DeepSeek V3.2 (analysis + research backup), gpt-oss-20b (brief writer)
   - Web search and web fetch (otari_web_search, otari_web_fetch)
   - MCP (managed DeepWiki server, ask_wiki_question)
   - Code execution (otari_code_execution: date and prize maths in the sandbox)
   - Guardrails (request-level prompt-injection guardrail calling my own /validate service)
   - Per-user budgets (service key + user field; seats capped at $0.15/day; 403 budget_exceeded)
   - Budgets and spending limits (workspace spend ceiling)
   - Routing and fallbacks: IF_YOU_COMPLETED_THE_ROUTING_POLICY "routing policy kestrel-research (gpt-oss-120b, backup DeepSeek V3.2)" ELSE DELETE THIS LINE

4. PRs / issues opened on mozilla-ai/otari
   YOUR_ISSUE_LINKS_OR_"None"

5. Demo video (3-5 min): YOUR_DEMO_VIDEO_URL

6. Feedback
   Screen recording (3-5 min): YOUR_FEEDBACK_VIDEO_URL
   Written answers:
   - When were you most tempted to skip Otari and call the provider directly? What happened?
     YOUR_OWN_WORDS
   - What did you end up building yourself that Otari should've done for you?
     YOUR_OWN_WORDS
   - If the rules hadn't required Otari, would you have continued using Otari? Why or why not?
     YOUR_OWN_WORDS

Thanks, YOUR_NAME
```

Checks before pressing send: repo is public (it is), video links open while logged out, no secrets visible in the videos, every YOUR_ placeholder replaced. Send before Nov 11 18:00 UTC; the page says "November 11, 11:59 PM" without a time zone, so do not cut it close.
