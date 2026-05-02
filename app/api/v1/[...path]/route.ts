import type { NextRequest } from "next/server";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const CLIENT_SUPPLIED_PROXY_HEADERS = [
  "forwarded",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
  "x-real-ip",
];

const CLIENT_IP_HEADERS = [
  "cf-connecting-ip",
  "x-vercel-forwarded-for",
  "x-forwarded-for",
  "x-real-ip",
];

function getBackendBaseUrl() {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:7001/api/v1"
  ).replace(/\/+$/, "");
}

function buildTargetUrl(request: NextRequest, path: string[]) {
  const backendBaseUrl = getBackendBaseUrl();
  const pathname = path.map(encodeURIComponent).join("/");
  const targetUrl = new URL(`${backendBaseUrl}/${pathname}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  return targetUrl;
}

function getFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function resolveForwardedClientIp(request: NextRequest) {
  for (const header of CLIENT_IP_HEADERS) {
    const ip = getFirstHeaderValue(request.headers.get(header));
    if (ip) {
      return ip;
    }
  }

  return null;
}

function buildProxyHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);
  const clientIp = resolveForwardedClientIp(request);

  HOP_BY_HOP_HEADERS.forEach((header) => {
    headers.delete(header);
  });

  CLIENT_SUPPLIED_PROXY_HEADERS.forEach((header) => {
    headers.delete(header);
  });

  headers.set("x-forwarded-host", request.headers.get("host") || request.nextUrl.host);
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  if (clientIp) {
    headers.set("x-real-ip", clientIp);
    headers.set("x-forwarded-for", clientIp);
  }

  return headers;
}

function buildResponseHeaders(headers: Headers) {
  const responseHeaders = new Headers(headers);

  HOP_BY_HOP_HEADERS.forEach((header) => {
    responseHeaders.delete(header);
  });

  return responseHeaders;
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const targetUrl = buildTargetUrl(request, path);
  const headers = buildProxyHeaders(request);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, init);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: buildResponseHeaders(response.headers),
    });
  } catch (error) {
    console.error("API proxy request failed", {
      url: targetUrl.toString(),
      method: request.method,
      error,
    });

    return Response.json(
      { message: "Unable to reach backend service." },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}

export async function OPTIONS(
  request: NextRequest,
  context: RouteContext,
) {
  return proxyRequest(request, context);
}
