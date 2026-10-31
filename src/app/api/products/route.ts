import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { MAIN_PRODUCT } from "@/lib/data/mockData";

export const revalidate = 300; // Cache 5 minutes at Vercel Edge CDN

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
};

export async function GET() {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json(
        { success: true, product: MAIN_PRODUCT, source: "mock" },
        { headers: CACHE_HEADERS }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", "maa-ayurvedic-cream-50g")
      .maybeSingle();

    if (error || !data) {
      console.warn("Product fetch from Supabase failed or empty, returning default:", error?.message);
      return NextResponse.json(
        { success: true, product: MAIN_PRODUCT, source: "mock" },
        { headers: CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, product: data, source: "database" },
      { headers: CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("Error in /api/products GET:", err);
    return NextResponse.json(
      { success: true, product: MAIN_PRODUCT, source: "fallback" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}
