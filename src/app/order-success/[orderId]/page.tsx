"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { BRAND_INFO } from "@/lib/data/mockData";
import {
  CheckCircle,
  Truck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Printer,
  FileText,
} from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = (params?.orderId as string) || "MAA-2026-9981";
  const orderType = searchParams.get("type") || "prepaid";

  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0f4c3a", "#d97706", "#10b981", "#fbbf24"],
      });
    } catch {
      // ignore
    }

    // Calculate delivery date (4 days from today)
    const d = new Date();
    d.setDate(d.getDate() + 4);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDeliveryDate(d.toLocaleDateString("hi-IN", options));
  }, []);

  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="bg-[#fcfcfc] py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-md text-center space-y-6">
          {/* Success Checkmark Badge */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
            <CheckCircle className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              ऑर्डर सफलतापूर्वक दर्ज हुआ!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              धन्यवाद! आपका ऑर्डर स्वीकार कर लिया गया है
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              ऑर्डर संख्या:{" "}
              <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                {orderNumber}
              </span>
            </p>
          </div>

          {/* Status Alert */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left flex items-start gap-3">
            <Truck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm text-emerald-950">
              <p className="font-bold">
                {orderType === "cod"
                  ? "कैश ऑन डिलीवरी (COD) ऑर्डर की पुष्टि हो चुकी है।"
                  : "ऑनलाइन भुगतान सफलतापूर्वक प्राप्त हुआ एवं सत्यापित है।"}
              </p>
              <p className="text-emerald-800">
                पार्सल 24 घंटे में डिस्पैच कर दिया जाएगा। आपको SMS/WhatsApp पर कूरियर ट्रैकिंग विवरण भेजा जाएगा।
              </p>
            </div>
          </div>

          {/* Delivery & Security Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium">अनुमानित डिलीवरी तिथि:</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{deliveryDate || "3-4 कार्य दिवस"}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium">संतुष्टि गारंटी:</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">30-दिन 100% मनी-बैक सुरक्षा</p>
              </div>
            </div>
          </div>

          {/* Actions: WhatsApp & Print */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `नमस्ते, मेरा ऑर्डर नंबर ${orderNumber} है। कृपया मुझे इसकी डिलीवरी अपडेट प्रदान करें।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp पर ट्रैकिंग अपडेट पाएं
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm px-5 py-3 rounded-2xl transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              रसीद प्रिंट करें (Print Invoice)
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500">
            <Link href="/" className="hover:text-emerald-700 font-semibold">
              ← होम पेज पर वापस जाएं
            </Link>
            <span>•</span>
            <Link href="/track-order" className="hover:text-emerald-700 font-semibold">
              ऑर्डर स्थिति ट्रैक करें
            </Link>
            <span>•</span>
            <Link href="/support" className="hover:text-emerald-700 font-semibold">
              ग्राहक सहायता
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
