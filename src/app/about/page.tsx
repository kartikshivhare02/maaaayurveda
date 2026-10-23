import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND_INFO, MAIN_PRODUCT } from "@/lib/data/mockData";
import { ShieldCheck, Leaf, Award, Heart, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "हमारे बारे में — माँ आयुर्वेदिक क्रीम का सफर एवं दर्शन",
  description: "माँ आयुर्वेदिक क्रीम: प्रामाणिक भारतीय आयुर्वेद, शुद्ध जड़ी-बूटियाँ और त्वचा कल्याण के प्रति हमारी प्रतिबद्धता।",
};

export default function AboutPage() {
  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-600 shadow-md mx-auto mb-4">
            <Image
              src={BRAND_INFO.logoUrl}
              alt={BRAND_INFO.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
            {BRAND_INFO.tagline}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
            हमारे बारे में (About Maa Ayurvedic)
          </h1>
          <p className="text-base text-gray-600 mt-3 leading-relaxed">
            प्राचीन भारतीय जड़ी-बूटियों की पारंपरिक शक्ति और प्राकृतिक त्वचा देखभाल का एक प्रामाणिक संगम।
          </p>
        </div>

        {/* Brand Mission & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              हमारा ध्येय: बिना स्टेरॉयड के प्राकृतिक त्वचा राहत
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              आज के समय में त्वचा की समस्याओं जैसे दाद (Ringworm), पुरानी खुजली, दरार और सोरायसिस के लिए अधिकांश लोग तेज केमिकल और स्टेरॉयड युक्त मलम का उपयोग करते हैं, जो समस्या को जड़ से मिटाने के बजाय दबा देते हैं। 
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              <strong>माँ आयुर्वेदिक क्रीम</strong> का जन्म इसी समस्या के स्थाई और सुरक्षित समाधान की खोज से हुआ। हमने आयुर्वेद के प्राचीन शास्त्रों में वर्णित नीम, हल्दी, करंज, शुद्ध गंधक और भीमसेनी कपूर के संतुलन को अपनाया, जो त्वचा के प्राकृतिक स्वास्थ्य को नुकसान पहुंचाए बिना संक्रमण और जलन को नियंत्रित करता है।
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/#offers"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-xs transition-colors"
              >
                <span>उत्पाद कॉम्बो देखें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-white">
            <Image
              src={MAIN_PRODUCT.images[0]}
              alt="माँ आयुर्वेदिक क्रीम जार"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">100% शुद्धता</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              केवल पारंपरिक आयुर्वेदिक जड़ी-बूटियों का इस्तेमाल। कोई हानिकारक सिंथेटिक स्टेरॉयड या केमिकल नहीं।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">ईमानदारी व पारदर्शिता</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              झूठे दावों से दूर। हम स्पष्ट बताते हैं कि क्रीम के साथ खट्टी चीजों का परहेज कितना अनिवार्य है।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">100% संतुष्टि गारंटी</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              30 दिन की खुली पारदर्शी मनी-बैक गारंटी ताकि ग्राहक बिना किसी वित्तीय जोखिम के शुरुआत कर सके।
            </p>
          </div>
        </div>

        {/* Verified Business Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs text-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            वैधानिक निर्माण एवं विपणन प्रकटीकरण (Business & License Details)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-gray-700">
            <div>
              <p className="font-bold text-gray-900 text-base mb-1">
                {MAIN_PRODUCT.manufacturer.name}
              </p>
              <p className="text-gray-600">पता: {MAIN_PRODUCT.manufacturer.address}</p>
              <p className="pt-2 font-medium">
                आयुष लाइसेंस सं.:{" "}
                <span className="font-mono font-bold text-emerald-800">
                  {MAIN_PRODUCT.manufacturer.licenseNo}
                </span>
              </p>
            </div>

            <div>
              <p className="font-bold text-gray-900 text-base mb-1">
                {MAIN_PRODUCT.marketer.name}
              </p>
              <p className="text-gray-600">पता: {MAIN_PRODUCT.marketer.address}</p>
              <p className="pt-2">हेल्पलाइन: {MAIN_PRODUCT.marketer.customerCarePhone}</p>
              <p>ईमेल: {MAIN_PRODUCT.marketer.customerCareEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
