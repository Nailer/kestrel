import { runScout } from "@/lib/pipeline";
import { isSeat } from "@/lib/seats";

export const maxDuration = 300;

// Streams pipeline events as NDJSON so the UI can show each stage as it completes.
export async function POST(req: Request) {
  const code = process.env.KESTREL_ACCESS_CODE;
  if (code && req.headers.get("x-kestrel-code") !== code) {
    return Response.json({ error: "Access code required" }, { status: 401 });
  }
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
  const userId = (body.userId ?? "").trim();
  if (!isSeat(userId)) return Response.json({ error: "Unknown seat" }, { status: 400 });

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
