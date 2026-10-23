# माँ आयुर्वेदिक (Maa Ayurveda) - E-Commerce Platform

A production-ready Ayurvedic e-commerce platform built with Next.js 16 (Turbopack, App Router), Tailwind CSS v4, TypeScript, Supabase, and Razorpay integration.

---

## 🌿 Features

- **High-Converting Product Experience**: Hero gallery, combo bundle selectors with real-time discounts, and interactive before/after recovery stories (Instagram story format).
- **Checkout & Payments**: Integrated Cash on Delivery (COD) and Razorpay online payments with instant UPI / cards / net banking support.
- **Pincode Delivery Estimator**: Live serviceable pincode checker with delivery timelines.
- **Order Tracking & Refund Portal**: Self-service tracking and 30-day money-back guarantee claim submission.
- **Comprehensive Admin Suite**: Order processing, dispatch tracking, refund approvals, and customer inquiry management.
- **Ayurvedic Compliance**: Detailed Ayurvedic lifestyle & dietary precautions (परहेज) guide, herbal ingredient breakdown, and trust certifications.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
git clone https://github.com/kartikshivhare02/maaaayurveda.git
cd maaaayurveda
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Public Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (server-only)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Razorpay Secret Key
- `RAZORPAY_WEBHOOK_SECRET`: Razorpay Webhook Secret

*(Note: The platform includes built-in mock fallbacks so it functions smoothly even before live API keys are connected.)*

### 4. Database Setup (Supabase)
Run the SQL migration script located in [`supabase/schema.sql`](./supabase/schema.sql) inside your Supabase SQL Editor.

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Production Build & Verification

```bash
# Verify TypeScript & Next.js production compilation
npm run build

# Run linting
npm run lint
```

---

## ☁️ Deployment (Vercel)

1. Push your repository to GitHub (or import directly into [Vercel](https://vercel.com/new)).
2. Set the Framework Preset to **Next.js**.
3. Add the environment variables from `.env.example` under **Settings > Environment Variables**.
4. Click **Deploy**.
