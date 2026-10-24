import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      userId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      subtotalPaise,
      discountPaise,
      couponCode,
      shippingPaise,
      totalPaise,
      paymentMethod,
      paymentStatus,
      fulfillmentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      notes,
    } = body;

    if (!orderNumber || !customerName || !customerPhone || !shippingAddress || !items) {
      return NextResponse.json(
        { error: "आवश्यक विवरण (ऑर्डर नंबर, नाम, फोन, पता) गायब हैं।" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      console.warn("Supabase admin client not initialized. Falling back to local response.");
      return NextResponse.json({
        success: true,
        orderNumber,
        warning: "Database not configured, saved locally.",
      });
    }

    // 1. Insert order into Supabase
    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        shipping_address: shippingAddress,
        items: items,
        subtotal_paise: subtotalPaise || 0,
        discount_paise: discountPaise || 0,
        coupon_code: couponCode || null,
        shipping_paise: shippingPaise || 0,
        total_paise: totalPaise || 0,
        payment_method: paymentMethod || "cod",
        payment_status: paymentStatus || "pending",
        fulfillment_status: fulfillmentStatus || "placed",
        razorpay_order_id: razorpayOrderId || null,
        razorpay_payment_id: razorpayPaymentId || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderErr) {
      console.error("Supabase order insert error:", orderErr);
      return NextResponse.json(
        { error: orderErr.message || "ऑर्डर डेटाबेस में सेव करने में विफल रहा।" },
        { status: 500 }
      );
    }

    // 2. Decrement stock in Supabase products table (optional safe update)
    try {
      const { data: prod } = await supabase
        .from("products")
        .select("stock_count")
        .eq("id", "maa-ayurvedic-cream-50g")
        .single();

      if (prod && typeof prod.stock_count === "number") {
        const totalPacksOrdered = (items || []).reduce(
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
      // ignore stock decrement errors
    }

    return NextResponse.json({
      success: true,
      order: orderRow,
      orderNumber,
    });
  } catch (err: any) {
    console.error("Error in /api/orders/create:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
