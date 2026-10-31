import { NextResponse } from "next/server";
import { getSupabaseServerAdmin } from "@/lib/supabase/server";
import { DEFAULT_STORY_TESTIMONIALS } from "@/lib/data/mockData";

export const revalidate = 3600; // Cache 1 hour at Vercel Edge CDN

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET() {
  try {
    const supabase = getSupabaseServerAdmin();
    if (!supabase) {
      return NextResponse.json(
        { success: true, stories: DEFAULT_STORY_TESTIMONIALS, source: "mock" },
        { headers: CACHE_HEADERS }
      );
    }

    const { data, error } = await supabase
      .from("story_testimonials")
      .select("id, customer_name, city, concern, duration, rating, before_image_url, after_image_url, video_url, story_hindi, is_verified, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Stories fetch from Supabase empty, returning fallback:", error?.message);
      return NextResponse.json(
        { success: true, stories: DEFAULT_STORY_TESTIMONIALS, source: "mock" },
        { headers: CACHE_HEADERS }
      );
    }

    const stories = data.map((s: any) => ({
      id: s.id,
      customerName: s.customer_name || s.customerName || "",
      city: s.city || "",
      concern: s.concern || "",
      duration: s.duration || "",
      rating: s.rating || 5,
      beforeImageUrl: s.before_image_url || s.beforeImageUrl || "/images/stories/daad_before.jpg",
      afterImageUrl: s.after_image_url || s.afterImageUrl || "/images/stories/daad_after.jpg",
      videoUrl: s.video_url || s.videoUrl || "",
      storyHindi: s.story_hindi || s.storyHindi || "",
      isVerified: s.is_verified ?? s.isVerified ?? true,
      isActive: s.is_active ?? s.isActive ?? true,
      createdAt: s.created_at || s.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, stories, source: "database" }, { headers: CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in /api/stories GET:", err);
    return NextResponse.json(
      { success: true, stories: DEFAULT_STORY_TESTIMONIALS, source: "fallback" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}
