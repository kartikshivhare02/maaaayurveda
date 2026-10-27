import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseServerAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", "maa-ayurvedic-cream-50g")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, product: data });
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = await request.json();
    const {
      name,
      hindiTitle,
      subtitle,
      tagline,
      description,
      pricePaise,
      mrpPaise,
      netQty,
      stockCount,
      inStock,
      images,
      ingredients,
      manufacturer,
      marketer,
      batchInfo,
    } = body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updatePayload.name = name;
    if (hindiTitle !== undefined) updatePayload.hindi_title = hindiTitle;
    if (subtitle !== undefined) updatePayload.subtitle = subtitle;
    if (tagline !== undefined) updatePayload.tagline = tagline;
    if (description !== undefined) updatePayload.description = description;
    if (pricePaise !== undefined) updatePayload.price_paise = pricePaise;
    if (mrpPaise !== undefined) updatePayload.mrp_paise = mrpPaise;
    if (netQty !== undefined) updatePayload.net_qty = netQty;
    if (stockCount !== undefined) updatePayload.stock_count = stockCount;
    if (inStock !== undefined) updatePayload.in_stock = inStock;
    if (images !== undefined) updatePayload.images = images;
    if (ingredients !== undefined) updatePayload.ingredients = ingredients;
    if (manufacturer !== undefined) updatePayload.manufacturer = manufacturer;
    if (marketer !== undefined) updatePayload.marketer = marketer;
    if (batchInfo !== undefined) updatePayload.batch_info = batchInfo;

    const { data, error } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", "maa-ayurvedic-cream-50g")
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating Supabase product:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    console.error("Error in /api/admin/products:", err);
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}
