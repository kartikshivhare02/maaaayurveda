"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND_INFO } from "@/lib/data/mockData";
import {
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Award,
  Lock,
  Leaf,
  MessageCircle,
  Star,
  ArrowRight,
} from "lucide-react";

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <li>
    <Link
      href={href}
      className="group flex items-center gap-1.5 text-sm text-stone-400 hover:text-emerald-300 transition-colors duration-200"
    >
      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5" />
      {children}
    </Link>
  </li>
);

export const Footer: React.FC = () => {
  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <footer className="gradient-footer text-stone-300 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-700/60 to-transparent" />

      {/* Subtle decorative background element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── CTA Strip ─────────────────────────────────── */}
        <div className="py-10 sm:py-12 border-b border-stone-700/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
                दाद, खाज, खुजली से राहत पाएं
              </h3>
              <p className="text-sm text-stone-400">
                30 दिन की मनी-बैक गारंटी के साथ आजमाएं — कोई जोखिम नहीं।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम ऑर्डर करनी है।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-green-900/30 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp से ऑर्डर
              </a>
              <Link
                href="#offers"
                className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 text-center"
              >
                अभी खरीदें
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Main Footer Grid ───────────────────────────── */}
        <div className="py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand Column — spans 2 on large */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-emerald-600/50 shadow-lg shrink-0">
                <Image
                  src={BRAND_INFO.logoUrl}
                  alt={BRAND_INFO.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{BRAND_INFO.name}</h2>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  {BRAND_INFO.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              दाद, दरार, खुजली और सोरायसिस की समस्याओं के लिए प्राचीन भारतीय जड़ी-बूटियों पर आधारित प्रामाणिक आयुर्वेदिक स्किनकेयर।
            </p>

            {/* Rating social proof */}
            <div className="flex items-center gap-2 bg-stone-800/60 px-3 py-2 rounded-xl w-fit border border-stone-700/50">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-white font-bold">4.9</span>
              <span className="text-[11px] text-stone-400">• 1,480+ समीक्षाएं</span>
            </div>

            {/* Certifications */}
            <div className="space-y-1.5 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                आयुष लाइसेंस: {BRAND_INFO.licenseNo}
              </p>
              <p className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                256-bit SSL सुरक्षित भुगतान
              </p>
            </div>
          </div>

          {/* Products Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">उत्पाद</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/">होम पेज</FooterLink>
              <FooterLink href="/product">उत्पाद विवरण</FooterLink>
              <FooterLink href="/about">हमारे बारे में</FooterLink>
              <FooterLink href="/#offers">कॉम्बो ऑफर</FooterLink>
              <FooterLink href="/#diet">परहेज गाइड</FooterLink>
              <FooterLink href="/#stories">ग्राहक कहानियां</FooterLink>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">सहायता</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/support">सहायता केंद्र</FooterLink>
              <FooterLink href="/track-order">ऑर्डर ट्रैक करें</FooterLink>
              <FooterLink href="/refund-guarantee">मनी-बैक गारंटी</FooterLink>
              <FooterLink href="/policy/refund">रिफंड पॉलिसी</FooterLink>
              <FooterLink href="/policy/shipping">शिपिंग नियम</FooterLink>
              <FooterLink href="/account">मेरा खाता</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">संपर्क</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-stone-400 hover:text-emerald-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{BRAND_INFO.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND_INFO.supportEmail}`}
                  className="flex items-start gap-2 text-stone-400 hover:text-emerald-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs">{BRAND_INFO.supportEmail}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-stone-400 text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </li>
              <li className="text-xs text-stone-500">
                ⏰ {BRAND_INFO.supportHours}
              </li>
            </ul>

            {/* Legal links */}
            <div className="pt-2 border-t border-stone-700/50 space-y-2">
              <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider">कानूनी</h5>
              <ul className="space-y-1.5">
                <FooterLink href="/policy/privacy">गोपनीयता नीति</FooterLink>
                <FooterLink href="/policy/terms">नियम व शर्तें</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── Disclaimer ─────────────────────────────────── */}
        <div className="border-t border-stone-700/60 py-6">
          <div className="bg-stone-800/50 rounded-2xl border border-stone-700/50 p-4 flex items-start gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-stone-400">
              <p className="font-semibold text-stone-300">
                महत्वपूर्ण चिकित्सीय डिस्क्लेमर:
              </p>
              <p className="leading-relaxed">
                यह उत्पाद एक पारंपरिक आयुर्वेदिक प्रोप्रायटरी औषधि है। यह किसी एलोपैथिक एंटीफंगल दवा का विकल्प नहीं है। यदि 3 सप्ताह तक सुधार न दिखे या गहरा संक्रमण हो, तो त्वचा रोग विशेषज्ञ से परामर्श लें।
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <p>© 2026 {BRAND_INFO.name}. सर्वाधिकार सुरक्षित।</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                🇮🇳 भारत में निर्मित
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                आयुष मानक
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
