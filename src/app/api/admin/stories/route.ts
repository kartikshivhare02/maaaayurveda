import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("story_testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const stories = (data || []).map((s: any) => ({
    id: s.id,
    customerName: s.customer_name || s.customerName || "",
    city: s.city || "",
    concern: s.concern || "",
    duration: s.duration || "",
    rating: s.rating || 5,
    beforeImageUrl: s.before_image_url || s.beforeImageUrl || "/images/product.jpeg",
    afterImageUrl: s.after_image_url || s.afterImageUrl || "/images/product.jpeg",
    storyHindi: s.story_hindi || s.storyHindi || "",
    isVerified: s.is_verified ?? s.isVerified ?? true,
    isActive: s.is_active ?? s.isActive ?? true,
    createdAt: s.created_at || s.createdAt || new Date().toISOString(),
  }));

  return NextResponse.json({ success: true, stories });
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { story } = body;

    if (!story || !story.customerName || !story.storyHindi) {
      return NextResponse.json({ error: "Story data missing" }, { status: 400 });
    }

    const payload: Record<string, any> = {
      id: story.id || `story-${Date.now()}`,
      customer_name: story.customerName,
      city: story.city,
      concern: story.concern,
      duration: story.duration,
      rating: story.rating || 5,
      before_image_url: story.beforeImageUrl,
      after_image_url: story.afterImageUrl,
      story_hindi: story.storyHindi,
      is_verified: story.isVerified !== false,
      is_active: story.isActive !== false,
      created_at: story.createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("story_testimonials")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Error upserting Supabase story:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, story: data });
  } catch (err: any) {
    console.error("Error in /api/admin/stories POST:", err);
    return NextResponse.json({ error: err.message || "Failed to save story" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("story_testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/admin/stories DELETE:", err);
    return NextResponse.json({ error: err.message || "Failed to delete story" }, { status: 500 });
  }
}
