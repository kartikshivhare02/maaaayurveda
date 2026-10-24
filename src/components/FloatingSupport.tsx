"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { BRAND_INFO } from "@/lib/data/mockData";

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded Quick Help Box */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72 sm:w-80 transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">आयुर्वेदिक सहायता केंद्र</h4>
                <p className="text-[11px] text-emerald-600 font-medium">● ऑनलाइन उपलब्ध</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-gray-600 space-y-2">
            <p>
              नमस्ते! क्या आपको माँ आयुर्वेदिक क्रीम के उपयोग, परहेज या ऑर्डर के संबंध में कोई प्रश्न है?
            </p>
            <p className="text-[11px] text-gray-500">
              समय: {BRAND_INFO.supportHours}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम के बारे में जानकारी चाहिए।"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp पर बात करें
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              कॉल करें: {BRAND_INFO.whatsappDisplay}
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="WhatsApp सहायता"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          WhatsApp सहायता
        </span>
      </button>
    </div>
  );
};
