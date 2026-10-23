"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import { BRAND_INFO } from "@/lib/data/mockData";
import { ArrowRight, MessageCircle, Zap } from "lucide-react";

export const MobileStickyBar: React.FC = () => {
  const router = useRouter();
  const { selectedBundle, addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 450px, but hide if near footer
      const scrollY = window.scrollY;
      const offersElem = document.getElementById("offers");
      
      let inOffersView = false;
      if (offersElem) {
        const rect = offersElem.getBoundingClientRect();
        // If offers section is actively in view (between 10% and 90% of screen height)
        if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= window.innerHeight * 0.3) {
          inOffersView = true;
        }
      }

      if (scrollY > 450 && !inOffersView) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInstantBuy = () => {
    addItem(selectedBundle, 1);
    router.push("/checkout");
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="त्वरित खरीद बार"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-900/10 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] py-2.5 px-3.5 sm:hidden transition-all duration-300 animate-in slide-in-from-bottom"
    >
      <div className="flex items-center justify-between gap-2.5">
        {/* Pack Info & Price */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[130px]">
              {selectedBundle.title.split("(")[0]}
            </span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              {selectedBundle.savingsPercentage}% OFF
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-black text-gray-900">
              ₹{selectedBundle.pricePaise / 100}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ₹{selectedBundle.mrpPaise / 100}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">मुफ्त डिलीवरी</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `नमस्ते, मुझे माँ आयुर्वेदिक क्रीम (${selectedBundle.title}) ऑर्डर करनी है।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="WhatsApp परामर्श"
          >
            <MessageCircle className="w-5 h-5 fill-[#25D366] text-[#25D366]" />
          </a>

          <button
            type="button"
            onClick={handleInstantBuy}
            className="flex items-center justify-center gap-1.5 bg-[#0b3d2e] active:bg-[#07281e] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>अभी खरीदें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
