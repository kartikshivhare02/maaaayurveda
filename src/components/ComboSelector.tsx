"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import { BUNDLE_OFFERS } from "@/lib/data/mockData";
import {
  Check,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export const ComboSelector: React.FC = () => {
  const router = useRouter();
  const { addItem, selectedBundle, setSelectedBundle } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = () => {
    addItem(selectedBundle, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(selectedBundle, quantity);
    router.push("/checkout");
  };

  const currentTotal = (selectedBundle.pricePaise * quantity) / 100;
  const currentMrp = (selectedBundle.mrpPaise * quantity) / 100;
  const currentSavings = currentMrp - currentTotal;

  return (
    <div id="offers" className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-[#e9e3d8] relative">
      {/* Top Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <div className="inline-flex items-center gap-1.5 bg-[#fbf5e8] text-[#92540b] border border-amber-300/60 text-xs font-bold px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>विशेष आयुर्वेदिक कॉम्बो छूट</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          अपना पसंदीदा पैक चुनें (Select Your Pack)
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          अधिकांश ग्राहक <strong>45 दिन के संपूर्ण कोर्स और स्थायी राहत</strong> के लिए 2-पैक कॉम्बो चुनते हैं।
        </p>
      </div>

      {/* Offer Cards */}
      <div className="space-y-3.5 mb-6">
        {BUNDLE_OFFERS.map((bundle) => {
          const isSelected = selectedBundle.id === bundle.id;
          const perPack = Math.round(bundle.pricePaise / bundle.packCount / 100);

          return (
            <div
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle)}
              className={`relative cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 ${
                isSelected
                  ? "border-[#0b3d2e] bg-[#f4fbf7]/60 shadow-md ring-1 ring-[#0b3d2e]/20"
                  : "border-gray-200 hover:border-emerald-300 bg-white hover:bg-[#fafaf8]"
              }`}
            >
              {/* Highlight Badge */}
              {bundle.hindiTag && (
                <div
                  className={`absolute -top-3 right-4 text-[11px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider text-white shadow-xs ${
                    bundle.isPopular
                      ? "bg-[#c4821a]"
                      : bundle.isBestValue
                      ? "bg-[#0b3d2e]"
                      : "bg-gray-700"
                  }`}
                >
                  {bundle.hindiTag}
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Radio Checkmark */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
                      isSelected
                        ? "bg-[#0b3d2e] border-[#0b3d2e] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                        {bundle.title}
                      </h4>
                      {bundle.isPopular && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          अनुशंसित कोर्स
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {bundle.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className="text-[11px] font-bold text-[#0b3d2e] bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                        बचत: ₹{bundle.savingsPaise / 100} ({bundle.savingsPercentage}% OFF)
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                        मात्र ₹{perPack} / पैक
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        ● मुफ्त डिलीवरी
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-gray-900">
                    ₹{bundle.pricePaise / 100}
                  </div>
                  <div className="text-xs text-gray-400 line-through">
                    MRP: ₹{bundle.mrpPaise / 100}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantity & Live Calculation Box */}
      <div className="bg-[#faf8f5] rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-[#e9e3d8]">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-semibold text-gray-800">मात्रा (Quantity):</span>
          <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3.5 py-1.5 text-gray-700 hover:bg-gray-100 font-bold transition-colors"
              aria-label="मात्रा घटाएं"
            >
              −
            </button>
            <span className="px-3 py-1.5 font-bold text-sm text-gray-900 min-w-[2.2rem] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3.5 py-1.5 text-gray-700 hover:bg-gray-100 font-bold transition-colors"
              aria-label="मात्रा बढ़ाएं"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">कुल देय राशि (Payable):</div>
          <div className="text-2xl font-black text-[#0b3d2e]">₹{currentTotal}</div>
          <div className="text-[11px] text-[#0b3d2e] font-semibold">
            (कुल बचत: ₹{currentSavings})
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        {/* Instant Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full flex items-center justify-center gap-2.5 bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-base sm:text-lg group"
        >
          <Zap className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
          <span>अभी खरीदें (Buy Now) — ₹{currentTotal}</span>
        </button>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-[#f4fbf7] hover:bg-emerald-100/70 text-[#0b3d2e] font-bold py-3 px-6 rounded-2xl border border-emerald-300 transition-colors text-sm sm:text-base"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>कार्ट में जोड़ें (Add to Cart)</span>
        </button>
      </div>

      {/* Live notification on Add to Cart */}
      {addedNotice && (
        <div className="mt-3 p-3 bg-[#0b3d2e] text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{selectedBundle.title} कार्ट में जोड़ दिया गया है!</span>
        </div>
      )}

      {/* Trust Highlights */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-gray-100 text-[11px] text-gray-600 text-center sm:text-left">
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>मुफ्त होम डिलीवरी</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>कैश ऑन डिलीवरी</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>30 दिन मनी-बैक</span>
        </div>
      </div>
    </div>
  );
};
