"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/context/AuthContext";
import { BUNDLE_OFFERS } from "@/lib/data/mockData";
import { BundleOffer } from "@/types";
import {
  Check,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

export const ComboSelector: React.FC = () => {
  const router = useRouter();
  const { addItem, selectedBundle, setSelectedBundle, bundles } = useCart();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const activeBundles = bundles && bundles.length > 0 ? bundles : BUNDLE_OFFERS;

  const handleSelectBundle = (bundle: BundleOffer) => {
    setSelectedBundle(bundle);
    setQuantity(1);
  };

  const handleAddToCart = (bundle: BundleOffer) => {
    if (!isLoggedIn) {
      openAuthModal(() => {
        addItem(bundle, quantity);
        setAddedNoticeId(bundle.id);
        setTimeout(() => setAddedNoticeId(null), 2500);
      });
      return;
    }
    addItem(bundle, quantity);
    setAddedNoticeId(bundle.id);
    setTimeout(() => setAddedNoticeId(null), 2500);
  };

  const handleBuyNow = (bundle: BundleOffer) => {
    if (!isLoggedIn) {
      openAuthModal(() => {
        addItem(bundle, quantity);
        router.push("/checkout");
      });
      return;
    }
    addItem(bundle, quantity);
    router.push("/checkout");
  };

  return (
    <div
      id="offers"
      className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-[#e9e3d8] relative scroll-mt-20 sm:scroll-mt-24 transition-all"
    >
      {/* Top Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <div className="inline-flex items-center gap-1.5 bg-[#fbf5e8] text-[#92540b] border border-amber-300/60 text-xs font-bold px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>विशेष आयुर्वेदिक कॉम्बो छूट</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          अपना पसंदीदा पैक चुनें (Select Your Pack)
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          पैक का चयन करें — चुने गए पैक के नीचे तुरंत <strong>&apos;अभी खरीदें&apos;</strong> व <strong>&apos;कार्ट में जोड़ें&apos;</strong> विकल्प उपलब्ध होगा।
        </p>
      </div>

      {/* Offer Cards with Individual Embedded Buy & Cart Actions */}
      <div className="space-y-4 mb-6">
        {activeBundles.map((bundle) => {
          const isSelected = selectedBundle.id === bundle.id;
          const perPack = Math.round(bundle.pricePaise / bundle.packCount / 100);
          const bundleTotal = (bundle.pricePaise * (isSelected ? quantity : 1)) / 100;
          const bundleSavings = (((bundle.mrpPaise - bundle.pricePaise) * (isSelected ? quantity : 1)) / 100);

          return (
            <div
              key={bundle.id}
              onClick={() => handleSelectBundle(bundle)}
              className={`relative cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 ${
                isSelected
                  ? "border-[#0b3d2e] bg-[#f4fbf7]/80 shadow-md ring-2 ring-[#0b3d2e]/15"
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

              {/* Main Card Header: Radio + Title + Pricing */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
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

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className="font-black text-gray-900 text-base sm:text-lg">
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

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                      <span className="text-[11px] font-bold text-[#0b3d2e] bg-emerald-100 px-2 py-0.5 rounded-md">
                        बचत: ₹{bundle.savingsPaise / 100} ({bundle.savingsPercentage}% छूट)
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                        ₹{perPack}/पैक
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold hidden xs:inline">
                        ● मुफ्त डिलीवरी
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-2xl font-black text-gray-900">
                    ₹{bundle.pricePaise / 100}
                  </div>
                  <div className="text-xs text-gray-400 line-through">
                    MRP: ₹{bundle.mrpPaise / 100}
                  </div>
                </div>
              </div>

              {/* INDIVIDUAL ACTION PANEL: Shows ONLY on the selected card! */}
              {isSelected ? (
                <div
                  className="mt-4 pt-4 border-t border-emerald-900/15 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Quantity & Live Calculation Box */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-emerald-900/15 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-gray-700">मात्रा (Quantity):</span>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-200 font-black text-sm transition-colors"
                          aria-label="मात्रा घटाएं"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-bold text-xs text-gray-900 min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-200 font-black text-sm transition-colors"
                          aria-label="मात्रा बढ़ाएं"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-500 mr-1.5">कुल राशि:</span>
                      <span className="text-lg sm:text-xl font-black text-[#0b3d2e]">
                        ₹{bundleTotal}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold ml-1.5">
                        (कुल बचत: ₹{bundleSavings})
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Action Buttons for THIS selected pack */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      id={`buy-now-${bundle.id}`}
                      onClick={() => handleBuyNow(bundle)}
                      className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e] text-white font-black py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm group"
                    >
                      <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                      <span>अभी खरीदें (Buy Now) — ₹{bundleTotal}</span>
                    </button>

                    <button
                      type="button"
                      id={`add-cart-${bundle.id}`}
                      onClick={() => handleAddToCart(bundle)}
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-[#0b3d2e] font-bold py-3 px-4 rounded-xl border-2 border-[#0b3d2e] transition-colors text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>कार्ट में जोड़ें (Add to Cart)</span>
                    </button>
                  </div>

                  {/* Live notification when added */}
                  {addedNoticeId === bundle.id && (
                    <div className="p-2.5 bg-[#0b3d2e] text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{bundle.title} ({quantity} पैक) सफलतापूर्वक कार्ट में जोड़ दिया गया!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2.5 text-right">
                  <span className="text-xs font-bold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
                    <span>यह पैक चुनें व खरीदें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-stone-50 sm:bg-transparent py-1.5 sm:py-0 rounded-lg">
          <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-medium">मुफ्त सुरक्षित होम डिलीवरी</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-stone-50 sm:bg-transparent py-1.5 sm:py-0 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-medium">कैश ऑन डिलीवरी (COD) उपलब्ध</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-stone-50 sm:bg-transparent py-1.5 sm:py-0 rounded-lg">
          <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-medium">30 दिन 100% मनी-बैक गारंटी</span>
        </div>
      </div>
    </div>
  );
};
