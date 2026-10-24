import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tickets = (data || []).map((t: any) => ({
      id: t.id,
      ticketNumber: t.ticket_number,
      customerName: t.customer_name,
      customerPhone: t.customer_phone,
      customerEmail: t.customer_email,
      category: t.category,
      message: t.message,
      status: t.status,
      adminReply: t.admin_reply,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    return NextResponse.json({ success: true, tickets });
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
    const { ticketNumber, status, adminReply } = body;

    if (!ticketNumber) {
      return NextResponse.json({ error: "ticketNumber is required" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (status) updatePayload.status = status;
    if (adminReply !== undefined) updatePayload.admin_reply = adminReply;

    const { error } = await supabase
      .from("support_tickets")
      .update(updatePayload)
      .eq("ticket_number", ticketNumber);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
