import { NextResponse } from "next/server";

const REALTIME_MODEL = "gpt-realtime";
const REALTIME_VOICE = "cedar";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor
    ?.split(",")
    .map((value) => value.trim())
    .find(Boolean);

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    firstForwardedIp ||
    "anonymous"
  );
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const key = getClientKey(request);
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

const BASE_REALTIME_INSTRUCTIONS = [
  "You are Ez LabTesting's public website assistant for guest users.",
  "Help with test selection, panels, pricing, result turnaround, scheduling basics, privacy, account access basics, support routing, and navigating the website.",
  "Keep answers short, clear, and friendly.",
  "Never provide diagnoses, treatment advice, or definitive medical guidance.",
  "If the user asks for medical advice, say you are not medical advice and recommend speaking with a licensed clinician.",
  "Do not ask for or encourage sharing payment details, SSNs, insurance IDs, or personal health information.",
  "If the request is account-specific, order-specific, refund-specific, or support-specific, direct the user to the Help Center or support team.",
  "If you do not know something about Ez LabTesting, say so plainly instead of inventing details.",
].join(" ");

const CONTEXT_INSTRUCTIONS: Record<string, string> = {
  home:
    "The user is on the homepage. Prioritize guiding them through browsing tests, how ordering works, pricing expectations, and general pre-purchase questions.",
  tests:
    "The user is browsing tests. Focus on comparing tests, preparation basics, turnaround times, and how to evaluate options without making medical claims.",
  panels:
    "The user is browsing panels. Focus on comparing panel contents, explaining bundled testing, and helping them understand what information product pages typically provide.",
  support:
    "The user is on the support page. Focus on contact options, common policies, results help, and when to reach the support team directly.",
  labs:
    "The user is on the lab-center page. Focus on finding a lab, scheduling basics, what to bring, and what to expect during sample collection.",
  auth:
    "The user is on a public authentication page. Focus on signing in, creating an account, and password-reset basics without asking for private credentials.",
};

type RealtimeSessionRequest = {
  contextKey?: string;
};

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many realtime session requests." },
      { status: 429 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  try {
    const requestBody = (await request.json().catch(() => ({}))) as RealtimeSessionRequest;
    const contextKey =
      typeof requestBody.contextKey === "string" &&
      requestBody.contextKey in CONTEXT_INSTRUCTIONS
        ? requestBody.contextKey
        : "home";
    const realtimeInstructions = [
      BASE_REALTIME_INSTRUCTIONS,
      CONTEXT_INSTRUCTIONS[contextKey],
    ].join(" ");

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
            instructions: realtimeInstructions,
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
