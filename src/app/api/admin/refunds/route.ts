import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { refundRazorpayPayment, isRazorpayConfigured } from "@/lib/razorpay";

export async function GET() {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("refund_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const requests = (data || []).map((r: any) => ({
      id: r.id,
      orderNumber: r.order_number,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerEmail: r.customer_email,
      reason: r.reason,
      details: r.details,
      evidenceImageUrl: r.evidence_image_url,
      status: r.status,
      adminNotes: r.admin_notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { id, orderNumber, status, adminNotes, processGatewayRefund } = body;

    if (!id && !orderNumber) {
      return NextResponse.json({ error: "id or orderNumber is required" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (status) updatePayload.status = status;
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

    // If marking as refunded or gateway refund requested, look up the order
    let gatewayRefundResult = null;
    const targetOrderNumber = orderNumber;

    if ((status === "refunded" || processGatewayRefund) && targetOrderNumber) {
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("id, order_number, total_paise, payment_method, razorpay_payment_id")
          .eq("order_number", targetOrderNumber)
          .maybeSingle();

        if (order && order.razorpay_payment_id) {
          try {
            gatewayRefundResult = await refundRazorpayPayment(
              order.razorpay_payment_id,
              order.total_paise,
              { order_number: targetOrderNumber, reason: "Customer Satisfaction Guarantee Claim" }
            );
            // Update order payment status
            await supabase
              .from("orders")
              .update({
                payment_status: "refunded",
                updated_at: new Date().toISOString(),
              })
              .eq("order_number", targetOrderNumber);
          } catch (refundErr: any) {
            console.error("Razorpay gateway refund error:", refundErr);
            updatePayload.admin_notes = `${adminNotes || ""} (Gateway Refund Warning: ${refundErr.message})`.trim();
          }
        }
      } catch (e) {
        console.warn("Could not query order for refund:", e);
      }
    }

    let query = supabase.from("refund_requests").update(updatePayload);
    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("order_number", orderNumber);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      gatewayRefund: gatewayRefundResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
