"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { MAIN_PRODUCT } from "@/lib/data/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  TrendingUp,
  Package,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { triggerAdminSuccess } from "@/lib/context/AdminToastContext";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAdminOrders = async (showToast = false) => {
    setIsRefreshing(true);
    let combinedOrders: Order[] = [];

    // 1. Fetch genuine orders from server API (Supabase Admin)
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.orders && Array.isArray(json.orders)) {
          combinedOrders = json.orders;
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin orders from server API:", err);
    }

    // 2. Fallback to direct client if server API was empty
    if (combinedOrders.length === 0 && supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          combinedOrders = data.map((d: any) => ({
            id: d.id,
            orderNumber: d.order_number,
            customerName: d.customer_name,
            customerPhone: d.customer_phone,
            customerEmail: d.customer_email,
            shippingAddress: d.shipping_address,
            items: d.items || [],
            subtotalPaise: d.subtotal_paise || 0,
            discountPaise: d.discount_paise || 0,
            shippingPaise: d.shipping_paise || 0,
            totalPaise: d.total_paise || 0,
            paymentMethod: d.payment_method || "cod",
            paymentStatus: d.payment_status || "pending",
            fulfillmentStatus: d.fulfillment_status || "placed",
            courierName: d.courier_name,
            trackingNumber: d.tracking_number,
            createdAt: d.created_at || new Date().toISOString(),
            updatedAt: d.updated_at || d.created_at || new Date().toISOString(),
          }));
        }
      } catch {
        // Supabase direct fallback
      }
    }

    // 3. Fetch local orders and purge any legacy mock orders
    try {
      const saved: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
      const isMockOrder = (o: Order) =>
        o.id === "ord-1" ||
        o.id === "ord-2" ||
        o.id === "ord-3" ||
        o.orderNumber === "MAA-882109" ||
        o.orderNumber === "MAA-882110" ||
        o.orderNumber === "MAA-882111" ||
        o.customerName === "राजेश कुमार शर्मा" ||
        o.customerName === "सुनीता देवी" ||
        o.customerName === "सुरेश पाटिल";

      const realLocal = saved.filter((o) => !isMockOrder(o));
      if (realLocal.length !== saved.length) {
        localStorage.setItem("maa_orders", JSON.stringify(realLocal));
      }

      const existingNumbers = new Set(combinedOrders.map((o) => o.orderNumber));
      for (const o of realLocal) {
        if (!existingNumbers.has(o.orderNumber)) {
          combinedOrders.push(o);
          existingNumbers.add(o.orderNumber);
        }
      }
    } catch {
      // ignore
    }

    setOrders(combinedOrders);
    setIsRefreshing(false);
    if (showToast) {
      triggerAdminSuccess(`डेटाबेस से ${combinedOrders.length} ऑर्डर लोड किए गए!`);
    }
  };

  useEffect(() => {
    loadAdminOrders();

    // Auto-poll every 8 seconds
    const interval = setInterval(() => {
      loadAdminOrders();
    }, 8000);

    // Refresh when admin returns to tab
    const handleFocus = () => loadAdminOrders();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const totalOrdersValuePaise = orders.reduce((acc, o) => acc + (o.totalPaise || 0), 0);
  const totalPaidPaise = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + (o.totalPaise || 0), 0);
  const totalCodPaise = orders
    .filter((o) => o.paymentStatus !== "paid")
    .reduce((acc, o) => acc + (o.totalPaise || 0), 0);

  const paidOrdersCount = orders.filter((o) => o.paymentStatus === "paid").length;
  const pendingOrdersCount = orders.filter((o) => o.paymentStatus !== "paid").length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            डैशबोर्ड अवलोकन (Dashboard Overview)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            माँ आयुर्वेदिक क्रीम — ई-कॉमर्स बिक्री, स्टॉक एवं वास्तविक ऑर्डर
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAdminOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-emerald-800 border border-gray-300 text-xs font-bold rounded-xl transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{isRefreshing ? "रिफ्रेश..." : "ताज़ा करें (Refresh)"}</span>
          </button>
          <Link
            href="/admin/orders"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
          >
            सभी ऑर्डर्स देखें ({orders.length})
          </Link>
          <Link
            href="/admin/seo"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            SEO ऑडिट चलाएं
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Orders Value */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>कुल ऑर्डर मूल्य</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            ₹{(totalOrdersValuePaise / 100).toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-gray-500">
            ₹{(totalPaidPaise / 100).toLocaleString("en-IN")} ऑनलाइन • ₹{(totalCodPaise / 100).toLocaleString("en-IN")} COD
          </p>
        </div>

        {/* Total Orders Received */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>कुल प्राप्त ऑर्डर</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">{orders.length}</div>
          <p className="text-xs text-blue-600 font-semibold">स्टोरफ्रंट से प्राप्त कुल ऑर्डर</p>
        </div>

        {/* Pending COD Orders */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>लंबित COD ऑर्डर</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            {pendingOrdersCount}
          </div>
          <p className="text-xs text-gray-500">डिलीवरी पर वसूली योग्य</p>
        </div>

        {/* Paid Online Orders */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>सत्यापित ऑनलाइन भुगतान</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {paidOrdersCount}
          </div>
          <p className="text-xs text-emerald-600 font-semibold">तुरंत डिस्पैच हेतु तैयार</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">हाल के वास्तविक ऑर्डर (Recent Orders)</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              ग्राहकों द्वारा स्टोरफ्रंट पर दर्ज किए गए वास्तविक ऑर्डर की सूची
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">ऑर्डर संख्या</th>
                <th className="py-3 px-4">ग्राहक</th>
                <th className="py-3 px-4">स्थान</th>
                <th className="py-3 px-4">राशि</th>
                <th className="py-3 px-4">भुगतान स्थिति</th>
                <th className="py-3 px-4">शिपिंग स्थिति</th>
                <th className="py-3 px-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-700">अभी तक कोई ऑर्डर दर्ज नहीं हुआ है</p>
                    <p className="text-xs text-gray-400 mt-1">
                      जब कोई ग्राहक स्टोर से ऑर्डर करेगा, वह यहाँ सीधे दिखाई देगा।
                    </p>
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((ord) => (
                  <tr key={ord.orderNumber} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{ord.customerName}</div>
                      <div className="text-[11px] text-gray-400">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state?.split(" ")[0]}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ₹{ord.totalPaise / 100}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          ord.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.paymentStatus === "paid" ? "Paid" : "Pending COD"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {ord.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        प्रबंधित करें
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
