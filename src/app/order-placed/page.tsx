"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderPlacedView } from "@/components/OrderPlacedView";
import Link from "next/link";
import { Loader2, Package, ArrowRight } from "lucide-react";

function OrderPlacedRootContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<string>("prepaid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qOrder = searchParams.get("id") || searchParams.get("orderNumber");
    const qType = searchParams.get("type") || "prepaid";

    if (qOrder) {
      setLatestOrderId(qOrder);
      setOrderType(qType);
      setLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem("maa_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = parsed[0];
          const orderNum = first.orderNumber || first.id;
          if (orderNum) {
            setLatestOrderId(orderNum);
            setOrderType(first.paymentMethod || "prepaid");
            setLoading(false);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        <p className="text-sm text-gray-500 font-medium">ऑर्डर विवरण लोड हो रहा है...</p>
      </div>
    );
  }

  if (latestOrderId) {
    return <OrderPlacedView orderId={latestOrderId} orderType={orderType} />;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
        <Package className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">कोई हालिया ऑर्डर नहीं मिला</h1>
      <p className="text-sm text-gray-600 max-w-md mb-6">
        यदि आपने हाल ही में कोई ऑर्डर दिया है, तो आप अपने ऑर्डर नंबर द्वारा स्थिति ट्रैक कर सकते हैं।
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/track-order"
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-sm transition-all"
        >
          <span>ऑर्डर ट्रैक करें</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm px-6 py-3 rounded-2xl transition-all"
        >
          होम पेज पर जाएं
        </Link>
      </div>
    </div>
  );
}

export default function OrderPlacedRootPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <OrderPlacedRootContent />
    </Suspense>
  );
}

