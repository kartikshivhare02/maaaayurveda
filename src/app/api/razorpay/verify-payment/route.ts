import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification parameters missing" },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature. Payment cannot be verified." },
        { status: 400 }
      );
    }

    // Save or update order in Supabase if configured
    const supabase = getSupabaseServerAdmin();
    let dbOrderId = orderData?.id;

    if (supabase && orderData) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .upsert({
            order_number: orderData.orderNumber,
            user_id: orderData.userId || null,
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            customer_email: orderData.customerEmail,
            shipping_address: orderData.shippingAddress,
            items: orderData.items,
            subtotal_paise: orderData.subtotalPaise,
            discount_paise: orderData.discountPaise,
            total_paise: orderData.totalPaise,
            payment_method: "razorpay_online",
            payment_status: "paid",
            fulfillment_status: "confirmed",
            razorpay_order_id,
            razorpay_payment_id,
          })
          .select("id")
          .single();

        if (data) {
          dbOrderId = data.id;
        }
      } catch (dbErr) {
        console.error("Database save error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "भुगतान सफलतापूर्वक सत्यापित हुआ! (Payment verified successfully)",
      orderNumber: orderData?.orderNumber,
      orderId: dbOrderId,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
