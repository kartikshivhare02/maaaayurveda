"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { OrderPlacedView } from "@/components/OrderPlacedView";
import { Loader2 } from "lucide-react";

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId =
    (params?.orderId as string) ||
    searchParams.get("orderId") ||
    searchParams.get("orderNumber") ||
    searchParams.get("id") ||
    "MAA-ORDER";
  const orderType = searchParams.get("type") || "prepaid";

  return <OrderPlacedView orderId={orderId} orderType={orderType} />;
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
          <p className="text-sm text-gray-500 font-medium">ऑर्डर विवरण लोड हो रहा है...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
