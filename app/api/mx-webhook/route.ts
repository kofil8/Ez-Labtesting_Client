import { updateOrderById } from "@/lib/api";
import crypto from "crypto";
import { NextResponse } from "next/server";

// Secure webhook for Mx Merchant
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader =
    req.headers.get("x-mx-signature") || req.headers.get("x-signature") || "";
  const secret = process.env.MX_MERCHANT_WEBHOOK_SECRET || "";

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Compute HMAC-SHA256
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // Constant-time compare
  const bufferA = Buffer.from(computed, "utf8");
  const bufferB = Buffer.from(signatureHeader || "", "utf8");
  if (
    bufferA.length === 0 ||
    bufferB.length === 0 ||
    bufferA.length !== bufferB.length ||
    !crypto.timingSafeEqual(bufferA, bufferB)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let evt: any;
  try {
    evt = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // Event routing
  const eventType = evt.type || evt.event || "";
  const payload = evt.data || evt.payload || evt;

  // Extract orderId from payload metadata or top-level
  const orderId =
    payload.orderId ||
    payload.metadata?.orderId ||
    payload.data?.orderId ||
    payload.transaction?.metadata?.orderId;

  try {
    if (
      eventType === "payment.succeeded" ||
      eventType === "payment_success" ||
      (payload && payload.status === "succeeded")
    ) {
      const transactionId =
        payload.transactionId ||
        payload.id ||
        payload.paymentId ||
        payload.data?.id;
      // Update internal order
      let updatedOrder = null;
      if (orderId) {
        updatedOrder = await updateOrderById(orderId, {
          status: "completed",
          totalAmount: payload.amount || undefined,
          // attach gateway transaction id
          // @ts-ignore
          transactionId: transactionId || payload.transaction?.id || payload.id,
        } as any);
      }

      return NextResponse.json({ handled: true, order: updatedOrder || null });
    }

    if (
      eventType === "payment.failed" ||
      eventType === "payment_failure" ||
      (payload && payload.status === "failed")
    ) {
      const transactionId =
        payload.transactionId ||
        payload.id ||
        payload.paymentId ||
        payload.data?.id;
      let updatedOrder = null;
      if (orderId) {
        updatedOrder = await updateOrderById(orderId, {
          status: "cancelled",
          // @ts-ignore
          transactionId: transactionId || payload.transaction?.id || payload.id,
        } as any);
      }

      return NextResponse.json({ handled: true, order: updatedOrder || null });
    }

    // For other events, just acknowledge
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to process webhook" },
      { status: 500 }
    );
  }
}
