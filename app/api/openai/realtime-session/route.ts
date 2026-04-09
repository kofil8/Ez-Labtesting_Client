import { NextResponse } from "next/server";

const REALTIME_MODEL = "gpt-realtime";
const REALTIME_VOICE = "cedar";

const REALTIME_INSTRUCTIONS = [
  "You are Ez LabTesting's homepage lab assistant.",
  "Help with test selection, pricing, result turnaround, scheduling basics, privacy, and navigating the website.",
  "Keep answers short, clear, and friendly.",
  "Never provide diagnoses, treatment advice, or definitive medical guidance.",
  "If the user asks for medical advice, say you are not medical advice and recommend speaking with a licensed clinician.",
  "Do not ask for or encourage sharing payment details, SSNs, insurance IDs, or personal health information.",
  "If the request is account-specific, order-specific, refund-specific, or support-specific, direct the user to the Help Center or support team.",
  "If you do not know something about Ez LabTesting, say so plainly instead of inventing details.",
].join(" ");

export async function POST() {
  const apiKey =
    process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expires_after: {
            anchor: "created_at",
            seconds: 600,
          },
          session: {
            type: "realtime",
            model: REALTIME_MODEL,
            instructions: REALTIME_INSTRUCTIONS,
            max_output_tokens: 900,
            audio: {
              input: {
                noise_reduction: {
                  type: "near_field",
                },
                transcription: {
                  model: "gpt-4o-mini-transcribe",
                },
                turn_detection: {
                  type: "server_vad",
                  create_response: true,
                  interrupt_response: true,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 550,
                  threshold: 0.5,
                },
              },
              output: {
                voice: REALTIME_VOICE,
              },
            },
          },
        }),
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.value) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Failed to create a realtime OpenAI session.",
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(
      {
        clientSecret: {
          value: data.value,
          expiresAt: data.expires_at,
        },
        model: REALTIME_MODEL,
        voice: REALTIME_VOICE,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Realtime session creation failed:", error);

    return NextResponse.json(
      { error: "Failed to create a realtime OpenAI session." },
      { status: 500 },
    );
  }
}
