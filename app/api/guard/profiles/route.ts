
// Optional: lets the Otari dashboard list available profiles.
export async function GET() {
  return Response.json({ profiles: [{ name: "prompt-injection", description: "Heuristic prompt-injection screen (Kestrel)" }] });
}
