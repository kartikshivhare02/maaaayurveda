import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    const supabase = getSupabaseServerAdmin();

    // Idempotent event processing
    if (eventType === "payment.captured") {
      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      if (supabase && razorpayOrderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            fulfillment_status: "confirmed",
            razorpay_payment_id: razorpayPaymentId,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpayOrderId);
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;

      if (supabase && razorpayOrderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpayOrderId);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
