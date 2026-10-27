import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { MAIN_PRODUCT } from "@/lib/data/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ success: true, product: MAIN_PRODUCT, source: "mock" });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", "maa-ayurvedic-cream-50g")
      .maybeSingle();

    if (error || !data) {
      console.warn("Product fetch from Supabase failed or empty, returning default:", error?.message);
      return NextResponse.json({ success: true, product: MAIN_PRODUCT, source: "mock" });
    }

    return NextResponse.json({ success: true, product: data, source: "database" });
  } catch (err: any) {
    console.error("Error in /api/products GET:", err);
    return NextResponse.json({ success: true, product: MAIN_PRODUCT, source: "fallback" });
  }
}
