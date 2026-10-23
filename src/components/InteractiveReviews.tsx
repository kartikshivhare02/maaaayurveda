"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, ThumbsUp, ShieldCheck } from "lucide-react";
import { REVIEWS } from "@/lib/data/mockData";

export const InteractiveReviews: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({
    "rev-1": 34,
    "rev-2": 28,
    "rev-3": 42,
    "rev-4": 19,
  });
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  const handleHelpful = (id: string) => {
    if (userVoted[id]) return;
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const filteredReviews = REVIEWS.filter((rev) => {
    if (filter === "all") return true;
    if (filter === "5star") return rev.rating === 5;
    if (filter === "daad") return rev.title.includes("दाद") || rev.comment.includes("दाद");
    if (filter === "psoriasis") return rev.title.includes("सोरायसिस") || rev.comment.includes("सोरायसिस") || rev.comment.includes("दरार");
    return true;
  });

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-white border-t border-[#e9e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#f4fbf7] text-[#0b3d2e] border border-emerald-900/15 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>सत्यापित खरीदार अनुभव</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            हमारे असली ग्राहकों की सच्ची प्रतिक्रियाएं
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            सत्यापित खरीदारों (Verified Buyers) द्वारा साझा किए गए वास्तविक अनुभव
          </p>
        </div>

        {/* Rating Breakdown Bar & Summary */}
        <div className="bg-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-[#e9e3d8] mb-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left score */}
          <div className="md:col-span-5 text-center md:text-left md:border-r md:border-gray-200/80 md:pr-6">
            <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-1">
              4.9 <span className="text-xl text-gray-400 font-semibold">/ 5</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-amber-500 mb-2 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-600 font-medium">
              1,480+ सत्यापित उपयोगकर्ताओं की रेटिंग के आधार पर
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              100% असली व प्रमाणित खरीद
            </div>
          </div>

          {/* Right rating bars */}
          <div className="md:col-span-7 space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-12 text-gray-600 font-medium shrink-0">5 स्टार</span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "89%" }}></div>
              </div>
              <span className="w-10 text-right text-gray-500 font-medium">89%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-gray-600 font-medium shrink-0">4 स्टार</span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "9%" }}></div>
              </div>
              <span className="w-10 text-right text-gray-500 font-medium">9%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-gray-600 font-medium shrink-0">3 स्टार</span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "2%" }}></div>
              </div>
              <span className="w-10 text-right text-gray-500 font-medium">2%</span>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            सभी समीक्षाएं (All)
          </button>
          <button
            onClick={() => setFilter("5star")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "5star"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            5-स्टार रेटिंग्स ★
          </button>
          <button
            onClick={() => setFilter("daad")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "daad"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            दाद (Ringworm) राहत
          </button>
          <button
            onClick={() => setFilter("psoriasis")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "psoriasis"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            सोरायसिस व दरारें
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#faf8f5] rounded-2xl p-6 border border-[#e9e3d8] shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
                </div>

                <h4 className="font-bold text-gray-900 text-base">{rev.title}</h4>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 flex items-center justify-between text-xs border-t border-gray-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                    {rev.customerName[0]}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{rev.customerName}</span>
                    <span className="text-gray-500 text-[11px]">{rev.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium bg-emerald-100/70 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    सत्यापित खरीद
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHelpful(rev.id)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors ${
                      userVoted[rev.id]
                        ? "text-emerald-800 font-bold bg-emerald-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                    title="क्या यह समीक्षा मददगार थी?"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{helpfulCounts[rev.id] || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
