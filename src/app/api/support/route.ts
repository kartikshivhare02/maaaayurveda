import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, category, message } = body;

    if (!customerName || !customerPhone || !message) {
      return NextResponse.json(
        { error: "कृपया नाम, फोन नंबर एवं अपनी समस्या का विवरण दर्ज करें।" },
        { status: 400 }
      );
    }

    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    const supabase = getSupabaseServerAdmin();

    if (supabase) {
      await supabase.from("support_tickets").insert({
        ticket_number: ticketNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        category: category || "general",
        message,
        status: "open",
      });
    }

    return NextResponse.json({
      success: true,
      ticketNumber,
      message: `आपकी सहायता टिकट संख्या ${ticketNumber} दर्ज कर ली गई है। हमारी टीम 24 घंटे में संपर्क करेगी।`,
    });
  } catch (error: any) {
    console.error("Support ticket error:", error);
    return NextResponse.json({ error: "टिकट दर्ज करने में त्रुटि हुई।" }, { status: 500 });
  }
}
