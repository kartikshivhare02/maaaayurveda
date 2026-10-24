import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  MAIN_PRODUCT,
  BUNDLE_OFFERS,
  COUPONS,
  DEFAULT_STORY_TESTIMONIALS,
  REVIEWS,
  BRAND_INFO,
} from "@/lib/data/mockData";
import { Product, BundleOffer, Coupon, StoryTestimonial, Review, SiteSettings } from "@/types";

// Helper to convert snake_case DB row to camelCase BundleOffer
export function mapDbBundle(row: any): BundleOffer {
  return {
    id: row.id,
    packCount: row.pack_count,
    title: row.title,
    subtitle: row.subtitle || "",
    hindiTag: row.hindi_tag || "",
    mrpPaise: Number(row.mrp_paise),
    pricePaise: Number(row.price_paise),
    savingsPaise: Number(row.savings_paise),
    savingsPercentage: Number(row.savings_percentage),
    freeDelivery: Boolean(row.free_delivery),
    isPopular: Boolean(row.is_popular),
    isBestValue: Boolean(row.is_best_value),
    active: Boolean(row.active),
  };
}

// Helper to convert camelCase BundleOffer to snake_case DB row
export function mapBundleToDb(b: BundleOffer): any {
  return {
    id: b.id,
    pack_count: b.packCount,
    title: b.title,
    subtitle: b.subtitle,
    hindi_tag: b.hindiTag,
    mrp_paise: b.mrpPaise,
    price_paise: b.pricePaise,
    savings_paise: b.savingsPaise,
    savings_percentage: b.savingsPercentage,
    free_delivery: b.freeDelivery,
    is_popular: b.isPopular || false,
    is_best_value: b.isBestValue || false,
    active: b.active,
  };
}

// Helper to convert snake_case DB row to camelCase Product
export function mapDbProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    hindiTitle: row.hindi_title,
    subtitle: row.subtitle || "",
    tagline: row.tagline || "",
    description: row.description,
    mrpPaise: Number(row.mrp_paise),
    pricePaise: Number(row.price_paise),
    netQty: row.net_qty,
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count),
    images: Array.isArray(row.images)
      ? row.images.map((img: any) => (typeof img === "string" ? img : img.url))
      : MAIN_PRODUCT.images,
    galleryImages: Array.isArray(row.images) ? row.images : undefined,
    category: row.category,
    classification: row.classification,
    ingredients: row.ingredients || MAIN_PRODUCT.ingredients,
    directions: row.directions || MAIN_PRODUCT.directions,
    dietaryRestrictions: row.dietary_restrictions || MAIN_PRODUCT.dietaryRestrictions,
    precautions: row.precautions || MAIN_PRODUCT.precautions,
    warnings: row.warnings || MAIN_PRODUCT.warnings,
    storage: row.storage || MAIN_PRODUCT.storage,
    manufacturer: row.manufacturer || MAIN_PRODUCT.manufacturer,
    marketer: row.marketer || MAIN_PRODUCT.marketer,
    batchInfo: row.batch_info || MAIN_PRODUCT.batchInfo,
  };
}

// Helper to convert snake_case DB row to StoryTestimonial
export function mapDbStory(row: any): StoryTestimonial {
  return {
    id: row.id,
    customerName: row.customer_name,
    city: row.city,
    concern: row.concern,
    duration: row.duration,
    rating: Number(row.rating || 5),
    beforeImageUrl: row.before_image_url,
    afterImageUrl: row.after_image_url,
    storyHindi: row.story_hindi,
    isVerified: Boolean(row.is_verified),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Helper to convert snake_case DB row to Coupon
export function mapDbCoupon(row: any): Coupon {
  return {
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minOrderPaise: Number(row.min_order_paise || 0),
    maxDiscountPaise: row.max_discount_paise ? Number(row.max_discount_paise) : undefined,
    expiryDate: row.expiry_date,
    isActive: Boolean(row.is_active),
    description: row.description || "",
  };
}

// ==========================================
// CLIENT & SERVER DB DATA FETCHERS
// ==========================================

export async function fetchBundlesFromDb(): Promise<BundleOffer[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("bundles")
        .select("*")
        .order("pack_count", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapDbBundle);
      }
    } catch (e) {
      console.warn("Supabase fetchBundles error, using fallback:", e);
    }
  }
  return BUNDLE_OFFERS;
}

export async function fetchProductFromDb(slug = "maa-ayurvedic-cream"): Promise<Product> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return mapDbProduct(data);
      }
    } catch (e) {
      console.warn("Supabase fetchProduct error, using fallback:", e);
    }
  }
  return MAIN_PRODUCT;
}

