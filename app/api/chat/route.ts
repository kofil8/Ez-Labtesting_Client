import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InboundMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_PROVIDER = (process.env.AI_PROVIDER || "").toLowerCase(); // "openai" | "anthropic" | "gemini"

const defaultOpenAIModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
const defaultAnthropicModel =
  process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const defaultGeminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";

function pickProvider(): "openai" | "anthropic" | "gemini" {
  if (AI_PROVIDER === "openai" && OPENAI_API_KEY) return "openai";
  if (AI_PROVIDER === "anthropic" && ANTHROPIC_API_KEY) return "anthropic";
  if (AI_PROVIDER === "gemini" && GEMINI_API_KEY) return "gemini";
  // Auto-select if only one key is provided
  if (OPENAI_API_KEY && !ANTHROPIC_API_KEY) return "openai";
  if (ANTHROPIC_API_KEY && !OPENAI_API_KEY && !GEMINI_API_KEY)
    return "anthropic";
  if (GEMINI_API_KEY && !OPENAI_API_KEY && !ANTHROPIC_API_KEY) return "gemini";
  // Default to OpenAI when both are present
  return "openai";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: InboundMessage[] };
    const messages = body?.messages ?? [];

    // Safe diagnostics (does not print secrets)
    console.log("[/api/chat] env check", {
      aiProviderEnv: AI_PROVIDER || "(unset)",
      providerPicked: pickProvider(),
      hasOpenAIKey: Boolean(OPENAI_API_KEY),
      openAIPrefix: OPENAI_API_KEY ? OPENAI_API_KEY.slice(0, 8) : null,
      hasAnthropicKey: Boolean(ANTHROPIC_API_KEY),
      anthropicPrefix: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.slice(0, 8) : null,
      hasGeminiKey: Boolean(GEMINI_API_KEY),
      geminiPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 8) : null,
    });

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const provider = pickProvider();
    if (provider === "openai" && !OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment" },
        { status: 500 }
      );
    }
    if (provider === "anthropic" && !ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Missing ANTHROPIC_API_KEY in environment" },
        { status: 500 }
      );
    }
    if (provider === "gemini" && !GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment" },
        { status: 500 }
      );
    }

    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: defaultOpenAIModel,
          messages,
          temperature: 0.3,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("[/api/chat] OpenAI error", res.status, errText);
        return NextResponse.json(
          { error: errText || "OpenAI error" },
          { status: 500 }
        );
      }
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      if (!data?.choices?.length) {
        console.error("[/api/chat] OpenAI empty choices", JSON.stringify(data));
      }
      const reply = data.choices?.[0]?.message?.content ?? "";
      return NextResponse.json({ reply });
    } else if (provider === "gemini") {
      // Google Gemini
      // Convert messages into Gemini "contents" format
      let systemText: string | undefined;
      const contents = messages
        .map((m) => {
          if (m.role === "system") {
            systemText = systemText
              ? `${systemText}\n\n${m.content}`
              : m.content;
            return null;
          }
          const role = m.role === "assistant" ? "model" : "user";
          return {
            role,
            parts: [{ text: m.content }],
          };
        })
        .filter(Boolean) as Array<{
        role: string;
        parts: Array<{ text: string }>;
      }>;

      if (systemText && contents.length > 0) {
        // Prepend system guidance to the first user message
        const first = contents[0];
        if (first.parts.length > 0) {
          first.parts[0].text = `System: ${systemText}\n\n${first.parts[0].text}`;
        } else {
          first.parts.push({ text: `System: ${systemText}` });
        }
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${defaultGeminiModel}:generateContent?key=${GEMINI_API_KEY}`;

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[/api/chat] Gemini error", res.status, errText);
        return NextResponse.json(
          { error: errText || "Gemini error" },
          { status: 500 }
        );
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const parts = data.candidates?.[0]?.content?.parts || [];
      const reply =
        parts
          .map((p) => p.text)
          .filter(Boolean)
          .join(" ")
          .trim() || "";

      return NextResponse.json({ reply });
    } else {
      // Anthropic Claude
      // Extract optional system from messages
      let system: string | undefined;
      const anthroMessages: Array<{
        role: "user" | "assistant";
        content: Array<{ type: "text"; text: string }>;
      }> = [];
      for (const m of messages) {
        if (m.role === "system") {
          system = system ? `${system}\n\n${m.content}` : m.content;
        } else {
          anthroMessages.push({
            role: m.role,
            content: [{ type: "text", text: m.content }],
          });
        }
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: defaultAnthropicModel,
          max_tokens: 1024,
          system,
          messages: anthroMessages,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("[/api/chat] Anthropic error", res.status, err);
        return NextResponse.json(
          { error: err || "Anthropic error" },
          { status: 500 }
        );
      }
      const data = (await res.json()) as {
        content?: Array<{ type: "text"; text: string }>;
      };
      const reply = data.content?.[0]?.text ?? "";
      return NextResponse.json({ reply });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
