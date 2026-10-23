import React from "react";
import { BRAND_INFO } from "@/lib/data/mockData";

export const metadata = {
  title: "नियम एवं शर्तें (Terms & Conditions) — माँ आयुर्वेदिक क्रीम",
  description: "वेबसाइट उपयोग, ऑर्डर नियम, बौद्धिक संपदा एवं वैधानिक शर्तें।",
};

export default function TermsPage() {
  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              कानूनी समझौता
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              नियम एवं शर्तें (Terms & Conditions)
            </h1>
            <p className="text-xs text-gray-500 mt-1">अंतिम अद्यतन: अक्टूबर 2026</p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900">1. सामान्य शर्तें</h3>
            <p>
              इस वेबसाइट का उपयोग करके या ऑर्डर देकर आप इन नियमों व शर्तों से पूर्णतः सहमत होते हैं। {BRAND_INFO.name} बिना पूर्व सूचना के इन नियमों में संशोधन करने का अधिकार सुरक्षित रखता है।
            </p>

            <h3 className="text-base font-bold text-gray-900">2. उत्पाद की प्रकृति एवं चिकित्सीय परामर्श</h3>
            <p>
              माँ आयुर्वेदिक क्रीम एक आयुर्वेदिक प्रोप्रायटरी मलहम है जो त्वचा के रूखेपन, खुजली और लक्षणों को शांत करने में सहायक है। यह किसी गंभीर प्रणालीगत बीमारी के एलोपैथिक इलाज का विकल्प नहीं है। गंभीर स्थिति में योग्य चिकित्सक से परामर्श आवश्यक है।
            </p>

            <h3 className="text-base font-bold text-gray-900">3. मूल्य निर्धारण एवं भुगतान</h3>
            <p>
              सभी मूल्य भारतीय रुपये (₹) में दर्शाए गए हैं और लागू जीएसटी एवं करों सहित हैं। मूल्य निर्धारण में किसी भी तकनीकी त्रुटि की स्थिति में ऑर्डर को रद्द करने या ग्राहक से संपर्क करने का अधिकार सुरक्षित है।
            </p>

            <h3 className="text-base font-bold text-gray-900">4. क्षेत्राधिकार</h3>
            <p>
              किसी भी विवाद या कानूनी दावे की स्थिति में केवल जयपुर, राजस्थान स्थित न्यायालयों का ही क्षेत्राधिकार मान्य होगा।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
