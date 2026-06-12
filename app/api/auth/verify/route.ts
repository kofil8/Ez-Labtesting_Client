import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { valid: false, message: "Deprecated endpoint" },
    { status: 410 },
  );
}
