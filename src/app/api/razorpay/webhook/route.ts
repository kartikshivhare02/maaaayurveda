import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    // 1. VERIFY WEBHOOK SIGNATURE
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Razorpay webhook signature mismatch");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json(
        { status: "ok", message: "Supabase not connected" },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // 2. IDEMPOTENT EVENT HANDLING
    if (eventType === "order.paid" || eventType === "payment.captured") {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
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
      const paymentEntity = payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpayOrderId);
      }
    } else if (eventType === "refund.processed") {
      const paymentEntity = payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      let query = supabase.from("orders").update({
        payment_status: "refunded",
        updated_at: new Date().toISOString(),
      });

      if (razorpayOrderId) {
        query = query.eq("razorpay_order_id", razorpayOrderId);
      } else if (paymentId) {
        query = query.eq("razorpay_payment_id", paymentId);
      }
      await query;
    }

    return NextResponse.json({ status: "ok", event: eventType }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
