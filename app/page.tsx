"use client";

import { useState } from "react";
import type { Brief } from "@/lib/pipeline";
import { SEATS } from "@/lib/seats";

type Stage = {
  role: string;
  status: "running" | "done" | "skipped" | "error";
  model?: string;
  meta?: { provider?: string; model?: string; fallback?: boolean; durationMs?: number; costUsd?: number };
  features?: string[];
  note?: string;
  toolCalls?: { id: string; type: string; status?: string; code?: string; stdout?: string }[];
};

const LABEL: Record<string, string> = { triage: "1 · Triage", researcher: "2 · Research", analyst: "3 · Analysis (sandbox)", writer: "4 · Brief", guard: "Input guard" };
const VERDICT: Record<string, string> = {
  go: "bg-emerald-100 text-emerald-900 border-emerald-300",
  maybe: "bg-amber-100 text-amber-900 border-amber-300",
  "no-go": "bg-rose-100 text-rose-900 border-rose-300",
};
const EXAMPLE = "https://dorahacks.io/hackathon/mozilla-devs-wilding";

const HOW = [
  ["Triage", "Mistral Small", "Reads your link, plans what must be verified. Your input is screened for prompt injection first (Otari guardrail)."],
  ["Research", "gpt-oss-120b (fails over to DeepSeek)", "Searches the web, reads pages, and asks the sponsor's GitHub docs through an MCP server (Otari web search, web fetch, MCP)."],
  ["Analysis", "DeepSeek V3.2", "Does every calculation by running real code in a sandbox: days left to the deadline, prize per effort day (Otari code execution)."],
  ["Brief", "gpt-oss-20b", "Writes the go / maybe / no-go brief. Anything it could not verify is marked unknown, never guessed."],
] as const;

