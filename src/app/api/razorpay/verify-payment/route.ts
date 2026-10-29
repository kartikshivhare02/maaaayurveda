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
      orderNumber,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "भुगतान सत्यापन पैरामीटर अनुपलब्ध हैं। (Missing parameters)" },
        { status: 400 }
      );
    }

    // 1. HMAC-SHA256 SIGNATURE VERIFICATION
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "अमान्य भुगतान हस्ताक्षर। भुगतान सत्यापन विफल रहा। (Invalid payment signature)" },
        { status: 400 }
      );
    }

    const effectiveOrderNumber = orderNumber || orderData?.orderNumber;

    // 2. UPDATE / UPSERT ORDER IN SUPABASE
    const supabase = getSupabaseServerAdmin();
    let dbOrderId = orderData?.id;

    if (supabase) {
      try {
        // Attempt update first by order_number or razorpay_order_id
        let updateRes = null;
        if (effectiveOrderNumber) {
          updateRes = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              fulfillment_status: "confirmed",
              razorpay_payment_id,
              razorpay_order_id,
              updated_at: new Date().toISOString(),
            })
            .eq("order_number", effectiveOrderNumber)
            .select("id")
            .maybeSingle();
        }

        // If not found by order_number, try by razorpay_order_id
        if (!updateRes?.data && razorpay_order_id) {
          updateRes = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              fulfillment_status: "confirmed",
              razorpay_payment_id,
              updated_at: new Date().toISOString(),
            })
            .eq("razorpay_order_id", razorpay_order_id)
            .select("id")
            .maybeSingle();
        }

        // If still not updated and orderData was supplied, upsert complete order
        if (!updateRes?.data && orderData) {
          const { data: upsertData } = await supabase
            .from("orders")
            .upsert(
              {
                order_number: effectiveOrderNumber,
                user_id: orderData.userId || null,
                customer_name: orderData.customerName,
                customer_phone: orderData.customerPhone,
                customer_email: orderData.customerEmail || null,
                shipping_address: orderData.shippingAddress || {},
                items: orderData.items || [],
                subtotal_paise: orderData.subtotalPaise || 0,
                discount_paise: orderData.discountPaise || 0,
                coupon_code: orderData.couponCode || orderData.appliedCoupon || null,
                shipping_paise: orderData.shippingPaise || 0,
                total_paise: orderData.totalPaise || 0,
                payment_method: "razorpay_online",
                payment_status: "paid",
                fulfillment_status: "confirmed",
                razorpay_order_id,
                razorpay_payment_id,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "order_number" }
            )
            .select("id")
            .maybeSingle();

          if (upsertData?.id) {
            dbOrderId = upsertData.id;
          }
        } else if (updateRes?.data?.id) {
          dbOrderId = updateRes.data.id;
        }

        // 3. SAFELY DECREMENT STOCK
        if (orderData?.items && Array.isArray(orderData.items)) {
          try {
            const { data: prod } = await supabase
              .from("products")
              .select("stock_count")
              .eq("id", "maa-ayurvedic-cream-50g")
              .single();

            if (prod && typeof prod.stock_count === "number") {
              const totalPacksOrdered = orderData.items.reduce(
                (acc: number, it: any) => acc + (it.packCount || 1) * (it.quantity || 1),
                0
              );
              const newStock = Math.max(0, prod.stock_count - totalPacksOrdered);
              await supabase
                .from("products")
                .update({ stock_count: newStock, updated_at: new Date().toISOString() })
                .eq("id", "maa-ayurvedic-cream-50g");
            }
          } catch {
            // Non-blocking stock error
          }
        }
      } catch (dbErr) {
        console.error("Database update error during payment verification:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "भुगतान सफलतापूर्वक सत्यापित हुआ! (Payment verified successfully)",
      orderNumber: effectiveOrderNumber,
      orderId: dbOrderId,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "भुगतान सत्यापन प्रक्रिया में त्रुटि आई।" },
      { status: 500 }
    );
  }
}
