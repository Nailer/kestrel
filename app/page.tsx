import Link from "next/link";
import Flow from "@/components/Flow";

const STAGES = [
  { name: "Triage and guardrail", model: "Mistral Small 3.2", feature: "Guardrails", text: "Reads your link and plans what must be verified. Before any model sees your text, Otari sends it to Kestrel's own validator and blocks prompt-injection attempts." },
  { name: "Sponsor docs", model: "gpt-oss-120b", feature: "MCP", text: "Asks the sponsor's GitHub documentation a question through a managed MCP server that the Otari gateway runs for us." },
  { name: "Research", model: "gpt-oss-120b, failing over to DeepSeek V3.2", feature: "Web search, web fetch, routing", text: "Searches the web and reads the official pages. If a model comes back empty or a provider fails, the work moves to another model." },
  { name: "Analysis", model: "DeepSeek V3.2", feature: "Code execution", text: "Every number is computed by real code in Otari's sandbox: days left to the deadline, prize per day of effort. Nothing is estimated in the model's head." },
  { name: "Brief", model: "gpt-oss-20b", feature: "Multiple models in distinct roles", text: "Writes the go, maybe or no-go brief. Anything it could not verify is marked unknown instead of guessed." },
] as const;

const FEATURES = [
  ["Open-weight models", "Mistral, gpt-oss, DeepSeek and Qwen, each with a different job."],
  ["Web search and fetch", "Run by the gateway; every call and its result is shown in the app."],
  ["MCP", "A managed DeepWiki server answers questions about the sponsor's repository."],
  ["Code execution", "A sandbox runs the date and prize maths and returns the code and its output."],
  ["Guardrails", "Otari calls Kestrel's validator on every request and returns the verdict."],
  ["Per-user budgets", "Each demo seat is an Otari end user with its own daily limit."],
  ["Budgets and spending limits", "A workspace ceiling caps total spend; Otari refuses calls past it."],
  ["Routing and fallbacks", "Otari picks the provider per call and fails over when one is down."],
  ["Bring your own key", "Visitors can run Kestrel on their own Otari account, unlimited."],
] as const;

