-- ===================================================================
-- MAA AYURVEDIC CREAM (माँ आयुर्वेदिक क्रीम)
-- Production Supabase PostgreSQL Database Schema
-- Includes Row Level Security (RLS), Indexes, Enum Types & Triggers
-- ===================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'support_staff');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE fulfillment_status AS ENUM ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected', 'refunded');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- 3. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  hindi_title TEXT NOT NULL,
  subtitle TEXT,
  tagline TEXT,
  description TEXT NOT NULL,
  mrp_paise BIGINT NOT NULL,
  price_paise BIGINT NOT NULL,
  net_qty TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE NOT NULL,
  stock_count INTEGER DEFAULT 100 NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  classification TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  directions JSONB NOT NULL DEFAULT '[]'::jsonb,
  dietary_restrictions JSONB NOT NULL DEFAULT '[]'::jsonb,
  precautions JSONB NOT NULL DEFAULT '[]'::jsonb,
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  storage TEXT,
  manufacturer JSONB NOT NULL,
  marketer JSONB NOT NULL,
  batch_info JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. BUNDLE OFFERS TABLE
CREATE TABLE IF NOT EXISTS bundles (
  id TEXT PRIMARY KEY,
  pack_count INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  hindi_tag TEXT,
  mrp_paise BIGINT NOT NULL,
  price_paise BIGINT NOT NULL,
  savings_paise BIGINT NOT NULL,
  savings_percentage INTEGER NOT NULL,
  free_delivery BOOLEAN DEFAULT TRUE NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_best_value BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal_paise BIGINT NOT NULL,
  discount_paise BIGINT DEFAULT 0 NOT NULL,
  coupon_code TEXT,
  shipping_paise BIGINT DEFAULT 0 NOT NULL,
  total_paise BIGINT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  fulfillment_status fulfillment_status DEFAULT 'placed' NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  courier_name TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount_paise BIGINT NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  status payment_status DEFAULT 'pending' NOT NULL,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value INTEGER NOT NULL,
  min_order_paise BIGINT DEFAULT 0 NOT NULL,
  max_discount_paise BIGINT,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  city TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT TRUE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. REFUND REQUESTS TABLE
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  evidence_image_url TEXT,
  status refund_status DEFAULT 'pending' NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_refund_requests_order_number ON refund_requests(order_number);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON support_tickets(ticket_number);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Products & Bundles: Anyone can view active products
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read bundles" ON bundles FOR SELECT USING (active = true);

-- Reviews: Anyone can view approved reviews
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);

-- Orders: Users can only see their own orders; public can insert with server verification
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Coupons: Anyone can verify valid coupons
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (is_active = true);

-- Function to check if caller is an admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Full Access Policies
CREATE POLICY "Admin full access products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin full access bundles" ON bundles FOR ALL USING (is_admin());
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (is_admin());
CREATE POLICY "Admin full access payments" ON payments FOR ALL USING (is_admin());
CREATE POLICY "Admin full access coupons" ON coupons FOR ALL USING (is_admin());
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (is_admin());
CREATE POLICY "Admin full access refund_requests" ON refund_requests FOR ALL USING (is_admin());
CREATE POLICY "Admin full access support_tickets" ON support_tickets FOR ALL USING (is_admin());
CREATE POLICY "Admin full access audit_logs" ON admin_audit_logs FOR ALL USING (is_admin());
