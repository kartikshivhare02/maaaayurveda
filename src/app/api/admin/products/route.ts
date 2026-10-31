import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

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

  return NextResponse.json(
    { success: true, product: data },
    { headers: { "Cache-Control": "private, no-cache, no-store, must-revalidate" } }
  );
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

    // Process images: If any image is base64, upload to Supabase Storage bucket 'product-images'
    // to prevent storing large data URLs in the database which consumes massive Fast Origin Transfer
    if (images !== undefined && Array.isArray(images)) {
      const processedImages = [];
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const rawUrl = typeof item === "string" ? item : item.url;
        if (rawUrl && rawUrl.startsWith("data:image/")) {
          const match = rawUrl.match(/^data:image\/(\w+);base64,(.+)$/);
          if (match) {
            const ext = match[1] === "jpeg" ? "jpg" : match[1];
            const buffer = Buffer.from(match[2], "base64");
            const fileId = (typeof item !== "string" && item.id) ? item.id : `img-${Date.now()}-${i}`;
            const fileName = `${fileId}.${ext}`;

            try {
              await supabase.storage
                .from("product-images")
                .upload(fileName, buffer, {
                  contentType: `image/${match[1]}`,
                  upsert: true,
                });
              const { data: publicUrlData } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

              if (typeof item === "string") {
                processedImages.push(publicUrlData.publicUrl);
              } else {
                processedImages.push({ ...item, url: publicUrlData.publicUrl });
              }
              continue;
            } catch (upErr) {
              console.warn("Could not upload image to Supabase Storage, keeping original:", upErr);
            }
          }
        }
        processedImages.push(item);
      }
      updatePayload.images = processedImages;
    }

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

    try {
      revalidateTag("product");
      revalidatePath("/");
      revalidatePath("/product");
      revalidatePath("/api/products");
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    console.error("Error in /api/admin/products:", err);
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}
