# Bug log

| ID | Sev | Issue | Root cause | Fix | Retest |
|---|---|---|---|---|---|
| B1 | P1 | Brief all "unknown" although research succeeded | `gpt-oss-120b` returned empty content after tool loop | researcher failover to deepseek-v3.2 then qwen | live run produced full brief |
| B2 | P1 | Triage invented a deadline/prize from a bare URL | prompt let the small model emit values in `verify` | fixed field-name list, "never state facts you were not given" | no invented values in later runs |
| B3 | P1 | Vercel build failed | `export const runtime` incompatible with `cacheComponents` | removed exports | `npm run build` + deploy pass |
| B4 | P1 | Guardrail always `evaluation_failed` | validator demanded a bearer credential; request-level Otari guardrail entries carry no `credential` field | validator unauthenticated by design, input-capped | 403 on injection, `evaluated` on normal |
| B5 | P1 | Live app 401 "Invalid API key" | service key in env had been deleted/rotated | new service key, re-added to Vercel | live seat runs pass |
| B6 | P2 | Heading unreadable in dark mode | scaffold dark theme + fixed dark text | pinned light theme | browser check, desktop + mobile |
| B7 | P2 | "MCP"/"web" labelled as used when calls failed | feature tag checked presence not status | count only `completed` calls | tsc/lint pass; verified in next live run |
| B8 | P3 | Cost shown as $0.0000 | 4-decimal formatting | 5 decimals under $0.001 | visual |
| B9 | P1 (security) | Real service key written into tracked `.env.example` | user pasted key in wrong file | blanked before commit; history scanned: never committed/pushed | `git diff --cached` + history grep clean |
