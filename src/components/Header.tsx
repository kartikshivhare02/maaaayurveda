"use client";

import React, { useState, useEffect } from "react";
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
  ChevronDown,
  Leaf,
} from "lucide-react";

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const navLinks = [
    { href: "/", label: "होम" },
    { href: "/product", label: "उत्पाद विवरण" },
    { href: "/#offers", label: "कॉम्बो ऑफर", badge: "छूट" },
    { href: "/#diet", label: "परहेज गाइड" },
    { href: "/#stories", label: "ग्राहक कहानियां" },
    { href: "/refund-guarantee", label: "मनी-बैक" },
  ];

  return (
    <>
      {/* ─── Announcement Strip ─────────────────────────────── */}
      <div className="trust-strip text-white py-2 px-3 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Scrolling ticker on mobile */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium overflow-hidden">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="truncate text-emerald-50">
              🌿 100% शुद्ध आयुर्वेदिक • मुफ्त डिलीवरी • कैश ऑन डिलीवरी • आयुष प्रमाणित
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs text-emerald-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% मनी-बैक</span>
            </span>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{BRAND_INFO.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Sticky Header ──────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "glass-nav shadow-[0_2px_20px_rgba(11,61,46,0.08)]"
            : "bg-white/98"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[70px]">

            {/* ── Brand Logo ─────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-3 group py-1 min-w-0"
              aria-label={BRAND_INFO.name}
            >
              <div className="relative h-11 w-11 sm:h-13 sm:w-13 rounded-full overflow-hidden ring-2 ring-forest-700/20 group-hover:ring-forest-700/40 shadow-md transition-all duration-300 bg-white shrink-0">
                <Image
                  src={BRAND_INFO.logoUrl}
                  alt={BRAND_INFO.name}
                  fill
                  sizes="52px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="font-black text-forest-900 text-base leading-tight tracking-tight">
                  {BRAND_INFO.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-forest-600 font-semibold">
                  <Leaf className="w-2.5 h-2.5" />
                  <span>100% आयुर्वेदिक • आयुष प्रमाणित</span>
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ────────────────── */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-forest-800 hover:bg-forest-50 transition-all duration-200 group"
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Action Icons ───────────────── */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* WhatsApp CTA — desktop only */}
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम ऑर्डर करनी है।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-3 py-2 rounded-xl text-xs font-bold transition-all border border-[#25D366]/20 hover:border-[#25D366]/40"
                title="WhatsApp आर्डर"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              {/* Order Tracking */}
              <Link
                href="/account"
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-forest-800 px-2.5 py-2 rounded-xl hover:bg-forest-50 transition-all"
                title="ऑर्डर ट्रैक करें"
              >
                <Package className="w-4 h-4" />
                <span>ट्रैक करें</span>
              </Link>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-forest-50 hover:bg-forest-100 text-forest-900 rounded-xl transition-all border border-forest-200/60 hover:border-forest-300 shadow-xs"
                aria-label="शॉपिंग कार्ट"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md animate-scale-in">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-stone-700 hover:text-forest-900 hover:bg-stone-100 transition-all"
                aria-label={mobileMenuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mobile Drawer ───────────────────────────────── */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden border-t border-stone-100 bg-white shadow-xl animate-slide-up"
            role="dialog"
            aria-label="मोबाइल नेविगेशन"
          >
            {/* Nav Links */}
            <nav className="px-3 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-stone-800 hover:bg-forest-50 hover:text-forest-800 transition-all"
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-400 -rotate-90" />
                </Link>
              ))}
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-stone-800 hover:bg-forest-50 hover:text-forest-800 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-stone-500" />
                  ऑर्डर ट्रैक करें
                </span>
                <ChevronDown className="w-4 h-4 text-stone-400 -rotate-90" />
              </Link>
            </nav>

            {/* Quick Contact Strip */}
            <div className="px-3 pb-4 grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम के बारे में जानकारी चाहिए।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-xs font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp सहायता
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 py-3 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-forest-700" />
                कॉल करें
              </a>
            </div>

            {/* Trust micro strip */}
            <div className="px-4 pb-4 flex flex-wrap gap-3 text-[10px] text-stone-500 font-semibold">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-forest-600" />100% मनी-बैक</span>
              <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-forest-600" />आयुष प्रमाणित</span>
              <span className="flex items-center gap-1">🚚 मुफ्त डिलीवरी</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
