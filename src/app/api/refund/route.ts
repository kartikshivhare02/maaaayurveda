import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      reason,
      details,
      evidenceImageUrl,
    } = body;

    if (!orderNumber || !customerName || !customerPhone || !reason) {
      return NextResponse.json(
        { error: "कृपया ऑर्डर नंबर, नाम, फोन और रिफंड का कारण अवश्य भरें।" },
        { status: 400 }
      );
    }

    const claimId = `REF-${Date.now().toString().slice(-6)}`;
    const supabase = getSupabaseServerAdmin();

    if (supabase) {
      await supabase.from("refund_requests").insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || "",
        reason,
        details: details || "",
        evidence_image_url: evidenceImageUrl || null,
        status: "pending",
      });
    }

    return NextResponse.json({
      success: true,
      claimId,
      message: `रिफंड दावा संदर्भ सं. ${claimId} दर्ज कर लिया गया है। हमारे क्लेम विभाग द्वारा 48 घंटे में सत्यापन किया जाएगा।`,
    });
  } catch (error: any) {
    console.error("Refund claim submission error:", error);
    return NextResponse.json({ error: "रिफंड अनुरोध दर्ज करने में असमर्थ।" }, { status: 500 });
  }
}
