// Prompt-injection screen used as a custom Otari guardrail service.
// Contract (docs.otari.ai guardrails): POST /validate {profile, input_text, validate_kwargs}
//   -> {profile, result: {valid, explanation, score}}   valid:false = flagged.
// This is a transparent HEURISTIC (pattern scoring), not an ML classifier. It is deliberately simple
// and documented as such; swap in a vendor profile (Lakera, Azure Prompt Shields) via the Otari
// dashboard for production use.

const RULES: Array<[RegExp, number, string]> = [
  [/ignore (all |any |your |the )?(previous|prior|above|earlier)? ?(instructions|prompts?|rules)/i, 0.9, "override-instructions"],
  [/disregard (all |any |your |the )?(previous|prior|above)? ?(instructions|rules|guidelines)/i, 0.9, "override-instructions"],
  [/(reveal|show|print|leak|repeat|output) (me )?(your |the )?(system|hidden|initial) (prompt|instructions|message)/i, 0.9, "prompt-exfiltration"],
  [/you are now (in )?(dan|developer mode|jailbreak)/i, 0.85, "persona-hijack"],
  [/(act as|pretend to be) .{0,40}(without|no) (restrictions|rules|filters|limits)/i, 0.7, "persona-hijack"],
  [/<\s*\/?\s*(system|assistant)\s*>|\[\s*system\s*\]|###\s*system/i, 0.6, "role-marker-injection"],
  [/(send|post|exfiltrate|upload) .{0,60}(api[_ -]?key|secret|token|password|credentials)/i, 0.85, "credential-exfiltration"],
  [/(do not|don't) (tell|inform|let) (the )?user/i, 0.6, "concealment"],
  [/base64[: ]+[A-Za-z0-9+/=]{40,}/i, 0.4, "encoded-payload"],
];

export type GuardVerdict = { valid: boolean; score: number; explanation: string | null };

export function screenInput(text: string): GuardVerdict {
  const hits: Array<{ tag: string; w: number }> = [];
  for (const [re, w, tag] of RULES) if (re.test(text)) hits.push({ tag, w });
  if (!hits.length) return { valid: true, score: 0, explanation: null };
  // Noisy-OR combination so several weak signals add up.
  const score = 1 - hits.reduce((p, h) => p * (1 - h.w), 1);
  const rounded = Math.round(score * 1000) / 1000;
  return {
    valid: rounded < 0.5,
    score: rounded,
    explanation: `matched: ${[...new Set(hits.map((h) => h.tag))].join(", ")}`,
  };
}
