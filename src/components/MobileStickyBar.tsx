"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/context/AuthContext";
import { BRAND_INFO, BUNDLE_OFFERS } from "@/lib/data/mockData";
import { ArrowRight, MessageCircle, Zap, ChevronDown, ShoppingBag } from "lucide-react";

export const MobileStickyBar: React.FC = () => {
  const router = useRouter();
  const { selectedBundle, setSelectedBundle, addItem, bundles } = useCart();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  const activeBundles = bundles && bundles.length > 0 ? bundles : BUNDLE_OFFERS;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offersElem = document.getElementById("offers");

      let inOffersView = false;
      if (offersElem) {
        const rect = offersElem.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= window.innerHeight * 0.3) {
          inOffersView = true;
        }
      }

      if (scrollY > 400 && !inOffersView) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInstantBuy = () => {
    const offersEl = document.getElementById("product-selection") || document.getElementById("offers");
    if (offersEl) {
      offersEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/#offers");
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      openAuthModal(() => {
        addItem(selectedBundle, 1);
      });
      return;
    }
    addItem(selectedBundle, 1);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="त्वरित खरीद बार"
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden transition-all duration-300 animate-slide-up"
    >
      {/* Expanded pack selector */}
      {isExpanded && (
        <div className="glass-floating border-t border-stone-200/80 px-3 pb-2 pt-3 space-y-1.5 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-stone-700">पैक चुनें</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-stone-400 font-semibold px-2 py-0.5 rounded-lg hover:bg-stone-100"
            >
              बंद करें ✕
            </button>
          </div>
          {activeBundles.map((bundle) => {
            const isSelected = selectedBundle.id === bundle.id;
            return (
              <button
                key={bundle.id}
                type="button"
                onClick={() => {
                  setSelectedBundle(bundle);
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-1.5 transition-all text-left ${
                  isSelected
                    ? "border-forest-700 bg-forest-50 shadow-sm"
                    : "border-stone-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    isSelected ? "bg-forest-800 border-forest-800" : "border-stone-300"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-800 truncate">{bundle.title}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{bundle.savingsPercentage}% छूट • मुफ्त डिलीवरी</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-sm font-black text-stone-900">₹{bundle.pricePaise / 100}</div>
                  <div className="text-[10px] text-stone-400 line-through">₹{bundle.mrpPaise / 100}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main sticky bar */}
      <div className="mobile-sticky px-2.5 sm:px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pack selector trigger */}
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="flex-1 min-w-0 flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-left"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[9px] text-stone-500 font-semibold leading-none mb-0.5">पैक चुनें</div>
              <div className="text-xs font-black text-stone-800 truncate">
                {selectedBundle.packCount} पैक • ₹{selectedBundle.pricePaise / 100}
                <span className="text-[10px] text-emerald-700 font-bold ml-1 hidden xs:inline">
                  ({selectedBundle.savingsPercentage}% छूट)
                </span>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-500 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `नमस्ते, मुझे ${selectedBundle.title} (₹${selectedBundle.pricePaise / 100}) ऑर्डर करनी है।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] flex items-center justify-center active:scale-95 transition-transform shrink-0"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-[#25D366] text-[#25D366]" />
          </a>

          {/* Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center active:scale-95 transition-transform shrink-0"
            aria-label="कार्ट में जोड़ें"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* Buy Now */}
          <button
            type="button"
            id="mobile-sticky-buy-btn"
            onClick={handleInstantBuy}
            className="flex items-center justify-center gap-1 bg-gradient-to-r from-amber-600 to-amber-500 active:from-amber-700 active:to-amber-600 text-white font-black text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-amber-700/30 active:scale-95 transition-all shrink-0 whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>खरीदें</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
