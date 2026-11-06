/* eslint-disable @typescript-eslint/no-explicit-any -- untyped external gateway JSON */
// Thin, dependency-free client for the hosted Otari gateway (OpenAI-compatible).
// Server-side only: the API key must never reach the browser.

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type OtariMeta = {
  requestId?: string;
  model?: string; // upstream model actually served
  provider?: string;
  fallback?: boolean;
  attempts?: number;
  durationMs?: number;
  guardrails?: unknown;
  costUsd?: number;
  tokens?: { prompt?: number; completion?: number; total?: number };
};

export type OtariToolCall = {
  id: string;
  type: string;
  status?: string;
  code?: string;
  stdout?: string;
  stderr?: string;
  exit_code?: number;
  [k: string]: unknown;
};

export type ChatParams = {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: "json_object" };
  tools?: Array<Record<string, unknown>>;
  mcp_servers?: Array<Record<string, unknown>>;
  guardrails?: Array<Record<string, unknown>>;
  /** End-user id (requires a service key on the Otari side). */
  user?: string;
  signal?: AbortSignal;
  /** Visitor-supplied Otari key (used for this request only, never stored or logged). */
  apiKey?: string;
  baseUrl?: string;
};

export class OtariError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public code?: string,
    public budgetScope?: string,
    public retryAfter?: string,
  ) {
    super(`Otari ${status}${code ? ` ${code}` : ""}: ${detail}`);
  }
}

export function baseUrl(override?: string) {
  if (override) return override.replace(/\/$/, "");
  return (process.env.OTARI_BASE_URL || "https://api.otari.ai/api/v1").replace(/\/$/, "");
}

function authHeaders(apiKey?: string): Record<string, string> {
  // A service key (dashboard: API keys → Service key) is required for per-user budgets (`user` field).
  const key = apiKey || process.env.OTARI_SERVICE_KEY || process.env.OTARI_API_KEY;
  if (!key) throw new Error("OTARI_API_KEY is not set");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

function metaFrom(res: Response, json: any): OtariMeta {
  const h = res.headers;
  let guardrails: unknown;
  const g = h.get("otari-guardrails");
  if (g) {
    try {
      guardrails = JSON.parse(g);
    } catch {
      guardrails = g;
    }
  }
  const cost = json?.usage?.cost_usd;
  return {
    requestId: h.get("otari-request-id") ?? undefined,
    model: h.get("otari-model") ?? json?.model,
    provider: h.get("otari-provider") ?? undefined,
    fallback: h.get("otari-fallback") === "true",
    attempts: h.get("otari-attempt-count") ? Number(h.get("otari-attempt-count")) : undefined,
    durationMs: h.get("otari-response-duration-ms") ? Number(h.get("otari-response-duration-ms")) : undefined,
    guardrails,
    costUsd: cost !== undefined ? Number(cost) : undefined,
    tokens: json?.usage && {
      prompt: json.usage.prompt_tokens,
      completion: json.usage.completion_tokens,
      total: json.usage.total_tokens,
    },
  };
}

const TRANSIENT = new Set([429, 500, 502, 503, 504]);

/** Retries transient upstream failures (rate limit / 5xx) with backoff. Never retries budget (403) or client errors. */
export async function otariChat(p: ChatParams, retries = 2): ReturnType<typeof otariChatOnce> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await otariChatOnce(p);
    } catch (e) {
      const transient = (e instanceof OtariError && TRANSIENT.has(e.status)) || (e instanceof TypeError && /fetch failed/i.test(e.message));
      if (transient && attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }
}

async function otariChatOnce(p: ChatParams) {
  const { signal, apiKey, baseUrl: baseOverride, ...body } = p;
  const res = await fetch(`${baseUrl(baseOverride)}/chat/completions`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) {
    throw new OtariError(
      res.status,
      json?.detail?.message ?? (typeof json?.detail === "string" ? json.detail : json?.error?.message) ?? (text.slice(0, 300) || res.statusText),
      res.headers.get("otari-error-code") ?? undefined,
      res.headers.get("otari-budget-scope") ?? undefined,
      res.headers.get("retry-after") ?? undefined,
    );
  }
  const msg = json?.choices?.[0]?.message;
  return {
    content: (msg?.content ?? "") as string,
    finishReason: json?.choices?.[0]?.finish_reason as string | undefined,
    toolCalls: (json?.otari_tool_calls ?? []) as OtariToolCall[],
    meta: metaFrom(res, json),
  };
}

export type ToolAvailability = Record<string, { available: boolean; reason?: string }>;

let toolCache: { at: number; v: ToolAvailability } | undefined;

/** GET /tools — which gateway-run tools this workspace may actually use. */
export async function getToolAvailability(opts: { apiKey?: string; baseUrl?: string } = {}): Promise<ToolAvailability> {
  if (!opts.apiKey && toolCache && Date.now() - toolCache.at < 60_000) return toolCache.v;
  const res = await fetch(`${baseUrl(opts.baseUrl)}/tools`, { headers: authHeaders(opts.apiKey), cache: "no-store" });
  const json: any = await res.json().catch(() => ({}));
  const v: ToolAvailability = {};
  for (const t of json?.data ?? []) v[t.id] = { available: !!t.available, reason: t.reason };
  if (!opts.apiKey) toolCache = { at: Date.now(), v };
  return v;
}

/** Pull a JSON object out of a model reply (tolerates fences / prose). */
export function extractJson<T = unknown>(s: string): T {
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : s;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in model reply");
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
