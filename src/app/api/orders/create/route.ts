import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { fetchBundlesFromDb, fetchCouponsFromDb } from "@/lib/data/db";
import { CartItem } from "@/types";

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
      couponCode,
      shippingPaise = 0,
      paymentMethod = "cod",
      paymentStatus = "pending",
      fulfillmentStatus = "placed",
      razorpayOrderId,
      razorpayPaymentId,
      notes,
    } = body;

    if (!orderNumber || !customerName || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { error: "आवश्यक विवरण (ऑर्डर नंबर, नाम, फोन, पता) गायब हैं।" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "कार्ट खाली है (Cart is empty)। कृपया पहले कोई पैक जोड़ें।" },
        { status: 400 }
      );
    }

    // 1. Authoritative server-side price recalculation from database bundles
    const activeBundles = await fetchBundlesFromDb();
    let calculatedSubtotalPaise = 0;
    const verifiedItems: CartItem[] = [];

    for (const item of items) {
      const bundle = activeBundles.find((b) => b.id === item.bundleId);
      if (!bundle) {
        return NextResponse.json(
          { error: `अमान्य कॉम्बो पैक चयन: ${item.bundleId || item.title || "अज्ञात"}` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPricePaise = bundle.pricePaise;
      const totalPricePaise = unitPricePaise * qty;
      const mrpPaise = bundle.mrpPaise * qty;

      calculatedSubtotalPaise += totalPricePaise;
      verifiedItems.push({
        ...item,
        id: bundle.id,
        bundleId: bundle.id,
        title: bundle.title,
        packCount: bundle.packCount,
        quantity: qty,
        unitPricePaise,
        totalPricePaise,
        mrpPaise,
      });
    }

    // 2. Server-side coupon verification
    let calculatedDiscountPaise = 0;
    let validatedCouponCode: string | null = null;
    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const activeCoupons = await fetchCouponsFromDb();
      const matched = activeCoupons.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
      );

      if (matched && calculatedSubtotalPaise >= (matched.minOrderPaise || 0)) {
        validatedCouponCode = matched.code;
        if (matched.discountType === "percentage") {
          let disc = Math.round((calculatedSubtotalPaise * matched.discountValue) / 100);
          if (matched.maxDiscountPaise && disc > matched.maxDiscountPaise) {
            disc = matched.maxDiscountPaise;
          }
          calculatedDiscountPaise = disc;
        } else if (matched.discountType === "fixed") {
          calculatedDiscountPaise = Math.min(matched.discountValue, calculatedSubtotalPaise);
        }
      }
    }

    const calculatedTotalPaise = Math.max(
      0,
      calculatedSubtotalPaise - calculatedDiscountPaise + (Number(shippingPaise) || 0)
    );

    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      console.warn("Supabase admin client not initialized. Falling back to local response.");
      return NextResponse.json({
        success: true,
        orderNumber,
        warning: "Database not configured, saved locally.",
      });
    }

    // 3. Foreign key protection: Verify userId exists in profiles or auto-create it
    let validUserId: string | null = null;
    if (userId && typeof userId === "string" && userId.trim()) {
      const cleanId = userId.trim();
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", cleanId)
          .maybeSingle();

        if (profile) {
          validUserId = profile.id;
        } else {
          // Attempt to auto-create profile row if user is in auth.users
          const { data: authData } = await supabase.auth.admin.getUserById(cleanId);
          if (authData?.user) {
            const { error: insErr } = await supabase.from("profiles").upsert(
              {
                id: authData.user.id,
                full_name: customerName || authData.user.user_metadata?.full_name || authData.user.email?.split("@")[0] || "Customer",
                email: customerEmail || authData.user.email || null,
                phone: customerPhone || null,
                role: "customer",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );
            if (!insErr) {
              validUserId = authData.user.id;
            }
          }
        }
      } catch (err) {
        console.warn("Could not verify profile for userId:", cleanId, err);
      }
    }

    // 4. Insert order into Supabase with authentic server-verified amounts
    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: validUserId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        shipping_address: shippingAddress,
        items: verifiedItems,
        subtotal_paise: calculatedSubtotalPaise,
        discount_paise: calculatedDiscountPaise,
        coupon_code: validatedCouponCode,
        shipping_paise: Number(shippingPaise) || 0,
        total_paise: calculatedTotalPaise,
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

    return NextResponse.json(
      {
        success: true,
        order: orderRow,
        orderNumber,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      }
    );
  } catch (err: any) {
    console.error("Error in /api/orders/create:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
