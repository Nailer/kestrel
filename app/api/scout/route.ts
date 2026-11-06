import { runScout } from "@/lib/pipeline";
import { isSeat } from "@/lib/seats";

export const maxDuration = 300;

// Streams pipeline events as NDJSON so the UI can show each stage as it completes.
// Two ways in, no secret needed:
//  1. Demo seat  -> our server's Otari service key, capped per seat ($0.15/day) + a workspace ceiling.
//  2. Own key    -> the visitor's Otari key, used for this request only (never stored or logged).
const BASE = { eu: "https://eu.api.otari.ai/api/v1", us: "https://api.otari.ai/api/v1" } as const;

export async function POST(req: Request) {
  let body: { url?: string; notes?: string; userId?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const url = (body.url ?? "").trim();
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw new Error();
  } catch {
    return Response.json({ error: "Provide a valid http(s) URL" }, { status: 400 });
  }
  const notes = (body.notes ?? "").slice(0, 20000);

  const apiKey = (body.apiKey ?? "").trim();
  let baseUrl: string | undefined;
  let userId: string | undefined;
  if (apiKey) {
    const m = apiKey.match(/^otk_v1_(eu|us)_[A-Za-z0-9_-]{8,}$/);
    if (!m) return Response.json({ error: "That doesn't look like an Otari key (it starts with otk_v1_eu_ or otk_v1_us_)." }, { status: 400 });
    baseUrl = BASE[m[1] as "eu" | "us"];
  } else {
    userId = (body.userId ?? "").trim();
    if (!isSeat(userId)) return Response.json({ error: "Unknown seat" }, { status: 400 });
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const ev of runScout({ url, notes, userId, apiKey: apiKey || undefined, baseUrl })) {
        controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
}
