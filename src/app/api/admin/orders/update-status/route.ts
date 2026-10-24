import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { orderNumber, fulfillmentStatus, courierName, trackingNumber } = body;

    if (!orderNumber || !fulfillmentStatus) {
      return NextResponse.json({ error: "Order number and status required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        fulfillment_status: fulfillmentStatus,
        courier_name: courierName || null,
        tracking_number: trackingNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating order status in Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    console.error("Error in /api/admin/orders/update-status:", err);
    return NextResponse.json({ error: err.message || "Failed to update order status" }, { status: 500 });
  }
}
