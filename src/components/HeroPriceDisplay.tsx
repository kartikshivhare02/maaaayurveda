"use client";

import React from "react";
import { useProductStore } from "@/lib/store/productStore";

interface HeroPriceDisplayProps {
  initialPricePaise?: number;
  initialMrpPaise?: number;
}

export const HeroPriceDisplay: React.FC<HeroPriceDisplayProps> = ({
  initialPricePaise,
  initialMrpPaise,
}) => {
  const { product } = useProductStore();

  // If initial props are passed from server/DB, prioritize them to prevent any client-side price flickering
  const rawPricePaise =
    initialPricePaise !== undefined ? initialPricePaise : product.pricePaise;
  const rawMrpPaise =
    initialMrpPaise !== undefined ? initialMrpPaise : product.mrpPaise;

  const price = rawPricePaise / 100;
  const mrp = rawMrpPaise / 100;
  const discountPct = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl sm:text-4xl font-black text-gray-900">
        ₹{price}
      </span>
      <span className="text-sm sm:text-base text-gray-400 line-through">
        ₹{mrp}
      </span>
      {discountPct > 0 && (
        <span className="text-xs font-bold text-[#0b3d2e] bg-emerald-100/80 px-2 py-0.5 rounded-md">
          {discountPct}% छूट
        </span>
      )}
    </div>
  );
};

