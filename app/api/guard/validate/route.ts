import { screenInput } from "@/lib/guard";


// Called by the Otari gateway (not the browser) when a request carries
// guardrails:[{profile:"prompt-injection", url:"<this>/api/guard", credential:"<secret>"}].
// The gateway appends /validate to the configured url.
export async function POST(req: Request) {
  const secret = process.env.KESTREL_GUARDRAIL_CREDENTIAL;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { profile?: string; input_text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  const v = screenInput(String(body.input_text ?? "").slice(0, 50_000));
  return Response.json({ profile: body.profile ?? "prompt-injection", result: { valid: v.valid, explanation: v.explanation, score: v.score } });
}
