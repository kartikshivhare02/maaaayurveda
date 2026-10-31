import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidate = 3600;

export async function GET() {
  const supabase = getSupabaseServerAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("bundles")
    .select("id, pack_count, title, subtitle, hindi_tag, mrp_paise, price_paise, savings_paise, savings_percentage, free_delivery, is_popular, is_best_value, active")
    .eq("active", true)
    .order("pack_count", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, bundles: data },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { bundles } = body;

    if (!Array.isArray(bundles)) {
      return NextResponse.json({ error: "Bundles array required" }, { status: 400 });
    }

    // Upsert each bundle in Supabase
    for (const b of bundles) {
      const payload: Record<string, any> = {
        id: b.id,
        pack_count: b.packCount,
        title: b.title,
        subtitle: b.subtitle || null,
        hindi_tag: b.hindiTag || null,
        mrp_paise: b.mrpPaise,
        price_paise: b.pricePaise,
        savings_paise: b.savingsPaise,
        savings_percentage: b.savingsPercentage,
        free_delivery: b.freeDelivery !== false,
        is_popular: Boolean(b.isPopular),
        is_best_value: Boolean(b.isBestValue),
        active: b.active !== false,
      };

      const { error } = await supabase
        .from("bundles")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.error(`Error updating bundle ${b.id}:`, error);
      }
    }

    try {
      revalidateTag("bundles");
      revalidatePath("/");
      revalidatePath("/product");
      revalidatePath("/api/admin/bundles");
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/admin/bundles:", err);
    return NextResponse.json({ error: err.message || "Failed to update bundles" }, { status: 500 });
  }
}
