// Verifies gateway tools end to end. Usage: node scripts/tool-check.mjs
import { readFileSync } from "node:fs";
for (const l of readFileSync(".env.local", "utf8").split("\n")) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2]; }
const B = process.env.OTARI_BASE_URL, H = { Authorization: `Bearer ${process.env.OTARI_API_KEY}`, "Content-Type": "application/json" };
const tools = await (await fetch(`${B}/tools`, { headers: H })).json();
for (const t of tools.data) console.log(t.id, t.available, t.reason ?? "");
const cases = [
  ["otari_web_fetch", "Read https://dorahacks.io/hackathon/mozilla-devs-wilding and report the submission deadline."],
  ["otari_web_search", "Search the web: Mozilla Otari hackathon Devs Wilding deadline. Report the deadline."],
];
for (const [type, prompt] of cases) {
  const r = await fetch(`${B}/chat/completions`, { method: "POST", headers: H, body: JSON.stringify({ model: "openai/gpt-oss-120b", max_tokens: 1500, messages: [{ role: "user", content: prompt }], tools: [{ type }] }) });
  const d = await r.json();
  console.log(`\n== ${type} HTTP ${r.status}`);
  if (!d.choices) { console.log(JSON.stringify(d).slice(0, 500)); continue; }
  console.log(d.choices[0].message.content.slice(0, 400));
  console.log("cost", d.usage?.cost_usd, "| tool_calls:", JSON.stringify(d.otari_tool_calls ?? null).slice(0, 700));
}
