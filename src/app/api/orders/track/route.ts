import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    if (!query) {
      return NextResponse.json({ error: "खोज के लिए ऑर्डर नंबर या फोन नंबर आवश्यक है।" }, { status: 400 });
    }

    const clean = query.toUpperCase();
    const supabase = getSupabaseServerAdmin();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`order_number.ilike.${clean},customer_phone.ilike.%${clean}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Order track search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ order: null });
    }

    const order = {
      id: data.id,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      shippingAddress: data.shipping_address,
      items: data.items || [],
      subtotalPaise: data.subtotal_paise || 0,
      discountPaise: data.discount_paise || 0,
      shippingPaise: data.shipping_paise || 0,
      totalPaise: data.total_paise || 0,
      paymentMethod: data.payment_method || "cod",
      paymentStatus: data.payment_status || "pending",
      fulfillmentStatus: data.fulfillment_status || "confirmed",
      courierName: data.courier_name,
      trackingNumber: data.tracking_number,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || data.created_at || new Date().toISOString(),
    };

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Error in /api/orders/track:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
