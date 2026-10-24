import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase admin not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin orders from Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orders = (data || []).map((d: any) => ({
      id: d.id,
      orderNumber: d.order_number,
      customerName: d.customer_name,
      customerPhone: d.customer_phone,
      customerEmail: d.customer_email,
      shippingAddress: d.shipping_address,
      items: d.items || [],
      subtotalPaise: d.subtotal_paise || 0,
      discountPaise: d.discount_paise || 0,
      shippingPaise: d.shipping_paise || 0,
      totalPaise: d.total_paise || 0,
      paymentMethod: d.payment_method || "cod",
      paymentStatus: d.payment_status || "pending",
      fulfillmentStatus: d.fulfillment_status || "confirmed",
      courierName: d.courier_name,
      trackingNumber: d.tracking_number,
      createdAt: d.created_at || new Date().toISOString(),
      updatedAt: d.updated_at || d.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("Failed to load admin orders:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
