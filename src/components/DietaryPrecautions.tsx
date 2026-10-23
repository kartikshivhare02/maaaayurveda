"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertTriangle, Ban, CheckCircle2, Info, Eye, X } from "lucide-react";
import { MAIN_PRODUCT } from "@/lib/data/mockData";

export const DietaryPrecautions: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="diet" className="py-16 sm:py-20 bg-[#faf8f5] border-y border-[#e9e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#fff1ef] text-[#c52814] border border-red-200 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>सख्त आयुर्वेदिक परहेज निर्देश (अनिवार्य नियम)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            दाद, दरार, खुजली और सोरायसिस में क्या <span className="text-red-600 underline decoration-red-300">नहीं खाना है</span>?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            आयुर्वेद के अनुसार खट्टी व पित्तवर्धक चीजें रक्त (Blood) को दूषित करती हैं, जिससे खुजली और संक्रमण बार-बार भड़कता है। माँ आयुर्वेदिक क्रीम के साथ इन खाद्य पदार्थों का <strong>पूर्ण परहेज</strong> रखने से ही स्थायी आराम मिलता है।
          </p>
        </div>

        {/* Two-Column Grid: Packaging Leaflet Visual vs Prohibited Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Packaging Leaflet Visual Card */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-[#e9e3d8]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-900">
                डिब्बे के साथ आने वाला मूल परहेज पर्चा:
              </span>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-xs text-[#0b3d2e] font-semibold flex items-center gap-1 hover:underline"
              >
                <Eye className="w-3.5 h-3.5" /> बड़ा देखें
              </button>
            </div>

            <div 
              className="relative aspect-4/5 w-full rounded-2xl overflow-hidden shadow-xs cursor-pointer group border border-gray-100"
              onClick={() => setShowModal(true)}
              title="बड़ा देखने के लिए क्लिक करें"
            >
              <Image
                src={MAIN_PRODUCT.images[1] || "/images/details.jpeg"}
                alt="माँ आयुर्वेदिक क्रीम परहेज एवं सेवन निर्देश"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/95 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-700" />
                  ज़ूम करके पढ़ें
                </span>
              </div>
            </div>

            <div className="mt-4 bg-[#f4fbf7] rounded-xl p-3 text-xs text-[#0b3d2e] flex items-center gap-2 border border-emerald-900/10">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>क्रीम के हर पैक के साथ यह विस्तृत परहेज चार्ट घर भेजा जाता है।</span>
            </div>
          </div>

          {/* List of Prohibited and Recommended Items */}
          <div className="lg:col-span-7 space-y-6">
            {/* Prohibited items */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-red-200/80">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    इन खट्टी व बासी चीजों का सेवन बिल्कुल न करें:
                  </h3>
                  <p className="text-xs text-red-600 font-medium">
                    (Strictly Avoid All Sour, Fermented & Citric Foods)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MAIN_PRODUCT.dietaryRestrictions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fff7f6] border border-red-100 text-gray-800 text-xs sm:text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                      ✕
                    </span>
                    <span className="font-semibold text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended items */}
            <div className="bg-[#f4fbf7] rounded-3xl p-6 border border-emerald-900/15">
              <h4 className="text-sm sm:text-base font-bold text-[#0b3d2e] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                स्वास्थ्यवर्धक एवं अनुशंसित आहार (पथ्य):
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-900/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                  ताजा लौकी, तोरई, परवल, टिंडा की हरी सब्जी
                </li>
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-900/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                  पर्याप्त मात्रा में शुद्ध गुनगुना पानी
                </li>
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-900/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                  मूंग की छिलके वाली दाल और सादी गेहूं की रोटी
                </li>
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-900/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                  धुले हुए साफ सूती (100% Cotton) ढीले कपड़े
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal for viewing details.jpeg leaflet in high resolution */}
        {showModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-3 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 px-2 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm">
                  माँ आयुर्वेदिक क्रीम — मूल परहेज एवं सेवन निर्देश पर्चा
                </h4>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex-1 min-h-[500px] w-full my-2 rounded-2xl overflow-hidden bg-gray-50">
                <Image
                  src="/images/details.jpeg"
                  alt="मूल परहेज पर्चा"
                  fill
                  sizes="1000px"
                  className="object-contain"
                />
              </div>

              <div className="text-center pt-2 text-xs text-gray-500">
                डिब्बे के साथ यही मूल पर्चा आपके पते पर भेजा जाता है।
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
