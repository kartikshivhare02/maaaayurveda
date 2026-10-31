import { NextResponse } from "next/server";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";
import { fetchBundlesFromDb, fetchCouponsFromDb } from "@/lib/data/db";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      customerPhone,
      customerName,
      customerEmail,
      shippingAddress,
      couponCode,
      shippingPaise = 0,
      userId,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "कार्ट खाली है (Cart is empty)" }, { status: 400 });
    }

    // 1. SERVER-SIDE PRICE RECALCULATION
    const activeBundles = await fetchBundlesFromDb();
    let calculatedSubtotalPaise = 0;
    const verifiedItems: CartItem[] = [];

    for (const item of items as CartItem[]) {
      const bundle = activeBundles.find((b) => b.id === item.bundleId);
      if (!bundle) {
        return NextResponse.json(
          { error: `अमान्य बंडल चयन: ${item.bundleId}` },
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

    // 2. SERVER-SIDE COUPON DISCOUNT VERIFICATION
    let calculatedDiscountPaise = 0;
    if (couponCode) {
      const activeCoupons = await fetchCouponsFromDb();
      const matchedCoupon = activeCoupons.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
      );

      if (matchedCoupon && calculatedSubtotalPaise >= (matchedCoupon.minOrderPaise || 0)) {
        if (matchedCoupon.discountType === "percentage") {
          let disc = Math.round((calculatedSubtotalPaise * matchedCoupon.discountValue) / 100);
          if (matchedCoupon.maxDiscountPaise && disc > matchedCoupon.maxDiscountPaise) {
            disc = matchedCoupon.maxDiscountPaise;
          }
          calculatedDiscountPaise = disc;
        } else if (matchedCoupon.discountType === "fixed") {
          calculatedDiscountPaise = Math.min(matchedCoupon.discountValue, calculatedSubtotalPaise);
        }
      }
    }

    const finalTotalPaise = Math.max(
      100, // Razorpay minimum charge is 100 paise (₹1.00)
      Math.round(calculatedSubtotalPaise - calculatedDiscountPaise + (Number(shippingPaise) || 0))
    );

    // 3. GENERATE UNIQUE ORDER IDENTIFIER
    const orderNumber = `MAA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 4. CREATE RAZORPAY ORDER
    const notes: Record<string, string> = {
      order_number: orderNumber,
      customer_name: (customerName || "").slice(0, 40),
      customer_phone: (customerPhone || "").slice(0, 15),
    };
    if (shippingAddress?.city) {
      notes.city = shippingAddress.city.slice(0, 40);
    }

    const razorpayOrder = await createRazorpayOrder(
      finalTotalPaise,
      "INR",
      orderNumber,
      notes
    );

    // 5. PRE-SAVE ORDER IN SUPABASE WITH 'pending' PAYMENT STATUS
    const supabase = getSupabaseServerAdmin();
    if (supabase) {
      try {
        // Foreign key protection: Verify userId exists in profiles or auto-create it
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
          } catch (verErr) {
            console.warn("Could not verify profile for razorpay order user:", cleanId, verErr);
          }
        }

        await supabase.from("orders").upsert(
          {
            order_number: orderNumber,
            user_id: validUserId,
            customer_name: customerName || "Customer",
            customer_phone: customerPhone || "",
            customer_email: customerEmail || null,
            shipping_address: shippingAddress || {},
            items: verifiedItems,
            subtotal_paise: calculatedSubtotalPaise,
            discount_paise: calculatedDiscountPaise,
            coupon_code: couponCode || null,
            shipping_paise: Number(shippingPaise) || 0,
            total_paise: finalTotalPaise,
            payment_method: "razorpay_online",
            payment_status: "pending",
            fulfillment_status: "placed",
            razorpay_order_id: razorpayOrder.id,
            notes: notes.city ? `City: ${notes.city}` : null,
          },
          { onConflict: "order_number" }
        );
      } catch (dbErr) {
        console.warn("Could not pre-save pending order in Supabase:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        keyId: getRazorpayKeyId(),
        orderNumber,
        customerName,
        customerPhone,
        isMock: razorpayOrder.isMock,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      }
    );
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "रेज़रपे ऑर्डर बनाने में समस्या आई।" },
      { status: 500 }
    );
  }
}
