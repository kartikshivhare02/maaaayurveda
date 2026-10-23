"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND_INFO } from "@/lib/data/mockData";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  RotateCcw,
  MessageSquare,
  SearchCheck,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { label: "डैशबोर्ड (Overview)", href: "/admin", icon: LayoutDashboard },
    { label: "ऑर्डर प्रबंधन (Orders)", href: "/admin/orders", icon: ShoppingBag },
    { label: "स्टोरी टेस्टिमोनियल्स (Stories)", href: "/admin/stories", icon: Sparkles },
    { label: "प्रोडक्ट प्रबंधन (Product)", href: "/admin/products", icon: Package },
    { label: "कॉम्बो व कूपन (Offers)", href: "/admin/offers", icon: Tag },
    { label: "रिफंड अनुरोध (Refunds)", href: "/admin/refunds", icon: RotateCcw },
    { label: "सहायता टिकट्स (Support)", href: "/admin/support", icon: MessageSquare },
    { label: "SEO ऑडिट टूल (SEO Audit)", href: "/admin/seo", icon: SearchCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500">
            <Image src={BRAND_INFO.logoUrl} alt="Logo" fill sizes="32px" className="object-cover" />
          </div>
          <span className="font-bold text-sm">माँ आयुर्वेदिक एडमिन</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 p-5 shrink-0 flex flex-col justify-between z-30`}
      >
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
              <Image src={BRAND_INFO.logoUrl} alt="Logo" fill sizes="44px" className="object-cover" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide leading-tight">
                माँ आयुर्वेदिक
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold uppercase">
                एडमिन कंसोल
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Back Link */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>स्टोरफ्रंट देखें (View Store)</span>
          </Link>
          <div className="text-[10px] text-slate-500 pt-1">
            संस्करण 1.0 (प्रोडक्शन रेडी)
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
