import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { clientIp } from "@/lib/auth";
import { buildKnowledge, faqAnswer, SYSTEM_INSTRUCTIONS } from "@/lib/assistant";
import { getContent } from "@/lib/store";
import type { Lang } from "@/lib/types";

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

type InMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const lang: Lang = body?.lang === "en" ? "en" : "ar";
  const raw: InMsg[] = Array.isArray(body?.messages) ? body.messages : [];
  const messages = raw
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const last = messages[messages.length - 1].content;
  if (!apiKey) {
    // No key configured yet: answer from the FAQ, otherwise hand over.
    return NextResponse.json({ ...faqAnswer(c, last, lang), mode: "faq" });
  }

  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 45_000 });
  const model = c.assistant.model || "claude-opus-5-5";
  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 1024, // replies are deliberately short (1-4 sentences)
      output_config: { effort: "low" },
      // Server-side refusal fallback (not offered for Haiku).
      ...(model === "claude-haiku-5-5" ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }),
      system: [
        { type: "text", text: SYSTEM_INSTRUCTIONS },
        // Company knowledge rarely changes -> cache it.
        { type: "text", text: `<company_knowledge>\n${buildKnowledge(c)}\n</company_knowledge>`, cache_control: { type: "ephemeral" } },
      ],
      tools: [handoffTool],
      tool_choice: { type: "auto" },
      messages,
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        reply: lang === "ar" ? "لا أستطيع المساعدة في هذا الطلب، لكن يسعد خدمة العملاء مساعدتك." : "I can't help with that request, but our customer service team will be glad to help.",
        handoff: true,
      });
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
    reply = reply.trim();
    if (!reply) {
      reply = handoff
        ? lang === "ar"
          ? "سأحوّلك الآن إلى خدمة العملاء."
          : "Let me connect you with customer service."
        : lang === "ar"
          ? "عذراً، لم أفهم سؤالك. هل يمكنك توضيحه؟"
          : "Sorry, I didn't catch that. Could you rephrase?";
    }
    return NextResponse.json({ reply, handoff, summary });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) console.error("chat: invalid ANTHROPIC_API_KEY");
    else if (error instanceof Anthropic.RateLimitError) console.error("chat: rate limited");
    else if (error instanceof Anthropic.APIError) console.error(`chat: API error ${error.status}`);
    else console.error("chat: unexpected error", error);
    // Degrade gracefully to the FAQ / handover.
    return NextResponse.json({ ...faqAnswer(c, last, lang), mode: "faq" });
  }
}