export async function fetchStoriesFromDb(): Promise<StoryTestimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("story_testimonials")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapDbStory);
      }
    } catch (e) {
      console.warn("Supabase fetchStories error, using fallback:", e);
    }
  }
  return DEFAULT_STORY_TESTIMONIALS;
}

export async function fetchCouponsFromDb(): Promise<Coupon[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true);

      if (!error && data && data.length > 0) {
        return data.map(mapDbCoupon);
      }
    } catch (e) {
      console.warn("Supabase fetchCoupons error, using fallback:", e);
    }
  }
  return COUPONS;
}

export async function fetchSiteSettingsFromDb(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    id: "main",
    brandName: BRAND_INFO.name,
    tagline: BRAND_INFO.tagline,
    logoUrl: BRAND_INFO.logoUrl,
    whatsappNumber: BRAND_INFO.whatsappNumber,
    whatsappDisplay: BRAND_INFO.whatsappDisplay,
    supportEmail: BRAND_INFO.supportEmail,
    supportHours: BRAND_INFO.supportHours,
    address: BRAND_INFO.address,
    licenseNo: BRAND_INFO.licenseNo,
    announcementText: "🌿 100% शुद्ध आयुर्वेदिक फॉर्मूला • मुफ्त डिलीवरी • कैश ऑन डिलीवरी",
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          brandName: data.brand_name || defaultSettings.brandName,
          tagline: data.tagline || defaultSettings.tagline,
          logoUrl: data.logo_url || defaultSettings.logoUrl,
          whatsappNumber: data.whatsapp_number || defaultSettings.whatsappNumber,
          whatsappDisplay: data.whatsapp_display || defaultSettings.whatsappDisplay,
          supportEmail: data.support_email || defaultSettings.supportEmail,
          supportHours: data.support_hours || defaultSettings.supportHours,
          address: data.address || defaultSettings.address,
          licenseNo: data.license_no || defaultSettings.licenseNo,
          announcementText: data.announcement_text || defaultSettings.announcementText,
        };
      }
    } catch (e) {
      console.warn("Supabase fetchSiteSettings error, using fallback:", e);
    }
  }

  return defaultSettings;
}

export async function fetchReviewsFromDb(): Promise<Review[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_approved", true);

      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          customerName: r.customer_name,
          city: r.city,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verifiedPurchase: Boolean(r.verified_purchase),
          isApproved: Boolean(r.is_approved),
          date: new Date(r.created_at || Date.now()).toLocaleDateString("hi-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        }));
      }
    } catch (e) {
      console.warn("Supabase fetchReviews error, using fallback:", e);
    }
  }
  return REVIEWS;
}

// ==========================================
// ADMIN SAVE / UPDATE FUNCTIONS
// ==========================================

export async function saveBundleToDb(bundle: BundleOffer): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from("bundles")
        .upsert(mapBundleToDb(bundle), { onConflict: "id" });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function saveStoryToDb(story: StoryTestimonial): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from("story_testimonials").upsert(
        {
          id: story.id,
          customer_name: story.customerName,
          city: story.city,
          concern: story.concern,
          duration: story.duration,
          rating: story.rating,
          before_image_url: story.beforeImageUrl,
          after_image_url: story.afterImageUrl,
          story_hindi: story.storyHindi,
          is_verified: story.isVerified,
          is_active: story.isActive,
        },
        { onConflict: "id" }
      );
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function saveCouponToDb(coupon: Coupon): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from("coupons").upsert(
        {
          code: coupon.code,
          discount_type: coupon.discountType,
          discount_value: coupon.discountValue,
          min_order_paise: coupon.minOrderPaise,
          max_discount_paise: coupon.maxDiscountPaise,
          expiry_date: coupon.expiryDate,
          is_active: coupon.isActive,
          description: coupon.description,
        },
        { onConflict: "code" }
      );
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function deleteCouponFromDb(code: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from("coupons").delete().eq("code", code);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function saveSiteSettingsToDb(settings: SiteSettings): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from("site_settings").upsert(
        {
          id: "main",
          brand_name: settings.brandName,
          tagline: settings.tagline,
          logo_url: settings.logoUrl,
          whatsapp_number: settings.whatsappNumber,
          whatsapp_display: settings.whatsappDisplay,
          support_email: settings.supportEmail,
          support_hours: settings.supportHours,
          address: settings.address,
          license_no: settings.licenseNo,
          announcement_text: settings.announcementText,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}
