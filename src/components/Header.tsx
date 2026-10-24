"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/context/AuthContext";
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
  User,
  LogIn,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { user, isLoggedIn, isAdmin, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
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
                  className="px-3.5 py-2 text-xs font-bold text-stone-700 hover:text-forest-900 hover:bg-forest-50/70 rounded-xl transition-all duration-150 relative group"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1.5 text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white px-1.5 py-0.5 rounded-full shadow-2xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Action Icons & User/Admin Controls ───────────────── */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Admin Dashboard CTA Button (Visible when logged in as admin) */}
              {isLoggedIn && isAdmin && (
                <Link
                  href="/admin"
                  id="header-admin-btn"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black shadow-xs hover:shadow-md transition-all shrink-0"
                  title="एडमिन कंट्रोल पैनल (Admin Dashboard)"
                >
                  <LayoutDashboard className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">एडमिन डैशबोर्ड</span>
                </Link>
              )}

              {/* User / Sign-In Button */}
              {isLoggedIn ? (
                <Link
                  href="/account"
                  id="header-account-btn"
                  className="inline-flex items-center gap-1.5 bg-forest-50 hover:bg-forest-100 text-forest-900 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-forest-200/80 hover:border-forest-300 shadow-2xs transition-all shrink-0"
                  title="मेरा खाता व ऑर्डर विवरण"
                >
                  <div className="w-5 h-5 rounded-full bg-forest-700 text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                    {user?.name ? user.name.charAt(0) : <User className="w-3 h-3" />}
                  </div>
                  <span className="hidden md:inline truncate max-w-[85px]">
                    {user?.name ? user.name.split(" ")[0] : "खाता"}
                  </span>
                  <span className="text-[10px] bg-forest-200/90 text-forest-900 font-semibold px-1.5 py-0.5 rounded-md hidden lg:inline">
                    ऑर्डर
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  id="header-login-btn"
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0"
                  title="लॉग इन / साइन इन (Sign In)"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">साइन इन</span>
                  <span className="sm:hidden text-[11px]">लॉगिन</span>
                </button>
              )}

              {/* WhatsApp CTA — desktop only */}
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम ऑर्डर करनी है।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-3 py-2 rounded-xl text-xs font-bold transition-all border border-[#25D366]/20 hover:border-[#25D366]/40"
                title="WhatsApp आर्डर"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

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
            {/* User Account / Login Card in Drawer */}
            {isLoggedIn ? (
              <div className="p-3.5 mx-3 mt-3 mb-2 rounded-2xl bg-gradient-to-br from-forest-50 to-stone-50 border border-forest-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center font-black text-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 truncate flex items-center gap-1.5">
                      <span className="truncate">{user?.name}</span>
                      {isAdmin && (
                        <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded-full shrink-0">
                          एडमिन
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">{user?.email}</div>
                  </div>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-forest-800 bg-white border border-forest-200 px-3 py-1.5 rounded-xl shadow-2xs shrink-0"
                >
                  ऑर्डर देखें
                </Link>
              </div>
            ) : (
              <div className="p-3.5 mx-3 mt-3 mb-2 rounded-2xl bg-forest-50/80 border border-forest-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                    <LogIn className="w-4 h-4 text-forest-700" />
                    <span>लॉग इन / खाता बनाएं</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">ऑर्डर विवरण व ट्रैकिंग देखने हेतु</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs"
                >
                  साइन इन
                </button>
              </div>
            )}

            {/* Admin Quick Jump inside Drawer */}
            {isLoggedIn && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between mx-3 mb-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-amber-700" />
                  एडमिन डैशबोर्ड (उत्पाद व ऑर्डर प्रबंधन)
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Nav Links */}
            <nav className="px-3 py-2 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-forest-50 hover:text-forest-800 transition-all"
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
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-forest-50 hover:text-forest-800 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-stone-500" />
                  मेरे ऑर्डर व प्रोफाइल
                </span>
                <ChevronDown className="w-4 h-4 text-stone-400 -rotate-90" />
              </Link>
            </nav>

            {/* Quick Contact Strip */}
            <div className="px-3 pb-3 grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम के बारे में जानकारी चाहिए।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp सहायता
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 py-2.5 rounded-xl text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-forest-700" />
                कॉल करें
              </a>
            </div>

            {/* Trust micro strip */}
            <div className="px-4 pb-3 flex flex-wrap gap-3 text-[10px] text-stone-500 font-semibold">
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
