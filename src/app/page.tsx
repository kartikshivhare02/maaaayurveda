import React from "react";
import Link from "next/link";
import { BRAND_INFO, MAIN_PRODUCT } from "@/lib/data/mockData";
import { ComboSelector } from "@/components/ComboSelector";
import { PincodeChecker } from "@/components/PincodeChecker";
import { DietaryPrecautions } from "@/components/DietaryPrecautions";
import { EducationalSection } from "@/components/EducationalSection";
import { MoneyBackGuarantee } from "@/components/MoneyBackGuarantee";
import { HeroProductGallery } from "@/components/HeroProductGallery";
import { InteractiveFaqs } from "@/components/InteractiveFaqs";
import { StoryTestimonials } from "@/components/StoryTestimonials";
import { HeroPriceDisplay } from "@/components/HeroPriceDisplay";
import {
  ShieldCheck,
  Star,
  Sparkles,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Shield,
  Truck,
  Droplets,
  Check,
  Award,
  Clock,
  Users,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: MAIN_PRODUCT.name,
    image: `https://maaayurvedic.in${MAIN_PRODUCT.images[0]}`,
    description: MAIN_PRODUCT.description,
    brand: { "@type": "Brand", name: BRAND_INFO.name },
    offers: {
      "@type": "Offer",
      url: "https://maaayurvedic.in",
      priceCurrency: "INR",
      price: (MAIN_PRODUCT.pricePaise / 100).toString(),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1480",
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden gradient-hero pt-6 sm:pt-10 lg:pt-16 pb-12 lg:pb-24">
        {/* Background decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-emerald-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] bg-amber-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

            {/* ── Left Content ─────────────────────── */}
            <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 text-center lg:text-left">

              {/* Trust Badge */}
              <div className="flex justify-center lg:justify-start">
                <span className="badge-ayur">
                  <Leaf className="w-3.5 h-3.5 text-forest-700" />
                  100% शुद्ध आयुर्वेदिक • 0% स्टेरॉयड • आयुष प्रमाणित
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-black text-stone-900 tracking-tight leading-[1.2]">
                दाद, खाज, खुजली और{" "}
                <span className="relative">
                  <span className="shimmer-gold">सोरायसिस</span>
                </span>
                {" "}से{" "}
                <span className="text-forest-900">प्रामाणिक आयुर्वेदिक राहत</span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                बाकुची तेल, वैसलीन सल्फर, कत्था, शुद्ध गंधक और नीला थोथा का शास्त्रीय संगम। जिद्दी पुरानी खुजली और रिंगवर्म को जड़ से शांत करता है।
              </p>

              {/* Mobile: Product Gallery */}
              <div className="lg:hidden my-2">
                <HeroProductGallery />
              </div>

              {/* Rating + Social Proof */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-black text-stone-900">4.9</span>
                  <span className="text-[11px] text-stone-500 font-medium">/ 5</span>
                </div>
                <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2.5 py-1 rounded-lg">
                  1,480+ संतुष्ट ग्राहक
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  सत्यापित समीक्षाएं
                </span>
              </div>

              {/* Price + CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4">
                <HeroPriceDisplay />
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href="#offers"
                    id="hero-buy-now-btn"
                    className="btn-primary flex-1 sm:flex-none text-sm sm:text-base px-5 py-3.5"
                  >
                    <Zap className="w-4 h-4 fill-white text-white" />
                    अभी खरीदें
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/product"
                    id="hero-details-btn"
                    className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm px-4 py-3.5"
                  >
                    घटक व विवरण
                  </Link>
                </div>
              </div>

              {/* 3 Trust Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-stone-200/70">
                {[
                  { icon: Truck, text: "मुफ्त\nडिलीवरी" },
                  { icon: ShieldCheck, text: "100%\nमनी-बैक" },
                  { icon: CheckCircle2, text: "कैश ऑन\nडिलीवरी" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex flex-col items-center lg:items-start gap-1.5 text-center lg:text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200/60 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-forest-700" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-stone-700 whitespace-pre-line leading-tight">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Desktop Gallery ────────────── */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              {/* Floating glow ring */}
              <div className="absolute inset-4 bg-forest-200/30 rounded-full blur-2xl" />
              <div className="relative w-full">
                <HeroProductGallery />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="section-divider mt-10 sm:mt-16 mx-4 sm:mx-8" />
      </section>

      {/* ═══════════════════════════════════════════════
          2. QUICK TRUST BAR (Stats)
      ═══════════════════════════════════════════════ */}
      <section className="section-white py-6 sm:py-8 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-stone-200">
            {[
              { icon: Users, value: "1,480+", label: "संतुष्ट ग्राहक", color: "text-forest-700" },
              { icon: Star, value: "4.9/5", label: "औसत रेटिंग", color: "text-amber-600" },
              { icon: Award, value: "आयुष", label: "प्रमाणित निर्माण", color: "text-forest-700" },
              { icon: Clock, value: "30 दिन", label: "मनी-बैक गारंटी", color: "text-amber-600" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div
                key={value}
                className="flex items-center justify-center sm:justify-center gap-3 px-4 py-3 sm:py-0"
              >
                <div className={`w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div>
                  <div className={`text-lg font-black ${color}`}>{value}</div>
                  <div className="text-xs text-stone-500 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. STORY TESTIMONIALS (Before/After)
      ═══════════════════════════════════════════════ */}
      <StoryTestimonials />

      {/* ═══════════════════════════════════════════════
          4. PRODUCT BENEFITS (4 Pillars)
      ═══════════════════════════════════════════════ */}
      <section className="section-cream py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="section-label">
              <Sparkles className="w-3.5 h-3.5" />
              आयुर्वेदिक चिकित्सा सिद्धांत
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
              माँ आयुर्वेदिक क्रीम क्यों है{" "}
              <span className="text-forest-800">सबसे अलग?</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-500 leading-relaxed">
              यह केवल सतह की खुजली नहीं दबाती — आयुर्वेद के कण्डूघ्न और रोपण सिद्धांतों पर काम करती है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Leaf,
                title: "100% शुद्ध जड़ी-बूटियाँ",
                desc: "बाकुची (15%), वैसलीन सल्फर (12%), कत्था व शुद्ध गंधक का सक्रिय फॉर्मूला फंगल संक्रमण नियंत्रित करता है।",
                accent: "forest",
              },
              {
                icon: ShieldCheck,
                title: "0% स्टेरॉयड",
                desc: "कोई हानिकारक केमिकल नहीं जिससे त्वचा पतली हो या निर्भरता बने। पूर्णतः सुरक्षित व प्राकृतिक।",
                accent: "forest",
              },
              {
                icon: Droplets,
                title: "तुरंत खुजली राहत",
                desc: "गंध पुष्पा और वैसलीन सल्फर लगाते ही जलन, लालिमा और असहनीय खुजली को शांत करते हैं।",
                accent: "amber",
              },
              {
                icon: Sparkles,
                title: "दाग-धब्बे भरता है",
                desc: "दाद के बाद बचे काले निशान और दरारों को मिटाकर प्राकृतिक त्वचा रंग वापस लाता है।",
                accent: "amber",
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className="group bg-white rounded-2xl p-6 border-1.5 border-stone-200 hover:border-forest-300 hover:shadow-lg hover:shadow-forest-50 transition-all duration-300 flex flex-col gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    accent === "forest"
                      ? "bg-forest-900 text-white"
                      : "bg-gradient-gold text-white"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 mb-2 leading-tight">{title}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. INGREDIENTS SPOTLIGHT
      ═══════════════════════════════════════════════ */}
      <section className="section-white py-16 sm:py-20 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="section-label">
              <Leaf className="w-3.5 h-3.5" />
              शुद्ध आयुर्वेदिक घटक
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
              पारंपरिक जड़ी-बूटियों की{" "}
              <span className="text-forest-800">अद्वितीय शक्ति</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              शास्त्रीय आयुर्वेदिक ग्रंथों में वर्णित चर्मरोगनाशक दुर्लभ वनस्पतियों का सिद्ध योग
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {MAIN_PRODUCT.ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-card flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-forest-800 bg-forest-50 border border-forest-200/70 px-2.5 py-1 rounded-lg">
                    <Leaf className="w-3 h-3 text-forest-600" />
                    मात्रा: {ing.percentage}
                  </span>
                  <span className="text-2xl">🌿</span>
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-base sm:text-lg leading-tight">{ing.hindiName}</h4>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">{ing.purpose}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Strip */}
          <div className="bg-forest-50 border border-forest-200/60 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-around gap-3 sm:gap-4">
            {[
              "0% स्टेरॉयड (Zero Cortisone)",
              "0% हानिकारक पैराबेन",
              "0% मिनरल ऑयल",
              "100% शाकाहारी व हर्बल",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs font-bold text-forest-900">
                <div className="w-5 h-5 rounded-full bg-forest-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. PURCHASE / COMBO SELECTOR
      ═══════════════════════════════════════════════ */}
      <section id="offers" className="section-cream py-16 sm:py-20 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="badge-gold">
              <Sparkles className="w-3 h-3 text-amber-600" />
              विशेष कॉम्बो छूट
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
              अपना पैक चुनें और{" "}
              <span className="text-amber-600">बचत करें</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Image + Pincode + Guarantee */}
            <div className="lg:col-span-5 space-y-5">
              <HeroProductGallery />
              <PincodeChecker />

              {/* Guarantee Banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-amber-700" />
                </div>
                <div className="text-xs text-amber-900 space-y-0.5">
                  <p className="font-black text-sm">100% संतोष अथवा धन वापसी</p>
                  <p className="text-amber-700 leading-relaxed">
                    30 दिनों तक परहेज के साथ उपयोग करें। संतुष्ट न होने पर पूरा रिफंड।
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Combo Selector */}
            <div className="lg:col-span-7">
              <ComboSelector />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. DIETARY PRECAUTIONS
      ═══════════════════════════════════════════════ */}
      <DietaryPrecautions />

      {/* ═══════════════════════════════════════════════
          8. HOW TO USE (उपयोग विधि)
      ═══════════════════════════════════════════════ */}
      <section className="section-white py-16 sm:py-20 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="section-label">उपयोग विधि</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
              सही तरीके से लगाने पर{" "}
              <span className="text-forest-800">तेज़ असर</span>
            </h2>
            <p className="text-sm text-stone-500">
              बेहतर परिणाम के लिए इन 4 सरल चरणों का नियमित पालन करें
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MAIN_PRODUCT.directions.map((dir, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-6 border-1.5 border-stone-200 hover:border-forest-300 hover:shadow-md transition-all duration-300 flex flex-col gap-4"
              >
                {/* Connector line on desktop */}
                {idx < MAIN_PRODUCT.directions.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-forest-200 to-forest-100 z-10" />
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-900 to-forest-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-forest-900/20 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                    चरण {idx + 1}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{dir}</p>

                <div className="mt-auto pt-3 border-t border-stone-100 text-[11px] text-forest-700 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  दिन में 2 बार
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. EDUCATIONAL SECTION
      ═══════════════════════════════════════════════ */}
      <EducationalSection />

      {/* ═══════════════════════════════════════════════
          10. MONEY BACK GUARANTEE
      ═══════════════════════════════════════════════ */}
      <MoneyBackGuarantee />

      {/* ═══════════════════════════════════════════════
          11. FAQs
      ═══════════════════════════════════════════════ */}
      <InteractiveFaqs />

      {/* ═══════════════════════════════════════════════
          12. FINAL CTA SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 relative overflow-hidden gradient-forest text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            <Leaf className="w-3.5 h-3.5" />
            माँ का ख्याल, प्रकृति का कमाल
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            आज ही राहत की शुरुआत करें
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-xl mx-auto">
            30 दिन की 100% मनी-बैक गारंटी। मुफ्त डिलीवरी। कोई जोखिम नहीं।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#offers"
              id="final-cta-btn"
              className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
            >
              <Zap className="w-5 h-5 fill-white text-white" />
              अभी खरीदें — मुफ्त डिलीवरी
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम के बारे में जानकारी चाहिए।"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-4 rounded-2xl text-sm transition-all w-full sm:w-auto"
            >
              WhatsApp पर पूछें
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
