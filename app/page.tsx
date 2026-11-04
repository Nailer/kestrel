"use client";

import { useState } from "react";
import type { Brief } from "@/lib/pipeline";

type Stage = {
  role: string;
  status: "running" | "done" | "skipped" | "error";
  model?: string;
  meta?: { provider?: string; model?: string; fallback?: boolean; attempts?: number; durationMs?: number; costUsd?: number; guardrails?: unknown };
  features?: string[];
  note?: string;
  toolCalls?: { id: string; type: string; status?: string; code?: string; stdout?: string }[];
};

const LABEL: Record<string, string> = {
  triage: "Triage",
  researcher: "Research",
  analyst: "Analysis (sandbox)",
  writer: "Brief",
  guard: "Input guard",
};

const VERDICT_STYLE: Record<string, string> = {
  go: "bg-emerald-100 text-emerald-900 border-emerald-300",
  maybe: "bg-amber-100 text-amber-900 border-amber-300",
  "no-go": "bg-rose-100 text-rose-900 border-rose-300",
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [seat, setSeat] = useState("seat-alex");
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
        body: JSON.stringify({ url, notes, userId: seat }),
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
          if (ev.type === "stage") {
            setStages((prev) => [...prev.filter((s) => s.role !== ev.role), ev]);
          } else if (ev.type === "brief") setBrief(ev.brief);
          else if (ev.type === "fatal")
            setError({ message: ev.error, code: ev.code, scope: ev.budgetScope, retry: ev.retryAfter });
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-stone-900">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Kestrel</h1>
        <p className="mt-1 text-stone-600">Scout a bounty before you spend a week on it. Paste a hackathon or bounty URL and get a verified go / no-go brief.</p>
      </header>

      <form onSubmit={run} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium" htmlFor="url">Opportunity URL</label>
        <input id="url" required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://dorahacks.io/hackathon/…" className="w-full rounded border border-stone-300 px-3 py-2" />
        <details>
          <summary className="cursor-pointer text-sm text-stone-600">Optional: paste page text (used when web tools are unavailable)</summary>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm" />
        </details>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-sm font-medium" htmlFor="seat">Seat</label>
            <input id="seat" value={seat} onChange={(e) => setSeat(e.target.value)} className="rounded border border-stone-300 px-3 py-2" />
          </div>
          <button disabled={busy} className="rounded bg-stone-900 px-4 py-2 text-white disabled:opacity-50">{busy ? "Scouting…" : "Scout it"}</button>
        </div>
      </form>

      {stages.length > 0 && (
        <section className="mt-6" aria-label="Pipeline">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">Pipeline · every stage is a separate Otari call</h2>
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
                      {s.meta?.fallback ? " · fallback used" : ""}
                      {s.meta?.durationMs ? ` · ${(s.meta.durationMs / 1000).toFixed(1)}s` : ""}
                      {s.meta?.costUsd !== undefined ? ` · $${s.meta.costUsd.toFixed(4)}` : ""}
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
          <div className="font-semibold">{error.code === "budget_exceeded" ? `Budget reached for this seat${error.scope ? ` (${error.scope})` : ""}` : "Something went wrong"}</div>
          <div className="mt-1">{error.message}</div>
          {error.retry && <div className="mt-1">Resets in {error.retry}s.</div>}
        </div>
      )}

      {brief && (
        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm" aria-label="Brief">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{brief.name}</h2>
              {brief.sponsor && <div className="text-sm text-stone-600">{brief.sponsor}</div>}
            </div>
            <span className={`rounded border px-2 py-1 text-sm font-semibold uppercase ${VERDICT_STYLE[brief.verdict] ?? ""}`}>{brief.verdict}</span>
          </div>
          <p className="mt-3">{brief.verdict_reason}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Item k="Deadline (UTC)" v={brief.deadline_iso ?? "unknown"} />
            <Item k="Days remaining (computed in sandbox)" v={brief.days_remaining != null ? brief.days_remaining.toFixed(1) : "unknown"} />
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

      {used.length > 0 && (
        <p className="mt-6 text-xs text-stone-500">Otari features exercised this run: {used.join(" · ")} · total ${cost.toFixed(4)}</p>
      )}
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
