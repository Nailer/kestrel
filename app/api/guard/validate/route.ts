import { screenInput } from "@/lib/guard";


// Called by the Otari gateway (not the browser) when a request carries
// guardrails:[{profile:"prompt-injection", url:"<this>/api/guard", credential:"<secret>"}].
// The gateway appends /validate to the configured url.
export async function POST(req: Request) {
  // Request-level guardrail entries in Otari carry a `url` but no `credential` field (only org
  // mandates do), so this endpoint is intentionally unauthenticated: it is a stateless pure function
  // that returns a verdict for the given text. Input size is capped below.
  let body: { profile?: string; input_text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  const v = screenInput(String(body.input_text ?? "").slice(0, 50_000));
  return Response.json({ profile: body.profile ?? "prompt-injection", result: { valid: v.valid, explanation: v.explanation, score: v.score } });
}