export default function Landing() {
  return (
    <div className="bg-night text-slate-200">
      {/* 1. Hero: heading, text, one button */}
      <header className="relative flex min-h-screen flex-col px-6 py-6 md:px-16">
        <Link href="/" className="flex items-center gap-3 self-start" aria-label="Kestrel home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={36} height={36} className="rounded-lg" />
          <span className="font-display text-lg font-semibold text-white">Kestrel</span>
        </Link>
        <div className="my-auto max-w-4xl py-16">
          <h1 className="font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-semibold leading-[1.02] tracking-tight text-white">
            Know whether a bounty is worth your week before you spend it.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Hackathons and bounties scatter their real deadlines, eligibility rules and odds across pages nobody has time to read twice. Paste a link and Kestrel reads the rules, researches the sponsor, works out the numbers with real code, and hands you a go, maybe or no-go brief in about three minutes. Every figure is computed, every claim has a source, and whatever could not be verified is marked unknown instead of guessed.
          </p>
          <Link href="/scout" className="mt-10 inline-block rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-night transition hover:bg-amber-300">
            Scout a bounty
          </Link>
        </div>
      </header>

      {/* 2. Scroll-driven animation */}
      <Flow />

      {/* 3. What you get */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-28 md:grid-cols-2 md:px-10" aria-labelledby="get">
        <div>
          <h2 id="get" className="font-display text-4xl font-semibold text-white md:text-5xl">A brief you can decide on.</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-300">
            You get the verdict first, then the facts behind it: deadline and days left, prizes, mandatory requirements, eligibility flags, risks, and a plain list of what is still unknown. Kestrel never invents a win probability.
          </p>
          <p className="mt-5 max-w-md text-slate-400">
            Built for solo developers and small teams who chase hackathons and bounties for income and cannot afford a week on the wrong one.
          </p>
        </div>
        <figure className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-xl font-semibold text-white">Mozilla Otari Hackathon, Devs Wilding Online</div>
              <div className="mt-1 text-sm text-slate-400">Mozilla, hosted on DoraHacks</div>
            </div>
            <span className="rounded-md bg-amber-400/15 px-2.5 py-1 text-sm font-semibold text-amber-300">Maybe</span>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Deadline</dt><dd className="mt-0.5 text-slate-100">2026-11-11 22:59 UTC</dd></div>
            <div><dt className="text-slate-400">Prize pool</dt><dd className="mt-0.5 text-slate-100">$1,200 plus mentoring hours</dd></div>
            <div><dt className="text-slate-400">Must use</dt><dd className="mt-0.5 text-slate-100">Mozilla Otari</dd></div>
            <div><dt className="text-slate-400">Effort</dt><dd className="mt-0.5 text-slate-100">Unknown</dd></div>
          </dl>
          <figcaption className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
            Output from a real Kestrel run. The days remaining figure is computed in the sandbox, and fields the sources did not state stay unknown.
          </figcaption>
        </figure>
      </section>

      {/* 4. How it works */}
      <section className="border-t border-white/10" aria-labelledby="how">
        <div className="mx-auto max-w-6xl px-6 py-28 md:px-10">
          <h2 id="how" className="font-display text-4xl font-semibold text-white md:text-5xl">Five stages. Four open-weight model families.</h2>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">Each stage is its own call through Otari, so the app shows which model and provider answered, what it cost, and which tools ran.</p>
          <ol className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {STAGES.map((s, i) => (
              <li key={s.name} className="grid gap-3 py-7 md:grid-cols-[3rem_16rem_1fr] md:gap-8">
                <span className="font-display text-2xl text-amber-300">{i + 1}</span>
                <div>
                  <div className="font-display text-xl font-semibold text-white">{s.name}</div>
                  <div className="mt-1 text-sm text-slate-400">{s.model}</div>
                </div>
                <div>
                  <p className="leading-relaxed text-slate-300">{s.text}</p>
                  <p className="mt-2 text-sm text-amber-300/90">Otari: {s.feature}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Otari features */}
      <section className="border-t border-white/10" aria-labelledby="otari">
        <div className="mx-auto max-w-6xl px-6 py-28 md:px-10">
          <h2 id="otari" className="font-display text-4xl font-semibold text-white md:text-5xl">What Otari does in this app.</h2>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">Kestrel is built on the hosted Otari gateway from Mozilla.ai. Each capability below is used by a real run, not just switched on in a dashboard.</p>
          <dl className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([k, v]) => (
              <div key={k} className="border-l-2 border-amber-400/70 pl-4">
                <dt className="font-display text-lg font-semibold text-white">{k}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-400">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-14 max-w-2xl text-sm leading-relaxed text-slate-400">
            Limits, stated plainly: some sites block page readers, so Kestrel then leans on search results and marks fields unknown. The guardrail is a transparent rule-based screen, not a trained classifier. A run takes two to three minutes and costs a few cents.
          </p>
        </div>
      </section>

      {/* 6. Call to action */}
      <section className="border-t border-white/10 bg-gradient-to-b from-night to-slate-900" aria-labelledby="cta">
        <div className="mx-auto max-w-4xl px-6 py-28 text-center md:px-10">
          <h2 id="cta" className="font-display text-4xl font-semibold text-white md:text-6xl">Scout your next bounty.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">No account and no code. Use a free demo seat, or bring your own Otari key.</p>
          <Link href="/scout" className="mt-9 inline-block rounded-lg bg-amber-400 px-8 py-4 text-base font-semibold text-night transition hover:bg-amber-300">
            Open the app
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-xs text-slate-500 md:px-16">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span>Built for Developers Wilding, the Otari hackathon by Mozilla.ai. Always check the official rules before you commit.</span>
          <span className="flex gap-5">
            <a className="underline hover:text-slate-300" href="https://github.com/Nailer/kestrel">Source code</a>
            <a className="underline hover:text-slate-300" href="https://otari.ai">otari.ai</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
