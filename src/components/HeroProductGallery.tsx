"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useProductStore } from "@/lib/store/productStore";
import { Leaf, Eye, Sparkles, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface HeroProductGalleryProps {
  initialImages?: ProductImageItem[];
}

export const HeroProductGallery: React.FC<HeroProductGalleryProps> = ({ initialImages }) => {
  const { product, slidingImages } = useProductStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Use slidingImages from store, or initialImages from server, or fallback
  const activeImages = slidingImages.length > 0
    ? slidingImages
    : (initialImages && initialImages.length > 0)
    ? initialImages
    : [
    {
      id: "default-1",
      url: "/images/product.jpeg",
      label: "मुख्य क्रीम जार (50g)",
      subtitle: "प्राथमिक उत्पाद फोटो",
      isPrimary: true,
      type: "primary" as const,
    },
  ];

  // Keep index within bounds
  useEffect(() => {
    if (selectedIdx >= activeImages.length) {
      setSelectedIdx(0);
    }
  }, [activeImages.length, selectedIdx]);

  const currentImage = activeImages[selectedIdx] || activeImages[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % activeImages.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4 max-w-sm sm:max-w-md mx-auto w-full select-none">
      {/* Main Sliding Image Container */}
      <div
        className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border-3 sm:border-4 border-white bg-white group cursor-pointer"
        onClick={() => setIsZoomed(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        title="बड़ा देखने के लिए क्लिक करें / स्वाइप करें"
      >
        <Image
          key={currentImage.url + selectedIdx}
          src={currentImage.url}
          alt={`माँ आयुर्वेदिक क्रीम - ${currentImage.label}`}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover transition-all duration-500 group-hover:scale-105 animate-in fade-in zoom-in-95"
          priority
        />

        {/* Floating Top Left Badge: Primary / Secondary Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-emerald-900/10 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold text-gray-900">100% हर्बल मलहम</span>
          </div>
          {currentImage.isPrimary ? (
            <div className="bg-emerald-700 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1 w-max">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>मुख्य फोटो (Primary)</span>
            </div>
          ) : (
            <div className="bg-slate-800/90 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-semibold shadow-2xs w-max">
              <span>सहायक फोटो (Secondary)</span>
            </div>
          )}
        </div>

        {/* Floating Top Right Tag: Dynamic Net Quantity from Admin */}
        <div className="absolute top-3 right-3 bg-[#0b3d2e] text-white px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 z-10">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-xs font-bold">{product.netQty} पैक</span>
        </div>

        {/* Slider Navigation Arrows */}
        {activeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="पिछली फोटो"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-95 z-10 hover:shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="अगली फोटो"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-95 z-10 hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Bottom Banner on Image: Image Label & Slide Position */}
        <div className="absolute inset-x-2.5 bottom-2.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
            <span className="text-[11px] font-bold text-gray-800 truncate">
              {currentImage.label || `फोटो ${selectedIdx + 1}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-gray-500 font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded">
              {selectedIdx + 1}/{activeImages.length}
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5">
              <Eye className="w-3 h-3" /> बड़ा देखें
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails Row (Sliding Selection) */}
      {activeImages.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {activeImages.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white text-left ${
                selectedIdx === idx
                  ? "border-[#0b3d2e] ring-2 ring-[#0b3d2e]/30 shadow-xs scale-102"
                  : "border-gray-200 hover:border-emerald-300 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={item.url}
                  alt={item.label || "उत्पाद फोटो"}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {item.isPrimary && (
                  <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[8px] font-black px-1 rounded shadow-2xs">
                    मुख्य
                  </span>
                )}
              </div>
              <span className="sr-only">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Dynamic Package Inclusions Badge from Admin */}
      {product.subtitle && (
        <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs text-emerald-900 font-bold shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="leading-tight">
            पैकेज सामग्री: <span className="text-emerald-950 font-black">{product.subtitle}</span>
          </span>
        </div>
      )}

      {/* Modal Lightbox if Zoomed */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-2xl w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-3 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50">
              <Image
                src={currentImage.url}
                alt={currentImage.label}
                fill
                sizes="800px"
                className="object-contain"
              />
            </div>

            {/* Lightbox Nav Arrows */}
            {activeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Lightbox Top Bar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold pointer-events-auto">
                {currentImage.label} ({selectedIdx + 1}/{activeImages.length})
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold pointer-events-auto transition-colors"
              >
                बंद करें ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
