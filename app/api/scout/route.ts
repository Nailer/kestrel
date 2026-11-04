import { runScout } from "@/lib/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

// Streams pipeline events as NDJSON so the UI can show each stage as it completes.
export async function POST(req: Request) {
  let body: { url?: string; notes?: string; userId?: string };
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
  const userId = (body.userId ?? "").trim().slice(0, 64) || undefined;

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const ev of runScout({ url, notes, userId })) {
        controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
}
