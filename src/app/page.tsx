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
} from "lucide-react";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: MAIN_PRODUCT.name,
    image: `https://maaayurvedic.in${MAIN_PRODUCT.images[0]}`,
    description: MAIN_PRODUCT.description,
    brand: {
      "@type": "Brand",
      name: BRAND_INFO.name,
    },
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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f4fbf7] via-white to-[#faf8f5] pt-4 sm:pt-8 pb-10 lg:pt-14 lg:pb-20 border-b border-[#e9e3d8]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#f4fbf7] text-[#0b3d2e] border border-emerald-900/15 text-[11px] sm:text-sm font-semibold px-3.5 py-1 rounded-full shadow-2xs">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                  <span>100% शुद्ध आयुर्वेदिक फॉर्मूला • 0% स्टेरॉयड • सुरक्षित हीलिंग</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.25]">
                दाद, खाज, खुजली और सोरायसिस में{" "}
                <span className="text-[#0b3d2e] block sm:inline font-black">
                  प्रामाणिक आयुर्वेदिक राहत
                </span>
              </h1>

              {/* MOBILE ONLY: Product Photo In First Frame */}
              <div className="lg:hidden my-1">
                <HeroProductGallery />
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-black text-gray-900">
                    ₹{MAIN_PRODUCT.pricePaise / 100}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    ₹{MAIN_PRODUCT.mrpPaise / 100}
                  </span>
                  <span className="text-xs font-bold text-[#0b3d2e] bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    29% छूट
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href="#offers"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-sm sm:text-base px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>अभी खरीदें (Buy Now)</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <Link
                    href="/product"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-[#0b3d2e] bg-white hover:bg-gray-50 border border-emerald-300 px-4 py-3 rounded-2xl transition-colors shadow-2xs"
                  >
                    घटक व विवरण
                  </Link>
                </div>
              </div>

              {/* Social Proof & Rating Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-0.5">
                <div className="flex items-center gap-1.5 bg-[#fbf5e8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl border border-amber-300/60 shadow-2xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900 ml-1">4.9 / 5</span>
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  (1,480+ संतुष्ट भारतीय ग्राहकों का सच्चा भरोसा)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                नीम, हल्दी, करंज बीज, शुद्ध गंधक और भीमसेनी कपूर का सिद्ध पारंपरिक संगम। जिद्दी से जिद्दी पुरानी खुजली, रिंगवर्म और त्वचा की जलन को शांत करने के लिए प्रामाणिक हर्बल मलहम।
              </p>

              {/* 3 Trust Markers */}
              <div className="pt-3 sm:pt-4 border-t border-gray-200/80 grid grid-cols-3 gap-2 sm:gap-3 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs text-gray-700">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
                  <span className="font-semibold">मुफ्त होम डिलीवरी</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs text-gray-700">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
                  <span className="font-semibold">100% मनी-बैक</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
                  <span className="font-semibold">कैश ऑन डिलीवरी</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Desktop Product Gallery (hidden on mobile, visible on lg) */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <HeroProductGallery />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT BENEFITS (4 KEY PILLARS - UNIFIED HIGH-END DESIGN) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#f4fbf7] text-[#0b3d2e] border border-emerald-900/15 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>आयुर्वेदिक चिकित्सा सिद्धांत</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              माँ आयुर्वेदिक क्रीम क्यों है सबसे अलग और असरदार?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              यह केवल सतह की खुजली को दबाती नहीं, बल्कि आयुर्वेद के कण्डूघ्न (Anti-itching) और रोपण (Healing) सिद्धांतों पर कार्य करती है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e9e3d8] hover:border-[#0b3d2e]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0b3d2e] text-white flex items-center justify-center mb-4 shadow-xs">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% शुद्ध जड़ी-बूटियाँ</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                नीम, हल्दी, करंज बीज और भीमसेनी कपूर का शुद्ध अर्क जो प्राकृतिक रूप से त्वचा के संक्रमण को नियंत्रित करता है।
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e9e3d8] hover:border-[#0b3d2e]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0b3d2e] text-white flex items-center justify-center mb-4 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">स्टेरॉयड मुक्त (Zero Steroids)</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                कोई नुकसानदायक केमिकल नहीं जिससे त्वचा पतली हो या आदत पड़े। सुरक्षित व भरोसेमंद प्राकृतिक चिकित्सा।
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e9e3d8] hover:border-[#0b3d2e]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0b3d2e] text-white flex items-center justify-center mb-4 shadow-xs">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">तुरंत शीतलता व खुजली राहत</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                भीमसेनी कपूर और तिल का तेल लगाते ही जलन, लालिमा और असहनीय खुजली को तुरंत शांत करते हैं।
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e9e3d8] hover:border-[#0b3d2e]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0b3d2e] text-white flex items-center justify-center mb-4 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">दाग-धब्बे व दरारें भरना</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                त्वचा के सूखे पैच, दरारें और दाद के बाद बचे काले निशानों को मिटाकर त्वचा का प्राकृतिक रंग लौटाती है।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INGREDIENTS SPOTLIGHT (APOTHECARY STYLE) */}
      <section className="py-16 sm:py-20 bg-[#faf8f5] border-t border-[#e9e3d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#0b3d2e] bg-emerald-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
              शुद्ध आयुर्वेदिक घटक (Active Herbal Ingredients)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              पारंपरिक भारतीय जड़ी-बूटियों की अद्वितीय शक्ति
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              शास्त्रीय आयुर्वेदिक ग्रंथों में वर्णित चर्मरोगनाशक दुर्लभ वनस्पतियों का सिद्ध योग
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {MAIN_PRODUCT.ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-xs border border-[#e9e3d8] hover:border-[#0b3d2e]/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#0b3d2e] bg-[#f4fbf7] px-2.5 py-1 rounded-md border border-emerald-900/10">
                      मात्रा: {ing.percentage}
                    </span>
                    <Leaf className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">{ing.hindiName}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
                    {ing.purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety strip: Zero Harsh Chemicals */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e9e3d8] flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-gray-800 text-center">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>0% स्टेरॉयड (Zero Cortisone)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>0% हानिकारक पैराबेन</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>0% मिनरल ऑयल व केमिकल</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>100% शाकाहारी व हर्बल</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PURCHASE / COMBO SELECTOR & PINCODE CHECKER */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Product Images & Pincode */}
            <div className="lg:col-span-5 space-y-6">
              <HeroProductGallery />

              {/* Delivery / Pincode checker */}
              <PincodeChecker />

              {/* Guarantee banner */}
              <div className="p-4 rounded-2xl bg-[#fbf5e8] border border-amber-300/70 flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 space-y-1">
                  <p className="font-bold">100% संतोष अथवा धन वापसी गारंटी</p>
                  <p>
                    30 दिनों तक दिए गए परहेज के साथ उपयोग करें। संतुष्ट न होने पर पूरा रिफंड पाएं।
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Combo & Offer Selector */}
            <div className="lg:col-span-7">
              <ComboSelector />
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIETARY PRECAUTIONS / परहेज गाइड (WITH LEAFLET INSPECTION) */}
      <DietaryPrecautions />

      {/* 6. HOW TO USE (उपयोग विधि) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#0b3d2e] bg-emerald-100/80 px-3 py-1 rounded-full uppercase">
              उपयोग विधि (Directions For Use)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              माँ आयुर्वेदिक क्रीम लगाने का सही तरीका
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              बेहतर और त्वरित परिणाम के लिए इन आसान 4 चरणों का नियमित पालन करें:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MAIN_PRODUCT.directions.map((dir, idx) => (
              <div
                key={idx}
                className="bg-[#faf8f5] rounded-2xl p-6 border border-[#e9e3d8] relative hover:border-[#0b3d2e]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0b3d2e] text-white font-bold flex items-center justify-center text-sm mb-4 shadow-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-gray-900 text-base mb-2">चरण {idx + 1}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{dir}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/60 text-[11px] text-emerald-800 font-semibold">
                  दिन में 2 बार अनिवार्य
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EDUCATIONAL SECTION (दाद, खाज, खुजली, सोरायसिस) */}
      <EducationalSection />

      {/* 8. INSTAGRAM STORY STYLE BEFORE-AFTER CUSTOMER STORIES (MANAGEABLE FROM ADMIN) */}
      <StoryTestimonials />

      {/* 9. 100% MONEY BACK GUARANTEE */}
      <MoneyBackGuarantee />

      {/* 10. FREQUENTLY ASKED QUESTIONS (INTERACTIVE FAQS) */}
      <InteractiveFaqs />
    </>
  );
}
