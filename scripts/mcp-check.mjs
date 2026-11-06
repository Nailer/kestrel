// Verifies managed MCP with a real tool call. Usage: node scripts/mcp-check.mjs
import { readFileSync, existsSync } from "node:fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf8").split("\n")) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2]; }
}
const B = process.env.OTARI_BASE_URL, H = { Authorization: `Bearer ${process.env.OTARI_API_KEY}`, "Content-Type": "application/json" };
const body = (extra) => JSON.stringify({ model: "openai/gpt-oss-120b", max_tokens: 3000, messages: [{ role: "user", content: "Use deepwiki to ask repo mozilla-ai/otari: which Otari built-in tools exist? Quote tool names." }], ...extra });
for (const [label, extra] of [["inline", { mcp_servers: [{ name: "deepwiki", url: "https://mcp.deepwiki.com/mcp", allowed_tools: ["ask_wiki_question"] }] }]]) {
  const r = await fetch(`${B}/chat/completions`, { method: "POST", headers: H, body: body(extra) });
  const d = await r.json();
  console.log(`== ${label} HTTP ${r.status}`);
  if (!d.choices) { console.log(JSON.stringify(d).slice(0, 600)); continue; }
  console.log(d.choices[0].message.content.slice(0, 500));
  console.log("prompt_tokens", d.usage.prompt_tokens, "cost", d.usage.cost_usd, "| otari_tool_calls", JSON.stringify(d.otari_tool_calls ?? null).slice(0, 500));
}
