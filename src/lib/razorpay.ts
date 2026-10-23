import crypto from "crypto";

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock12345";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "mock_secret_abcdef";
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_webhook_secret";

export const isRazorpayConfigured = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(keyId && secret && !keyId.includes("rzp_test_mock"));
};

/**
 * Verify Razorpay payment signature
 */
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (!isRazorpayConfigured()) {
    // In mock/development mode, simulate signature verification
    return Boolean(orderId && paymentId && signature);
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};

/**
 * Verify Razorpay webhook signature
 */
export const verifyWebhookSignature = (
  rawBody: string,
  signature: string
): boolean => {
  if (!isRazorpayConfigured()) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
};

/**
 * Create order on Razorpay API (or mock in sandbox/dev)
 */
export const createRazorpayOrder = async (
  amountPaise: number,
  currency = "INR",
  receipt: string
) => {
  if (!isRazorpayConfigured()) {
    // Return sandbox mock order
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: amountPaise,
      currency,
      receipt,
      status: "created",
    };
  }

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency,
      receipt,
      payment_capture: 1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.description || "Failed to create Razorpay order");
  }

  return response.json();
};
