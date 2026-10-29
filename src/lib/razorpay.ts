import crypto from "crypto";

export const getRazorpayKeyId = (): string => {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    ""
  ).trim();
};

export const getRazorpayKeySecret = (): string => {
  return (process.env.RAZORPAY_KEY_SECRET || "").trim();
};

export const getRazorpayWebhookSecret = (): string => {
  return (process.env.RAZORPAY_WEBHOOK_SECRET || "").trim();
};

/**
 * Returns true if real (live or test) Razorpay credentials are configured.
 */
export const isRazorpayConfigured = (): boolean => {
  const keyId = getRazorpayKeyId();
  const secret = getRazorpayKeySecret();
  return Boolean(
    keyId &&
    secret &&
    !keyId.includes("rzp_test_mock") &&
    keyId !== "rzp_test_yourkeyid" &&
    secret !== "your_razorpay_secret" &&
    secret !== "mock_secret_abcdef"
  );
};

/**
 * Loads Razorpay checkout.js script asynchronously in the browser
 */
export const loadRazorpayCheckoutScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Verify Razorpay payment signature using timing-safe HMAC-SHA256 comparison
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

  const secret = getRazorpayKeySecret();
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return generatedSignature === signature;
  }
};

/**
 * Verify Razorpay webhook signature
 */
export const verifyWebhookSignature = (
  rawBody: string,
  signature: string
): boolean => {
  const secret = getRazorpayWebhookSecret();
  if (
    !isRazorpayConfigured() ||
    !secret ||
    secret === "your_razorpay_webhook_secret" ||
    secret === "mock_webhook_secret"
  ) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return expectedSignature === signature;
  }
};

/**
 * Create order on Razorpay API (or mock in sandbox/dev)
 */
export const createRazorpayOrder = async (
  amountPaise: number,
  currency = "INR",
  receipt: string,
  notes: Record<string, string> = {}
) => {
  const roundedAmountPaise = Math.round(amountPaise);

  if (!isRazorpayConfigured()) {
    // Return sandbox mock order for local testing without credentials
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: roundedAmountPaise,
      currency,
      receipt: receipt.slice(0, 40),
      status: "created",
      isMock: true,
    };
  }

  const keyId = getRazorpayKeyId();
  const secret = getRazorpayKeySecret();
  const auth = Buffer.from(`${keyId}:${secret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: roundedAmountPaise,
      currency,
      receipt: receipt.slice(0, 40),
      notes,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData.error?.description ||
      errorData.error?.reason ||
      `Razorpay order creation failed (status: ${response.status})`;
    throw new Error(errorMsg);
  }

  const orderData = await response.json();
  return {
    ...orderData,
    isMock: false,
  };
};

/**
 * Initiate an automated refund via Razorpay API
 */
export const refundRazorpayPayment = async (
  paymentId: string,
  amountPaise?: number,
  notes?: Record<string, string>
) => {
  if (!isRazorpayConfigured()) {
    return {
      id: `rfnd_mock_${Date.now()}`,
      payment_id: paymentId,
      amount: amountPaise || 0,
      status: "processed",
      isMock: true,
    };
  }

  const keyId = getRazorpayKeyId();
  const secret = getRazorpayKeySecret();
  const auth = Buffer.from(`${keyId}:${secret}`).toString("base64");

  const payload: Record<string, any> = {};
  if (amountPaise && amountPaise > 0) {
    payload.amount = Math.round(amountPaise);
  }
  if (notes) {
    payload.notes = notes;
  }

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.description || "Razorpay refund failed");
  }

  return response.json();
};
