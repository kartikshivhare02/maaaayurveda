"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cartStore";
import { BRAND_INFO } from "@/lib/data/mockData";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  ShieldCheck,
  MessageCircle,
  Package,
} from "lucide-react";

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <>
      {/* Sleek Announcement Strip */}
      <div className="bg-[#0b3b2c] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="truncate">🌿 100% शुद्ध आयुर्वेदिक फॉर्मूला • मुफ्त डिलीवरी • कैश ऑन डिलीवरी</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-100 shrink-0 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              100% मनी-बैक गारंटी
            </span>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              हेल्पलाइन: {BRAND_INFO.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header (Compact & Finger Friendly) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo Only (Self-contained Emblem) */}
            <Link href="/" className="flex items-center group py-1" aria-label={BRAND_INFO.name}>
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-emerald-700/30 shadow-xs group-hover:scale-105 transition-transform duration-200 bg-white">
                <Image
                  src={BRAND_INFO.logoUrl}
                  alt={BRAND_INFO.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 font-medium text-gray-700 text-sm">
              <Link href="/" className="hover:text-emerald-700 transition-colors">
                होम
              </Link>
              <Link href="/product" className="hover:text-emerald-700 transition-colors">
                प्रोडक्ट विवरण
              </Link>
              <Link href="/#offers" className="hover:text-emerald-700 transition-colors">
                कॉम्बो ऑफर
              </Link>
              <Link href="/#diet" className="hover:text-emerald-700 transition-colors">
                खान-पान व परहेज
              </Link>
              <Link href="/#stories" className="hover:text-emerald-700 transition-colors">
                ग्राहक कहानियां
              </Link>
              <Link href="/refund-guarantee" className="hover:text-emerald-700 transition-colors">
                मनी-बैक गारंटी
              </Link>
            </nav>

            {/* Actions: WhatsApp + Cart + Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Order button */}
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम ऑर्डर करनी है।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                title="WhatsApp पर आर्डर करें"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                <span>WhatsApp आर्डर</span>
              </a>

              {/* Order Tracking / Account */}
              <Link
                href="/account"
                className="hidden md:flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-emerald-700 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                title="ऑर्डर ट्रैक करें"
              >
                <Package className="w-4 h-4 text-gray-600" />
                <span>ऑर्डर ट्रैक</span>
              </Link>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 sm:p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl transition-all"
                aria-label="शॉपिंग कार्ट"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[11px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="मेनू खोलें"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Over Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md px-4 py-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>होम (Home)</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
            <Link
              href="/#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <div className="flex items-center gap-2">
                <span>कॉम्बो ऑफर (Pack Deals)</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  छूट ऑफर
                </span>
              </div>
              <span className="text-xs text-gray-400">→</span>
            </Link>
            <Link
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>घटक व औषधीय विवरण (Ingredients)</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
            <Link
              href="/#diet"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>खान-पान एवं सख्त परहेज नियम</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
            <Link
              href="/#stories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>सत्यापित ग्राहक कहानियां (Customer Stories)</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>ऑर्डर ट्रैक करें (Track Order)</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
            <Link
              href="/refund-guarantee"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>100% मनी-बैक गारंटी नियम</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>

            {/* Quick Contact within Mobile Drawer */}
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                WhatsApp सहायता
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-800 py-2.5 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                कॉल करें
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
