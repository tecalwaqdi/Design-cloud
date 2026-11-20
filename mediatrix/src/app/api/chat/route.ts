import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { clientIp } from "@/lib/auth";
import { buildKnowledge, faqAnswer, HANDOFF_TAG, SYSTEM_INSTRUCTIONS, SYSTEM_INSTRUCTIONS_TAG } from "@/lib/assistant";
import { getContent } from "@/lib/store";
import type { Content, Lang } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_TURNS = 12;
const MAX_CHARS = 1000;

// Light per-instance rate limit: 25 messages / 10 minutes per visitor.
const hits = new Map<string, number[]>();
function allowed(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (list.length >= 25) return false;
  list.push(now);
  hits.set(ip, list);
  return true;
}

type Turn = { role: "user" | "assistant"; content: string };
type Result = { reply: string; handoff: boolean; summary?: string };

/* ------------------------------------------------------------------ free: Cloudflare Workers AI */

interface WorkersAI {
  run(model: string, input: { messages: { role: string; content: string }[]; max_tokens?: number; temperature?: number }): Promise<unknown>;
}

// Tried in order; the first one that answers is used.
const FREE_MODELS = ["@cf/meta/llama-3.3-70b-instruct-fp8-fast", "@cf/meta/llama-3.1-8b-instruct-fast", "@cf/meta/llama-3.1-8b-instruct"];

async function workersAI(c: Content, turns: Turn[]): Promise<Result | null> {
  let ai: WorkersAI | undefined;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    ai = (getCloudflareContext().env as unknown as { AI?: WorkersAI }).AI;
  } catch {
    return null;
  }
  if (!ai) return null;
  const system = `${SYSTEM_INSTRUCTIONS_TAG}\n\n<company_knowledge>\n${buildKnowledge(c)}\n</company_knowledge>`;
  for (const model of FREE_MODELS) {
    try {
      const out = (await ai.run(model, {
        messages: [{ role: "system", content: system }, ...turns],
        max_tokens: 600,
        temperature: 0.3,
      })) as { response?: unknown };
      const text = typeof out?.response === "string" ? out.response : "";
      if (text.trim()) return fromTagged(text);
    } catch (e) {
      console.error(`chat: workers-ai ${model} failed`, e instanceof Error ? e.message : e);
    }
  }
  return null;
}

/* ------------------------------------------------------------------ Gemini (free tier, needs GEMINI_API_KEY) */

async function gemini(c: Content, turns: Turn[]): Promise<Result | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: `${SYSTEM_INSTRUCTIONS_TAG}\n\n<company_knowledge>\n${buildKnowledge(c)}\n</company_knowledge>` }] },
        contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
        generationConfig: { maxOutputTokens: 600, temperature: 0.3 },
      }),
    });
    if (!res.ok) {
      console.error(`chat: gemini HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
    return text.trim() ? fromTagged(text) : null;
  } catch (e) {
    console.error("chat: gemini failed", e instanceof Error ? e.message : e);
    return null;
  }
}

function fromTagged(text: string): Result {
  const handoff = text.includes(HANDOFF_TAG);
  const reply = text.split(HANDOFF_TAG).join("").replace(/\*\*/g, "").trim();
  return { reply, handoff };
}

/* ------------------------------------------------------------------ Claude (needs ANTHROPIC_API_KEY) */

const handoffTool: Anthropic.Beta.BetaTool = {
  name: "request_human_agent",
  description:
    "Hand the conversation to Mediatrix human customer service. Use when the customer asks for a person, a quote, a bulk or facility order, has a complaint or an order problem, or when the answer is not in the company knowledge.",
  input_schema: {
    type: "object",
    properties: {
      reason: { type: "string", description: "Short reason for the handover, e.g. 'quote request', 'complaint', 'unknown answer'." },
      summary: { type: "string", description: "One or two sentences summarising what the customer needs, in the customer's language." },
    },
    required: ["reason", "summary"],
    additionalProperties: false,
  },
  strict: true,
};

async function claude(c: Content, turns: Turn[], lang: Lang): Promise<Result | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 45_000 });
  const model = c.assistant.model || "claude-opus-5-5";
  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 1024, // replies are deliberately short (1-4 sentences)
      output_config: { effort: "low" },
      ...(model === "claude-haiku-5-5" ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }),
      system: [
        { type: "text", text: SYSTEM_INSTRUCTIONS },
        { type: "text", text: `<company_knowledge>\n${buildKnowledge(c)}\n</company_knowledge>`, cache_control: { type: "ephemeral" } },
      ],
      tools: [handoffTool],
      tool_choice: { type: "auto" },
      messages: turns,
    });
    if (response.stop_reason === "refusal") {
      return {
        reply: lang === "ar" ? "لا أستطيع المساعدة في هذا الطلب، لكن يسعد خدمة العملاء مساعدتك." : "I can't help with that request, but our customer service team will be glad to help.",
        handoff: true,
      };
    }
    let reply = "";
    let handoff = false;
    let summary = "";
    for (const block of response.content) {
      if (block.type === "text") reply += block.text;
      if (block.type === "tool_use" && block.name === "request_human_agent") {
        handoff = true;
        const input = block.input as { summary?: unknown };
        if (typeof input?.summary === "string") summary = input.summary;
      }
    }
    return { reply: reply.trim(), handoff, summary };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) console.error("chat: invalid ANTHROPIC_API_KEY");
    else if (error instanceof Anthropic.RateLimitError) console.error("chat: claude rate limited");
    else if (error instanceof Anthropic.APIError) console.error(`chat: claude API error ${error.status}`);
    else console.error("chat: claude unexpected error", error);
    return null;
  }
}

/* ------------------------------------------------------------------ route */

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const lang: Lang = body?.lang === "en" ? "en" : "ar";
  const raw: Turn[] = Array.isArray(body?.messages) ? body.messages : [];
  const turns: Turn[] = raw
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!allowed(clientIp(req))) {
    return NextResponse.json({
      reply: lang === "ar" ? "وصلت للحد المؤقت من الرسائل. حاول بعد قليل أو تواصل مع خدمة العملاء." : "You've reached the temporary message limit. Please try again shortly or contact customer service.",
      handoff: true,
    });
  }

  const c = await getContent();
  if (!c.assistant.enabled) return NextResponse.json({ error: "disabled" }, { status: 404 });

  // Chosen provider first, then the free one, then the FAQ.
  const order: ("free" | "gemini" | "claude")[] =
    c.assistant.provider === "claude" ? ["claude", "free"] : c.assistant.provider === "gemini" ? ["gemini", "free"] : ["free"];
  for (const p of order) {
    const r = p === "claude" ? await claude(c, turns, lang) : p === "gemini" ? await gemini(c, turns) : await workersAI(c, turns);
    if (r && (r.reply || r.handoff)) {
      if (!r.reply) r.reply = lang === "ar" ? "سأحوّلك الآن إلى خدمة العملاء." : "Let me connect you with customer service.";
      return NextResponse.json({ ...r, summary: r.summary || turns[turns.length - 1].content, mode: p });
    }
  }
  return NextResponse.json({ ...faqAnswer(c, turns[turns.length - 1].content, lang), mode: "faq" });
}
