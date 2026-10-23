"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/data/mockData";

export const InteractiveFaqs: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#faf8f5] border-t border-[#e9e3d8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white text-[#0b3d2e] border border-emerald-900/15 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>स्पष्ट और पारदर्शी समाधान</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            अक्सर पूछे जाने वाले सवाल (FAQs)
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            माँ आयुर्वेदिक क्रीम के बारे में सामान्य प्रश्नों के स्पष्ट व सीधे उत्तर
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#0b3d2e] shadow-sm ring-1 ring-[#0b3d2e]/10"
                    : "border-[#e9e3d8] hover:border-emerald-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left font-bold text-gray-900 text-base sm:text-lg p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#0b3d2e] text-white rotate-180"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#fdfdfc] animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
