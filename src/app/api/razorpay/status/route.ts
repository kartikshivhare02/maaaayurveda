import { NextResponse } from "next/server";
import {
  getRazorpayKeyId,
  getRazorpayKeySecret,
  getRazorpayWebhookSecret,
  isRazorpayConfigured,
} from "@/lib/razorpay";

export async function GET() {
  const keyId = getRazorpayKeyId();
  const secret = getRazorpayKeySecret();
  const webhookSecret = getRazorpayWebhookSecret();

  const isConfigured = isRazorpayConfigured();
  const isLive = keyId.startsWith("rzp_live_");
  const isTest = keyId.startsWith("rzp_test_");

  let connectionStatus = "not_tested";
  let connectionMessage = "";

  if (isConfigured) {
    try {
      const auth = Buffer.from(`${keyId}:${secret}`).toString("base64");
      const testRes = await fetch("https://api.razorpay.com/v1/orders?count=1", {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (testRes.ok) {
        connectionStatus = "connected";
        connectionMessage = "Razorpay API credentials verified successfully!";
      } else {
        const errorData = await testRes.json().catch(() => ({}));
        connectionStatus = "auth_failed";
        connectionMessage =
          errorData.error?.description ||
          `Razorpay authentication failed with status ${testRes.status}. Check your Key Secret.`;
      }
    } catch (e: any) {
      connectionStatus = "error";
      connectionMessage = e.message || "Failed to reach Razorpay API servers.";
    }
  } else {
    connectionMessage = "Razorpay keys not configured or using mock placeholders.";
  }

  return NextResponse.json(
    {
      isConfigured,
      mode: isLive ? "LIVE" : isTest ? "TEST" : "MOCK",
      keyId: keyId ? `${keyId.substring(0, 8)}...${keyId.slice(-4)}` : "missing",
      hasSecret: Boolean(secret && secret !== "your_razorpay_secret"),
      hasWebhookSecret: Boolean(webhookSecret && webhookSecret !== "your_razorpay_webhook_secret"),
      connectionStatus,
      connectionMessage,
      webhookEndpoint: "/api/razorpay/webhook",
    },
    {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    }
  );
}

