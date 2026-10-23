"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MAIN_PRODUCT } from "@/lib/data/mockData";
import { Leaf, Eye, Sparkles } from "lucide-react";

export const HeroProductGallery: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = [
    {
      src: MAIN_PRODUCT.images[0] || "/images/product.jpeg",
      label: "क्रीम जार (50g)",
      subtitle: "मुख्य उत्पाद पैकेजिंग",
    },
    {
      src: MAIN_PRODUCT.images[1] || "/images/details.jpeg",
      label: "परहेज पर्चा",
      subtitle: "सख्त खान-पान निर्देश",
    },
    {
      src: MAIN_PRODUCT.images[2] || "/images/logo.jpeg",
      label: "ब्रांड सील",
      subtitle: "100% प्रामाणिक माँ आयुर्वेदिक",
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 max-w-[320px] sm:max-w-md mx-auto w-full">
      {/* Main Image Container */}
      <div 
        className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border-3 sm:border-4 border-white bg-white group cursor-pointer"
        onClick={() => setIsZoomed(!isZoomed)}
        title="बड़ा देखने के लिए क्लिक करें"
      >
        <Image
          src={images[selectedIdx].src}
          alt={`माँ आयुर्वेदिक क्रीम - ${images[selectedIdx].label}`}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Floating Top Left Badge */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs border border-emerald-900/10 flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-gray-900">100% हर्बल मलहम</span>
        </div>

        {/* Floating Top Right Tag */}
        <div className="absolute top-3.5 right-3.5 bg-[#0b3d2e] text-white px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-xs font-bold">50 ग्राम पैक</span>
        </div>

        {/* Bottom Banner on Image */}
        <div className="absolute inset-x-3 bottom-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-gray-800">
              नया बैच: MAA-2026-OCT उपलब्ध
            </span>
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
            <Eye className="w-3 h-3" /> बड़ा देखें
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white text-left ${
              selectedIdx === idx
                ? "border-[#0b3d2e] ring-2 ring-[#0b3d2e]/20 shadow-xs"
                : "border-gray-200 hover:border-emerald-300 opacity-75 hover:opacity-100"
            }`}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Modal Lightbox if Zoomed */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-2xl w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl p-2 animate-in zoom-in-95">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={images[selectedIdx].src}
                alt={images[selectedIdx].label}
                fill
                sizes="800px"
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-gray-900/80 text-white px-3.5 py-1.5 rounded-full text-xs font-bold"
            >
              बंद करें ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
