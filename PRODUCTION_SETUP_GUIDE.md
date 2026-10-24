# माँ आयुर्वेदिक (Maa Ayurvedic) — Production Deployment & Domain Setup Guide

यह संपूर्ण गाइड डोमेन खरीदने के बाद **Vercel**, **Supabase**, **Google OAuth**, और **Razorpay Live** को लाइव डोमेन से जोड़ने की विस्तृत और चरणबद्ध प्रक्रिया प्रदान करती है।

---

## विषय सूची (Table of Contents)
1. [चरण 1: Vercel पर प्रोजेक्ट डेप्लॉय व कस्टम डोमेन जोड़ना](#चरण-1-vercel-पर-प्रोजेक्ट-डेप्लॉय-व-कस्टम-डोमेन-जोड़ना)
2. [चरण 2: DNS सेटिंग्स (GoDaddy / Namecheap / Hostinger)](#चरण-2-dns-सेटिंग्स-godaddy--namecheap--hostinger)
3. [चरण 3: Supabase Authentication व Redirect URLs कॉन्फ़िगरेशन](#चरण-3-supabase-authentication-व-redirect-urls-कॉन्फ़िगरेशन)
4. [चरण 4: Google Cloud Console OAuth 2.0 कॉन्फ़िगरेशन](#चरण-4-google-cloud-console-oauth-20-कॉन्फ़िगरेशन)
5. [चरण 5: Razorpay Live पेमेंट गेटवे व Webhook सेटअप](#चरण-5-razorpay-live-पेमेंट-गेटवे-व-webhook-सेटअप)
6. [चरण 6: Vercel Environment Variables की अंतिम चेकलिस्ट](#चरण-6-vercel-environment-variables-की-अंतिम-चेकलिस्ट)

---

## चरण 1: Vercel पर प्रोजेक्ट डेप्लॉय व कस्टम डोमेन जोड़ना

### 1.1 GitHub Repo को Vercel से जोड़ें
1. [Vercel.com](https://vercel.com/) पर जाएं और अपने GitHub खाते से लॉगिन करें।
2. **"Add New..."** ➔ **"Project"** पर क्लिक करें।
3. अपनी रिपॉजिटरी `kartikshivhare02/maaaayurveda` को खोजें और **"Import"** पर क्लिक करें।
4. **Framework Preset**: `Next.js` स्वतः चयनित रहेगा।
5. **Root Directory**: `./` ही रहने दें।

### 1.2 Custom Domain जोड़ना
1. Vercel प्रोजेक्ट डैशबोर्ड में **Settings** ➔ **Domains** पर जाएं।
2. अपना खरीदा हुआ डोमेन दर्ज करें (उदाहरण: `maaayurvedic.in`) और **Add** पर क्लिक करें।
3. Vercel स्वतः दो डोमेन जोड़ने का सुझाव देगा:
   - `maaayurvedic.in` (Apex Domain)
   - `www.maaayurvedic.in` (Redirects to apex or vice-versa)
4. दोनों को जोड़ें (Recommended: `www.maaayurvedic.in` redirects to `maaayurvedic.in`).

---

## चरण 2: DNS सेटिंग्स (GoDaddy / Namecheap / Hostinger)

जहाँ से आपने डोमेन खरीदा है (GoDaddy, Hostinger, Namecheap, Google Domains आदि), उसके **DNS Management** पैनल में जाएं और ये रिकॉर्ड जोड़ें:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (या खाली छोड़ें) | `76.76.21.21` | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 3600 |

> **SSL Certificate**: Vercel DNS रिकॉर्ड सत्यापित होते ही 5 से 15 मिनट में स्वतः मुफ्त **Let's Encrypt SSL (HTTPS)** जारी कर देता है।

---

## चरण 3: Supabase Authentication व Redirect URLs कॉन्फ़िगरेशन

आपका Supabase Project ID: `mbwnmzjiqpanovkvbxks`  
Supabase URL: `https://mbwnmzjiqpanovkvbxks.supabase.co`

### 3.1 Site URL और Redirect URLs अपडेट करें
1. [Supabase Dashboard](https://supabase.com/dashboard/project/mbwnmzjiqpanovkvbxks) में जाएं।
2. बाईं मेनू से **Authentication** ➔ **URL Configuration** पर क्लिक करें।
3. **Site URL** में अपना लाइव डोमेन डालें:
   ```text
   https://maaayurvedic.in
   ```
4. **Redirect URLs** सूची में ये URL जोड़ें (प्रत्येक URL जोड़कर **Add URL** दबाएं):
   ```text
   https://maaayurvedic.in/api/auth/callback
   https://maaayurvedic.in/**
   https://www.maaayurvedic.in/api/auth/callback
   https://www.maaayurvedic.in/**
   http://localhost:3000/api/auth/callback
   http://localhost:3000/**
   ```
5. सबसे नीचे **Save** पर क्लिक करें।

---

## चरण 4: Google Cloud Console OAuth 2.0 कॉन्फ़िगरेशन

Google लॉगिन को लाइव डोमेन पर चालू करने के लिए:

1. [Google Cloud Console](https://console.cloud.google.com/) पर जाएं।
2. टॉप बार से अपना प्रोजेक्ट चुनें।
3. बाईं मेनू में **APIs & Services** ➔ **Credentials** पर जाएं।
4. **OAuth 2.0 Client IDs** के तहत अपने मौजूदा वेब क्लाइंट पर क्लिक करें (या नया बनाएं)।

### 4.1 Authorized JavaScript Origins
निम्न URLs दर्ज करें:
```text
https://maaayurvedic.in
https://www.maaayurvedic.in
https://mbwnmzjiqpanovkvbxks.supabase.co
http://localhost:3000
```

### 4.2 Authorized Redirect URIs
> **अत्यंत महत्वपूर्ण**: Google सीधे Supabase के ऑथ हैंडलर पर टोकन भेजता है:
```text
https://mbwnmzjiqpanovkvbxks.supabase.co/auth/v1/callback
```
*(यदि स्थानीय टेस्टिंग करनी हो तो `http://localhost:3000/api/auth/callback` भी रख सकते हैं)*

5. नीचे **Save** बटन पर क्लिक करें।
6. प्राप्त **Client ID** और **Client Secret** को Supabase डैशबोर्ड में:
   - **Authentication** ➔ **Providers** ➔ **Google** खोलें।
   - **Enable Google Provider** चालू करें।
   - Client ID और Client Secret पेस्ट करके **Save** करें।

---

## चरण 5: Razorpay Live पेमेंट गेटवे व Webhook सेटअप

### 5.1 Live Mode चालू करें
1. [Razorpay Dashboard](https://dashboard.razorpay.com/) पर लॉगिन करें।
2. टॉप-राइट टॉगल से **"Test Mode"** को बदलकर **"Live Mode"** करें।
3. **Settings** ➔ **API Keys** पर जाएं ➔ **"Generate Live Key"** पर क्लिक करें।
4. आपको दो चाबियां मिलेंगी:
   - `Key ID` (शुरुआत `rzp_live_...` से होगी)
   - `Key Secret` (इसे सुरक्षित कॉपी कर लें)

### 5.2 Webhook सेट करें (ऑटो पेमेंट वेरिफिकेशन के लिए)
1. Razorpay Dashboard में **Settings** ➔ **Webhooks** ➔ **Add New Webhook** पर क्लिक करें।
2. **Webhook URL** में यह दर्ज करें:
   ```text
   https://maaayurvedic.in/api/razorpay/webhook
   ```
3. **Secret**: एक सुरक्षित स्ट्रिंग बनाएं (जैसे `maa_live_webhook_secret_2026`) और इसे नोट कर लें।
4. **Active Events** में ये इवेंट्स चेक करें:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
5. **Save** पर क्लिक करें।

---

## चरण 6: Vercel Environment Variables की अंतिम चेकलिस्ट

Vercel डैशबोर्ड में **Settings** ➔ **Environment Variables** में जाएं और निम्नलिखित सभी वैरिएबल जोड़ें (Production, Preview, और Development तीनों टिक करें):

| Variable Name | Description / Example Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mbwnmzjiqpanovkvbxks.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase Project Settings ➔ API ➔ anon public key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Supabase Project Settings ➔ API ➔ service_role secret)* |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxxxx` *(Razorpay Live Key ID)* |
| `RAZORPAY_KEY_SECRET` | `xxxxxxxxxxxxxxxxxxxx` *(Razorpay Live Secret)* |
| `RAZORPAY_WEBHOOK_SECRET` | *(वही सीक्रेट जो चरण 5.2 में Webhook बनाते समय रखा था)* |
| `NEXT_PUBLIC_SITE_URL` | `https://maaayurvedic.in` *(आपका लाइव डोमेन)* |

---

## त्वरित समस्या निवारण (Troubleshooting)

1. **Google Login Error: `redirect_uri_mismatch`**
   - सुनिश्चित करें कि Google Console में `https://mbwnmzjiqpanovkvbxks.supabase.co/auth/v1/callback` दर्ज है।
   - Supabase में Redirect URLs में `https://maaayurvedic.in/api/auth/callback` जोड़ा हुआ है।
2. **Payment Failure: "Bad Request / Unauthorized"**
   - Vercel में `NEXT_PUBLIC_RAZORPAY_KEY_ID` और `RAZORPAY_KEY_SECRET` सही लाइव चाबियों से मैच होने चाहिए।
3. **Admin Dashboard नहीं दिख रहा**
   - Supabase SQL Editor में यह सुनिश्चित करें:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'shivhares747@gmail.com';
     ```
   - Google से `shivhares747@gmail.com` से लॉगिन करें।
