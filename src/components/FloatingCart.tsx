"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/cartStore";
import { ShoppingBag } from "lucide-react";

export const FloatingCart: React.FC = () => {
  const { totalItems, finalTotalPaise } = useCart();

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center">
      <Link
        href="/cart"
        id="floating-cart-btn"
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#0b3d2e] to-[#155d47] hover:from-[#071c14] hover:to-[#0b3d2e] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/20"
        aria-label={`शॉपिंग कार्ट (${totalItems} आइटम)`}
        title="शॉपिंग कार्ट देखें"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[11px] rounded-full flex items-center justify-center px-1 shadow-md border-2 border-white animate-scale-in">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
          <span className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">
            कार्ट
          </span>
          <span className="text-xs font-black text-white">
            {totalItems > 0 ? `₹${finalTotalPaise / 100}` : "खाली है"}
          </span>
        </div>
      </Link>
    </div>
  );
};
