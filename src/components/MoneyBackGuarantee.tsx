import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Clock, RotateCcw, ArrowRight } from "lucide-react";

export const MoneyBackGuarantee: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-emerald-100 max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Shield Icon Badge */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-emerald-100/70 border-4 border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-700" />
              <div className="absolute -bottom-2 bg-amber-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase shadow-xs">
                100% गारंटी
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 text-center lg:text-left flex-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                आपकी खरीदारी का भरोसा
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                स्पष्ट और पारदर्शी 100% मनी-बैक गारंटी
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                हमें अपने 100% शुद्ध आयुर्वेदिक फॉर्मूले की गुणवत्ता और प्रभाव पर पूर्ण विश्वास है। यदि आप बताए गए निर्देशों और परहेज के अनुसार उत्पाद का नियमित उपयोग करते हैं और संतुष्ट नहीं होते हैं, तो आप 30 दिनों के भीतर रिफंड का दावा कर सकते हैं।
              </p>

              {/* 3 Pillars of Policy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">30 दिन की अवधि</h5>
                    <p className="text-[11px] text-gray-500">डिलीवरी तिथि से 30 दिनों के भीतर दावा दर्ज करें</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">सरल सत्यापन</h5>
                    <p className="text-[11px] text-gray-500">केवल ऑर्डर संख्या व मूल विवरण आवश्यक</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">सीधा बैंक रिफंड</h5>
                    <p className="text-[11px] text-gray-500">5-7 कार्य दिवसों में मूल खाते/UPI में वापसी</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/refund-guarantee"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  गारंटी के नियम पढ़ें व दावा करें
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/policy/refund"
                  className="text-xs text-gray-500 hover:text-emerald-700 underline font-medium"
                >
                  विस्तृत रिटर्न व रिफंड पॉलिसी देखें
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