export default function Home() {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"demo" | "key">("demo");
  const [seat, setSeat] = useState<string>(SEATS[0]);
  const [apiKey, setApiKey] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [error, setError] = useState<{ message: string; code?: string; scope?: string; retry?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStages([]);
    setBrief(null);
    setError(null);
    try {
      const res = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "key" ? { url, notes, apiKey } : { url, notes, userId: seat }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line) continue;
          const ev = JSON.parse(line);
          if (ev.type === "stage") setStages((p) => [...p.filter((s) => s.role !== ev.role), ev]);
          else if (ev.type === "brief") setBrief(ev.brief);
          else if (ev.type === "fatal") setError({ message: ev.error, code: ev.code, scope: ev.budgetScope, retry: ev.retryAfter });
        }
      }
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  }

  const used = Array.from(new Set(stages.flatMap((s) => s.features ?? [])));
  const cost = stages.reduce((a, s) => a + (s.meta?.costUsd ?? 0), 0);
  const formatCost = (c: number) => (c < 0.001 ? c.toFixed(5) : c.toFixed(4));
  const hours = (s?: string) => {
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? Math.max(1, Math.round(n / 3600)) : undefined;
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-stone-900">
      {/* Hero */}
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-stone-500">Kestrel</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Scout a bounty before you spend a week on it.</h1>
        <p className="mt-3 text-lg text-stone-700">
          Paste the link to any hackathon or bounty. In about 2–3 minutes Kestrel reads the rules, researches the sponsor, works out the real deadline and odds with code, and tells you whether it is worth your time.
        </p>
        <a href="#try" className="mt-5 inline-block rounded bg-stone-900 px-5 py-2.5 font-medium text-white">Try it now ↓</a>
      </header>

      {/* What you get / who */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="What and who">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="font-semibold">What you get</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
            <li>A <b>go / maybe / no-go</b> verdict with the reason</li>
            <li>Deadline, <b>days left</b> and prizes, with sources</li>
            <li>Mandatory requirements and eligibility flags</li>
            <li>Risks, plus a clear list of what is still <b>unknown</b></li>
          </ul>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="font-semibold">Who it is for</h2>
          <p className="mt-2 text-sm text-stone-700">
            Solo developers and small teams who chase hackathons and bounties for income and lose days to opportunities with hidden deadlines, ineligibility, or poor odds. Not a prediction tool: it never invents win probabilities.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10" aria-label="How it works">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="mt-1 text-sm text-stone-600">Four different open-weight models, each with one job, all called through the <a className="underline" href="https://otari.ai">Otari</a> gateway.</p>
        <ol className="mt-4 space-y-2">
          {HOW.map(([name, model, text], i) => (
            <li key={name} className="rounded border border-stone-200 bg-white p-3 text-sm">
              <div className="font-medium">{i + 1}. {name} <span className="font-normal text-stone-500">· {model}</span></div>
              <div className="mt-0.5 text-stone-700">{text}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* Try it */}
      <section id="try" className="mt-10 scroll-mt-6" aria-label="Try it">
        <h2 className="text-xl font-semibold">Try it</h2>
        <form onSubmit={run} className="mt-3 space-y-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div>
            <label className="block text-sm font-semibold" htmlFor="url">Step 1 · Paste a hackathon or bounty link</label>
            <input id="url" required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full rounded border border-stone-300 px-3 py-2" />
            <button type="button" onClick={() => setUrl(EXAMPLE)} className="mt-1 text-sm text-stone-600 underline">Use an example (Mozilla Otari hackathon)</button>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-stone-600">Optional: paste the page text (helps when a site blocks readers)</summary>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm" />
            </details>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">Step 2 · Choose how to run it (no sign-up, no code)</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label className={`cursor-pointer rounded border p-3 text-sm ${mode === "demo" ? "border-stone-900 bg-stone-50" : "border-stone-300"}`}>
                <input type="radio" name="mode" className="mr-2" checked={mode === "demo"} onChange={() => setMode("demo")} />
                <b>Free demo seat</b>
                <p className="mt-1 text-stone-600">Uses our Otari account. Each seat has its own small daily budget ($0.15), enough for about one run. If a seat is used up, pick another or use your own key.</p>
                {mode === "demo" && (
                  <select aria-label="Demo seat" value={seat} onChange={(e) => setSeat(e.target.value)} className="mt-2 rounded border border-stone-300 px-2 py-1">
                    {SEATS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                )}
              </label>
              <label className={`cursor-pointer rounded border p-3 text-sm ${mode === "key" ? "border-stone-900 bg-stone-50" : "border-stone-300"}`}>
                <input type="radio" name="mode" className="mr-2" checked={mode === "key"} onChange={() => setMode("key")} />
                <b>Use your own Otari key</b>
                <p className="mt-1 text-stone-600">
                  Unlimited, billed to your own account. <a className="underline" href="https://otari.ai" target="_blank" rel="noreferrer">Create a free Otari account</a>, open <i>API keys</i>, create a key, paste it here. It is used for this request only and never stored.
                </p>
                {mode === "key" && (
                  <input aria-label="Otari API key" type="password" autoComplete="off" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required placeholder="otk_v1_…" className="mt-2 w-full rounded border border-stone-300 px-2 py-1" />
                )}
              </label>
            </div>
          </fieldset>

          <div>
            <div className="text-sm font-semibold">Step 3 · Scout it</div>
            <button disabled={busy} className="mt-1 rounded bg-stone-900 px-5 py-2 font-medium text-white disabled:opacity-50">{busy ? "Scouting… (2–3 min)" : "Scout it"}</button>
          </div>
        </form>
      </section>

      {stages.length > 0 && (
        <section className="mt-6" aria-label="Pipeline">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">Live pipeline · each stage is a separate Otari call</h2>
          <ol className="space-y-2">
            {stages.map((s) => (
              <li key={s.role} className="rounded border border-stone-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{LABEL[s.role] ?? s.role}</span>
                  <span className="text-stone-500">{s.status === "running" ? "running…" : s.status}</span>
                </div>
                {s.status !== "running" && (
                  <div className="mt-1 space-y-1 text-stone-600">
                    <div>
                      {s.meta?.model ?? s.model} via {s.meta?.provider ?? "?"}
                      {s.meta?.fallback ? " · provider fallback used" : ""}
                      {s.meta?.durationMs ? ` · ${(s.meta.durationMs / 1000).toFixed(1)}s` : ""}
                      {s.meta?.costUsd !== undefined ? ` · $${formatCost(s.meta.costUsd)}` : ""}
                    </div>
                    {s.features?.length ? <div>Otari features: {s.features.join(", ")}</div> : null}
                    {s.note && <div className="text-amber-700">{s.note}</div>}
                    {s.toolCalls?.map((t) => (
                      <details key={t.id} className="rounded bg-stone-50 p-2">
                        <summary className="cursor-pointer">Gateway tool call: {t.type} ({t.status})</summary>
                        {t.code && <pre className="mt-1 overflow-x-auto text-xs">{t.code}</pre>}
                        {t.stdout && <pre className="mt-1 overflow-x-auto text-xs text-emerald-800">{t.stdout}</pre>}
                      </details>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {error && (
        <div role="alert" className="mt-6 rounded border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
          <div className="font-semibold">{error.code === "budget_exceeded" ? "This demo seat has used its daily budget" : "Something went wrong"}</div>
          <div className="mt-1">{error.code === "budget_exceeded" ? "Pick another demo seat above, come back after it resets" : error.message}
            {error.code === "budget_exceeded" && error.retry ? ` (about ${hours(error.retry)} h)` : ""}
            {error.code === "budget_exceeded" ? ", or choose “Use your own Otari key” for unlimited runs." : ""}</div>
        </div>
      )}

      {brief && (
        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm" aria-label="Brief">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{brief.name}</h2>
              {brief.sponsor && <div className="text-sm text-stone-600">{brief.sponsor}</div>}
            </div>
            <span className={`rounded border px-2 py-1 text-sm font-semibold uppercase ${VERDICT[brief.verdict] ?? ""}`}>{brief.verdict}</span>
          </div>
          <p className="mt-3">{brief.verdict_reason}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Item k="Deadline (UTC)" v={brief.deadline_iso ?? "unknown"} />
            <Item k="Days remaining (computed in sandbox)" v={typeof brief.days_remaining === "number" ? brief.days_remaining.toFixed(1) : (brief.days_remaining != null ? String(brief.days_remaining) : "unknown")} />
            <Item k="Prize" v={brief.prize_summary ?? "unknown"} />
            <Item k="Effort estimate (days)" v={brief.effort_days_estimate != null ? String(brief.effort_days_estimate) : "unknown"} />
          </dl>
          <List title="Mandatory requirements" items={brief.mandatory_requirements} />
          <List title="Eligibility flags" items={brief.eligibility_flags} />
          <List title="Risks" items={brief.risks} />
          <List title="Unknowns" items={brief.unknowns} />
          {brief.sources?.length > 0 && <List title="Sources" items={brief.sources} />}
        </section>
      )}

      {used.length > 0 && <p className="mt-6 text-xs text-stone-500">Otari features exercised this run: {used.join(" · ")} · total ${formatCost(cost)}</p>}

      <footer className="mt-12 border-t border-stone-200 pt-4 text-xs text-stone-500">
        Built for Mozilla&apos;s Developers Wilding online hackathon with <a className="underline" href="https://otari.ai">Otari</a> (open-source AI gateway by Mozilla.ai). Briefs can be incomplete: sites that block readers leave fields “unknown”. Always check the official rules.
      </footer>
    </main>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-stone-500">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
      <ul className="mt-1 list-disc pl-5 text-sm text-stone-700">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );
}
