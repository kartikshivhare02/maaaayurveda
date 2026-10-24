# माँ आयुर्वेदिक (Maa Ayurvedic) — Production Deployment & Domain Setup Guide

यह संपूर्ण गाइड आपके डोमेन **`https://www.maaayurvedic.store`** के लिए **Vercel**, **Supabase**, **Google OAuth**, और **Razorpay Live** को लाइव सेटअप करने की विस्तृत चेकलिस्ट प्रदान करती है।

---

## विषय सूची (Table of Contents)
1. [चरण 1: Vercel पर कस्टम डोमेन जोड़ना](#चरण-1-vercel-पर-कस्टम-डोमेन-जोड़ना)
2. [चरण 2: DNS सेटिंग्स (GoDaddy / Hostinger / Namecheap)](#चरण-2-dns-सेटिंग्स-godaddy--hostinger--namecheap)
3. [चरण 3: Supabase Authentication व Redirect URLs सेटिंग्स](#चरण-3-supabase-authentication-व-redirect-urls-सेटिंग्स)
4. [चरण 4: Google Cloud Console OAuth 2.0 कॉन्फ़िगरेशन](#चरण-4-google-cloud-console-oauth-20-कॉन्फ़िगरेशन)
5. [चरण 5: Razorpay Live पेमेंट गेटवे व Webhook सेटिंग्स](#चरण-5-razorpay-live-पेमेंट-गेटवे-व-webhook-सेटिंग्स)
6. [चरण 6: Vercel Environment Variables की अंतिम तालिका](#चरण-6-vercel-environment-variables-की-अंतिम-तालिका)

---

## चरण 1: Vercel पर कस्टम डोमेन जोड़ना

1. [Vercel.com](https://vercel.com/) पर जाएं और अपना प्रोजेक्ट खोलें।
2. **Settings** ➔ **Domains** पर क्लिक करें।
3. बॉक्स में **`www.maaayurvedic.store`** दर्ज करें और **Add** पर क्लिक करें।
4. Vercel स्वतः दो डोमेन जोड़ने का सुझाव देगा:
   - `maaayurvedic.store`
   - `www.maaayurvedic.store`
5. दोनों जोड़ें और प्राथमिक (Primary Domain) **`https://www.maaayurvedic.store`** को रखें।

---

## चरण 2: DNS सेटिंग्स (GoDaddy / Hostinger / Namecheap)

जहाँ से आपने डोमेन खरीदा है, उसके **DNS Management (DNS Records)** पैनल में जाएं और ये 2 रिकॉर्ड जोड़ें:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (या खाली छोड़ें) | `76.76.21.21` | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 3600 |

> **नोट**: DNS सक्रिय होने में 5 से 15 मिनट का समय लग सकता है। इसके बाद Vercel स्वतः मुफ्त SSL (HTTPS) चालू कर देगा।

---

## चरण 3: Supabase Authentication व Redirect URLs सेटिंग्स

आपका Supabase Project URL: `https://mbwnmzjiqpanovkvbxks.supabase.co`

### 3.1 Site URL और Redirect URLs जोड़ें:
1. [Supabase Dashboard ➔ URL Configuration](https://supabase.com/dashboard/project/mbwnmzjiqpanovkvbxks/auth/url-configuration) पर जाएं।
2. **Site URL** में यह दर्ज करें:
   ```text
   https://www.maaayurvedic.store
   ```
3. **Redirect URLs** बॉक्स में एक-एक करके निम्न सभी URLs जोड़ें (**Add URL** पर क्लिक करें):
   ```text
   https://www.maaayurvedic.store/api/auth/callback
   https://www.maaayurvedic.store/**
   https://maaayurvedic.store/api/auth/callback
   https://maaayurvedic.store/**
   ```
4. सबसे नीचे **Save** बटन पर क्लिक करें।

---

## चरण 4: Google Cloud Console OAuth 2.0 कॉन्फ़िगरेशन

Google लॉगिन को लाइव डोमेन पर चालू करने के लिए:

1. [Google Cloud Console (Credentials)](https://console.cloud.google.com/apis/credentials) पर जाएं।
2. अपना प्रोजेक्ट चुनें।
3. **OAuth 2.0 Client IDs** के तहत अपने वेब क्लाइंट पर क्लिक करें।

### 4.1 Authorized JavaScript Origins
नीचे **"ADD URI"** पर क्लिक करके ये 3 URLs जोड़ें:
```text
https://www.maaayurvedic.store
https://maaayurvedic.store
https://mbwnmzjiqpanovkvbxks.supabase.co
```

### 4.2 Authorized Redirect URIs
नीचे **"ADD URI"** पर क्लिक करके केवल यह आवश्यक Supabase Callback URL दर्ज करें:
```text
https://mbwnmzjiqpanovkvbxks.supabase.co/auth/v1/callback
```

5. सबसे नीचे **Save** बटन पर क्लिक करें।
6. प्राप्त **Client ID** और **Client Secret** को Supabase डैशबोर्ड में:
   - **Authentication** ➔ **Providers** ➔ **Google** में पेस्ट करें।
   - **Save** पर क्लिक करें।

---

## चरण 5: Razorpay Live पेमेंट गेटवे व Webhook सेटिंग्स

### 5.1 Live Mode की चाबियां प्राप्त करें
1. [Razorpay Dashboard](https://dashboard.razorpay.com/) में जाएं और ऊपर टॉगल को **"Live Mode"** पर करें।
2. **Settings** ➔ **API Keys** ➔ **Generate Live Key** पर क्लिक करें।
3. `Key ID` (जैसे `rzp_live_...`) और `Key Secret` को कॉपी करें।

### 5.2 Live Webhook जोड़ें
1. **Settings** ➔ **Webhooks** ➔ **Add New Webhook** पर क्लिक करें।
2. **Webhook URL** में यह लाइव URL दर्ज करें:
   ```text
   https://www.maaayurvedic.store/api/razorpay/webhook
   ```
3. **Secret**: एक सुरक्षित स्ट्रिंग डालें (जैसे `maa_live_webhook_secret_2026`) और इसे नोट कर लें।
4. **Active Events**:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
5. **Save** पर क्लिक करें।

---

## चरण 6: Vercel Environment Variables की अंतिम तालिका

Vercel डैशबोर्ड में **Settings** ➔ **Environment Variables** में जाएं और निम्नलिखित 7 वैरिएबल्स जोड़ें:

| Variable Name | Exact Value For Your Domain |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mbwnmzjiqpanovkvbxks.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase Project Settings ➔ API ➔ anon public key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Supabase Project Settings ➔ API ➔ service_role secret)* |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxxxx` *(Razorpay Live Key ID)* |
| `RAZORPAY_KEY_SECRET` | `xxxxxxxxxxxxxxxxxxxx` *(Razorpay Live Secret)* |
| `RAZORPAY_WEBHOOK_SECRET` | *(वही सीक्रेट जो चरण 5.2 में Webhook में डाला)* |
| `NEXT_PUBLIC_SITE_URL` | `https://www.maaayurvedic.store` |
