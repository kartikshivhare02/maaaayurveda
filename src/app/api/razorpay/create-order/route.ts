import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { BUNDLE_OFFERS } from "@/lib/data/mockData";
import { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerPhone, customerName } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // SERVER-SIDE PRICE RECALCULATION (Never trust client prices)
    let calculatedSubtotalPaise = 0;
    for (const item of items as CartItem[]) {
      const bundle = BUNDLE_OFFERS.find((b) => b.id === item.bundleId);
      if (!bundle) {
        return NextResponse.json({ error: `Invalid bundle: ${item.bundleId}` }, { status: 400 });
      }
      calculatedSubtotalPaise += bundle.pricePaise * item.quantity;
    }

    // Generate unique order receipt
    const receipt = `MAA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const razorpayOrder = await createRazorpayOrder(calculatedSubtotalPaise, "INR", receipt);

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt,
      customerName,
      customerPhone,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
