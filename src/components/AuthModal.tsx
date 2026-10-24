"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import { BRAND_INFO } from "@/lib/data/mockData";
import { ShieldCheck, X, Sparkles } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Emblem & Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shadow-sm mx-auto bg-white">
            <Image
              src={BRAND_INFO.logoUrl}
              alt={BRAND_INFO.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#f4fbf7] text-[#0b3d2e] border border-emerald-900/15 text-[11px] font-bold px-3 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>सुरक्षित आयुर्वेदिक खरीदारी</span>
            </div>
            <h2
              id="auth-modal-title"
              className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight"
            >
              लॉगिन करें (Sign In with Google)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
              सुरक्षित खरीदारी, 100% मनी-बैक गारंटी ट्रैकिंग व मुफ्त होम डिलीवरी हेतु कृपया अपने Google खाते से लॉगिन करें।
            </p>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-bold py-3.5 px-4 rounded-2xl shadow-xs transition-all text-sm group cursor-pointer"
          >
            <svg
              className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google के साथ जारी रखें (Continue with Google)</span>
          </button>

          {/* Privacy Note */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>100% सुरक्षित • कोई पासवर्ड याद रखने की जरूरत नहीं</span>
          </div>
        </div>
      </div>
    </div>
  );
};
