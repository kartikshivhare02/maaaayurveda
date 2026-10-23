import React from "react";
import Link from "next/link";
import { BRAND_INFO } from "@/lib/data/mockData";
import { ShieldCheck, RotateCcw, Clock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "रिटर्न एवं रिफंड नीति — माँ आयुर्वेदिक क्रीम",
  description: "पारदर्शी रिटर्न, प्रतिस्थापन एवं 100% मनी-बैक गारंटी नियम।",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              वैधानिक नीति
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              रिटर्न, प्रतिस्थापन एवं रिफंड पॉलिसी (Return & Refund Policy)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              अंतिम अद्यतन: अक्टूबर 2026 | उपभोक्ता संरक्षण अधिनियम, 2019 के अंतर्गत
            </p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900">1. 100% मनी-बैक गारंटी नीति</h3>
            <p>
              {BRAND_INFO.name} अपने ग्राहकों को पारदर्शी और प्रामाणिक सेवा प्रदान करने के लिए प्रतिबद्ध है। यदि आप उत्पाद का उपयोग दिए गए निर्देशों और सख्त परहेज (खट्टी चीजों का त्याग) के साथ कम से कम 30 दिनों तक करते हैं और संतुष्ट नहीं होते हैं, तो आप डिलीवरी की तिथि से 30 दिनों के भीतर रिफंड का दावा प्रस्तुत कर सकते हैं।
            </p>

            <h3 className="text-base font-bold text-gray-900">2. क्षतिग्रस्त अथवा गलत उत्पाद का प्रतिस्थापन (Replacement)</h3>
            <p>
              यदि आपको पार्सल क्षतिग्रस्त (damaged), सील टूटी हुई या गलत उत्पाद की स्थिति में प्राप्त होता है, तो डिलीवरी के 48 घंटे के भीतर पार्सल की फोटो/वीडियो के साथ हमारी कस्टमर केयर हेल्पलाइन (+91 98765 43210 या {BRAND_INFO.supportEmail}) पर सूचित करें। बिना किसी अतिरिक्त शुल्क के नया सील-पैक डिब्बा तुरंत भेजा जाएगा।
            </p>

            <h3 className="text-base font-bold text-gray-900">3. रिफंड प्रक्रिया एवं समय-सीमा</h3>
            <p>
              रिफंड दावा स्वीकृत होने के उपरांत, देय राशि 5 से 7 कार्य दिवसों (Business Days) के भीतर ग्राहक के उसी मूल बैंक खाते/UPI में सीधे स्थानांतरित कर दी जाएगी जिससे भुगतान किया गया था। कैश ऑन डिलीवरी (COD) ऑर्डर्स के लिए ग्राहक को अपना वैध UPI ID या बैंक खाता विवरण प्रदान करना होगा।
            </p>

            <h3 className="text-base font-bold text-gray-900">4. रिफंड दावा कैसे प्रस्तुत करें?</h3>
            <p>
              आप हमारी वेबसाइट पर उपलब्ध ऑनलाइन दावा पोर्टल{" "}
              <Link href="/refund-guarantee" className="text-emerald-700 font-bold underline">
                100% मनी-बैक दावा फॉर्म
              </Link>{" "}
              के माध्यम से अपनी ऑर्डर संख्या और फोन नंबर दर्ज करके आसानी से अनुरोध दर्ज कर सकते हैं।
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            सहायता के लिए संपर्क: {BRAND_INFO.supportEmail} | {BRAND_INFO.whatsappDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}
