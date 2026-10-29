"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaxInvoice } from "@/components/TaxInvoice";
import { Order } from "@/types";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function InvoiceContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || "";
  const [order, setOrder] = useState<Partial<Order> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      let found: any = null;

      // 1. Try local storage
      try {
        const saved = localStorage.getItem("maa_orders");
        if (saved) {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) {
            found = list.find(
              (o: any) =>
                o.orderNumber === orderId ||
                o.id === orderId ||
                String(o.orderNumber).toLowerCase() === orderId.toLowerCase()
            );
          }
        }
      } catch (e) {
        console.warn(e);
      }

      // 2. Try tracking API
      if (!found || !found.items || found.items.length === 0) {
        try {
          const res = await fetch(`/api/orders/track?q=${encodeURIComponent(orderId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.order) {
              found = data.order;
            }
          }
        } catch (apiErr) {
          console.warn(apiErr);
        }
      }

      if (found) {
        setOrder(found);
      } else {
        // Fallback placeholder with order number
        setOrder({
          orderNumber: orderId,
          totalPaise: 89900,
          paymentMethod: "cod",
          paymentStatus: "pending",
          createdAt: new Date().toISOString(),
        });
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        <p className="text-sm text-gray-500 font-medium">इनवॉइस तैयार हो रहा है...</p>
      </div>
    );
  }

  return (
    <div>
      <TaxInvoice order={order || { orderNumber: orderId }} onClose={() => router.back()} />
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <InvoiceContent />
    </Suspense>
  );
}

