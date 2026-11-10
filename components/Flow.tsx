"use client";

import { useEffect, useRef } from "react";

// Five strands, one per pipeline stage. As the visitor scrolls they run in calm lanes, twist around
// each other (the hand-offs between models) and finally merge into a single line: Otari.
const STRANDS = [
  { label: "Triage · Mistral Small 3.2", rgb: "251,191,36" },
  { label: "Sponsor docs · MCP", rgb: "125,211,252" },
  { label: "Research · web search + fetch", rgb: "226,232,240" },
  { label: "Analysis · code sandbox", rgb: "94,234,212" },
  { label: "Brief · gpt-oss-20b", rgb: "253,164,175" },
];

const CAPTIONS = [
  { from: -1, to: 0.22, title: "A link goes in.", body: "Kestrel splits the job into five stages and gives each one to the model that suits it." },
  { from: 0.22, to: 0.46, title: "Open-weight models, one job each.", body: "Mistral, gpt-oss and DeepSeek hand their findings to one another, stage by stage." },
  { from: 0.46, to: 0.7, title: "Tools run inside the gateway.", body: "Web search, page fetch, MCP and a code sandbox are executed by Otari, with a guardrail and a budget on every call." },
];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function Flow() {
  const wrapRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const cv = cvRef.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let p = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    const draw = (ms: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const t = reduce ? 0 : ms / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const cy = h / 2;
      const gap = Math.min(h * 0.1, 64);
      const lane = 1 - smooth(0.12, 0.6, p); // calm parallel lanes early on
      const conv = smooth(0.74, 0.92, p); // everything merges into one line
      const amp = h * 0.012 + h * 0.17 * Math.sin(Math.PI * smooth(0.08, 0.86, p));
      const k = (Math.PI * 2 * (w < 700 ? 1.2 : 1.6)) / w;
      const yAt = (i: number, x: number) =>
        cy +
        (i - 2) * gap * lane * (1 - conv) +
        amp * (1 - conv) * Math.pow(Math.sin((Math.PI * x) / w), 0.6) * Math.sin(k * x + (i * Math.PI * 2) / 5 + t * 0.7 + p * 9);

      STRANDS.forEach((s, i) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = yAt(i, x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${s.rgb},${0.5 + 0.4 * conv})`;
        ctx.lineWidth = 1.8 + 3 * conv;
        ctx.shadowColor = `rgba(${s.rgb},0.9)`;
        ctx.shadowBlur = 14;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Labels ride along their strand until the strands merge.
      const labelA = 1 - smooth(0.5, 0.72, p);
      if (labelA > 0.02 && w > 520) {
        ctx.font = "500 13px var(--font-geist-sans), system-ui, sans-serif";
        ctx.textAlign = "center";
        STRANDS.forEach((s, i) => {
          const span = w + 320;
          const lx = ((t * 38 + i * span * 0.21) % span) - 160;
          if (lx < 40 || lx > w - 40) return;
          const dy = yAt(i, lx + 5) - yAt(i, lx - 5);
          const edge = Math.min(1, Math.min(lx, w - lx) / 140);
          ctx.save();
          ctx.translate(lx, yAt(i, lx) - 14);
          ctx.rotate(Math.atan2(dy, 10));
          ctx.fillStyle = `rgba(${s.rgb},${0.9 * labelA * edge})`;
          ctx.fillText(s.label, 0, 0);
          ctx.restore();
        });
      }

      // Light along the merged line.
      if (conv > 0.01) {
        ctx.save();
        ctx.translate(w / 2, cy);
        ctx.scale(1, 0.16);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.45);
        g.addColorStop(0, `rgba(251,191,36,${0.5 * conv})`);
        g.addColorStop(1, "rgba(251,191,36,0)");
        ctx.fillStyle = g;
        ctx.fillRect(-w, -w, w * 2, w * 2);
        ctx.restore();
      }

      CAPTIONS.forEach((c, i) => {
        const el = capRefs.current[i];
        if (!el) return;
        const o = smooth(c.from, c.from + 0.05, p) * (1 - smooth(c.to - 0.05, c.to, p));
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 14}px)`;
      });
      if (wordRef.current) {
        const o = smooth(0.8, 0.93, p);
        wordRef.current.style.opacity = String(o);
        wordRef.current.style.transform = `scale(${0.96 + 0.04 * o})`;
      }
    };

    resize();
    onScroll();
    const ro = new ResizeObserver(() => {
      resize();
      onScroll();
    });
    ro.observe(cv);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[420vh] bg-night" aria-label="How Kestrel works with Otari">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={cvRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        {CAPTIONS.map((c, i) => (
          <div
            key={c.title}
            ref={(el) => {
              capRefs.current[i] = el;
            }}
            className="absolute inset-x-0 bottom-[9vh] px-6 will-change-transform md:px-16"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">{c.title}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">{c.body}</p>
          </div>
        ))}
        <div ref={wordRef} className="absolute inset-0 grid place-items-center px-6 text-center" style={{ opacity: 0 }}>
          <div>
            <div className="font-display text-[clamp(5rem,22vw,19rem)] font-semibold leading-none tracking-tight text-white [text-shadow:0_0_60px_rgba(251,191,36,0.45)]">
              Otari
            </div>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-200 md:text-xl">One gateway for every model, tool and budget Kestrel uses.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
