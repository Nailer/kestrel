/* eslint-disable @typescript-eslint/no-explicit-any -- untyped external gateway JSON */
// CLI harness: npx tsx scripts/run-scout.ts <url> [notes-file]
import { readFileSync, existsSync } from "node:fs";
import { runScout } from "../lib/pipeline";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const [url, notesFile] = process.argv.slice(2);
if (!url) {
  console.error("Usage: npx tsx scripts/run-scout.ts <url> [notes-file]");
  process.exit(1);
}
const notes = notesFile ? readFileSync(notesFile, "utf8") : undefined;
async function main() {
  const t0 = Date.now();
  for await (const ev of runScout({ url, notes, userId: process.env.SEAT })) {
    const { output, toolCalls, ...rest } = ev as any;
    if (process.env.SHOW && output) console.log("   OUTPUT:", typeof output === "string" ? output.slice(0, 1500) : JSON.stringify(output).slice(0, 800));
    console.log(`[+${((Date.now() - t0) / 1000).toFixed(1)}s]`, JSON.stringify(rest).slice(0, 600));
    if (toolCalls?.length) console.log("   toolCalls:", toolCalls.map((t: any) => `${t.type}:${t.status}`).join(","));
    if (ev.type === "brief") console.log(JSON.stringify(ev.brief, null, 2));
  }
}
main();
