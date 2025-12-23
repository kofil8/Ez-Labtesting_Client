const crypto = require("crypto");

// Use global fetch available in modern Node.js (18+). If unavailable, fall back to node-fetch.
let fetchFn;
try {
  fetchFn = global.fetch;
} catch (e) {
  fetchFn = undefined;
}
const fetch =
  fetchFn ||
  (() => {
    try {
      return require("node-fetch");
    } catch (e) {
      throw new Error(
        "fetch not available; please install node-fetch or use Node 18+"
      );
    }
  })();

// Usage: node scripts/send-mx-webhook.js <url> <secret> <orderId>
const [
  ,
  ,
  url = "http://localhost:3000/api/mx-webhook",
  secret = process.env.MX_MERCHANT_WEBHOOK_SECRET || "local_test_secret",
  orderId = "order-test-webhook",
] = process.argv;

const payload = {
  type: "payment.succeeded",
  data: {
    orderId,
    amount: 29.99,
    currency: "USD",
    transactionId: `tx-${Date.now()}`,
    status: "succeeded",
  },
};

const raw = JSON.stringify(payload);
const signature = crypto.createHmac("sha256", secret).update(raw).digest("hex");

console.log("Posting webhook to", url);
console.log("Signature:", signature);

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-mx-signature": signature,
  },
  body: raw,
})
  .then(async (res) => {
    console.log("Response status:", res.status);
    const text = await res.text();
    console.log("Response body:", text);
  })
  .catch((err) => {
    console.error("Error posting webhook:", err);
  });
