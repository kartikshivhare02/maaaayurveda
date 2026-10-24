export interface Product {
  id: string;
  slug: string;
  name: string;
  hindiTitle: string;
  subtitle: string;
  tagline: string;
  description: string;
  mrpPaise: number;
  pricePaise: number;
  netQty: string;
  inStock: boolean;
  stockCount: number;
  images: string[];
  galleryImages?: ProductImageItem[];
  category: string;
  classification: string;
  ingredients: {
    hindiName: string;
    botanicalName?: string;
    purpose: string;
    percentage?: string;
  }[];
  directions: string[];
  dietaryRestrictions: string[];
  precautions: string[];
  warnings: string[];
  storage: string;
  manufacturer: {
    name: string;
    address: string;
    licenseNo: string;
  };
  marketer: {
    name: string;
    address: string;
    customerCarePhone: string;
    customerCareEmail: string;
  };
  batchInfo: {
    batchNumber: string;
    mfgDate: string;
    expiryDate: string;
    shelfLife: string;
  };
}

export interface ProductImageItem {
  id: string;
  url: string;
  label: string;
  subtitle?: string;
  isPrimary: boolean;
  type?: "primary" | "secondary";
}

export interface BundleOffer {
  id: string;
  packCount: number;
  title: string;
  subtitle: string;
  hindiTag: string;
  mrpPaise: number;
  pricePaise: number;
  savingsPaise: number;
  savingsPercentage: number;
  freeDelivery: boolean;
  isPopular?: boolean;
  isBestValue?: boolean;
  active: boolean;
}

export interface CartItem {
  id: string;
  bundleId: string;
  title: string;
  packCount: number;
  unitPricePaise: number;
  totalPricePaise: number;
  mrpPaise: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  flatHouseNo: string;
  streetLocality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type PaymentMethod = "razorpay_online" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type FulfillmentStatus = "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotalPaise: number;
  discountPaise: number;
  couponCode?: string;
  shippingPaise: number;
  totalPaise: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  courierName?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // percentage (e.g., 10) or paise (e.g., 10000 = ₹100)
  minOrderPaise: number;
  maxDiscountPaise?: number;
  expiryDate: string;
  isActive: boolean;
  description: string;
}

export interface Review {
  id: string;
  customerName: string;
  city: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  isApproved: boolean;
  date: string;
}

export interface RefundRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reason: string;
  details: string;
  evidenceImageUrl?: string;
  status: "pending" | "approved" | "rejected" | "refunded";
  adminNotes?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  category: "order" | "product_usage" | "delivery" | "refund" | "general";
  message: string;
  status: "open" | "in_progress" | "resolved";
  adminReply?: string;
  createdAt: string;
}

export interface SEOAuditIssue {
  id: string;
  category: "meta" | "content" | "links" | "performance" | "schema" | "mobile";
  severity: "high" | "medium" | "low" | "passed";
  title: string;
  url: string;
  description: string;
  recommendation: string;
}

export interface StoryTestimonial {
  id: string;
  customerName: string;
  city: string;
  avatarUrl?: string;
  concern: string; // e.g. "दाद (Ringworm)", "एड़ियों की दरारें", "सोरायसिस पैच"
  duration: string; // e.g. "14 दिन", "21 दिन"
  rating: number; // e.g. 5
  beforeImageUrl: string;
  afterImageUrl: string;
  storyHindi: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  brandName: string;
  tagline: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  supportEmail: string;
  supportHours: string;
  address: string;
  licenseNo: string;
  announcementText: string;
}

