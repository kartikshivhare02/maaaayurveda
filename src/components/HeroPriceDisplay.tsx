"use client";

import React from "react";
import { useProductStore } from "@/lib/store/productStore";

export const HeroPriceDisplay: React.FC = () => {
  const { product } = useProductStore();

  const price = product.pricePaise / 100;
  const mrp = product.mrpPaise / 100;
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
