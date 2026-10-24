"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Order } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    setSearched(true);
    let foundOrder: Order | null = null;

    // 1. Search in Supabase if configured
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .or(`order_number.ilike.${clean},customer_phone.ilike.%${clean}%`)
          .limit(1)
          .maybeSingle();

        if (data) {
          foundOrder = {
            id: data.id,
            orderNumber: data.order_number,
            customerName: data.customer_name,
            customerPhone: data.customer_phone,
            customerEmail: data.customer_email,
            shippingAddress: data.shipping_address,
            items: data.items || [],
            subtotalPaise: data.subtotal_paise || 0,
            discountPaise: data.discount_paise || 0,
            shippingPaise: data.shipping_paise || 0,
            totalPaise: data.total_paise || 0,
            paymentMethod: data.payment_method || "cod",
            paymentStatus: data.payment_status || "pending",
            fulfillmentStatus: data.fulfillment_status || "confirmed",
            courierName: data.courier_name,
            trackingNumber: data.tracking_number,
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.updated_at || data.created_at || new Date().toISOString(),
          };
        }
      } catch {
        // ignore
      }
    }

    // 2. Search in localStorage orders
    if (!foundOrder) {
      try {
        const savedOrders: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
        const found = savedOrders.find(
          (o) =>
            o.orderNumber.toUpperCase() === clean ||
            o.customerPhone.includes(clean) ||
            o.id === clean
        );
        if (found) {
          foundOrder = found;
        }
      } catch {
        // ignore
      }
    }

    setOrder(foundOrder);
  };

  return (
    <div className="bg-[#fcfcfc] py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            ऑर्डर स्थिति ट्रैक करें (Track Your Order)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            अपनी ऑर्डर संख्या (उदा. MAA-123456) या पंजीकृत मोबाइल नंबर दर्ज करें।
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="ऑर्डर संख्या (उदा. MAA-123456) या फोन नंबर"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs uppercase font-mono"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>ट्रैक करें</span>
            </button>
          </div>
        </form>

        {searched && (
          <div>
            {order ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">ऑर्डर संख्या:</span>
                    <h3 className="text-lg font-mono font-bold text-gray-900">
                      {order.orderNumber}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "भुगतान पूर्ण (Paid)" : "कैश ऑन डिलीवरी (COD)"}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 uppercase">
                      {order.fulfillmentStatus === "shipped"
                        ? "मार्ग में है (In Transit)"
                        : order.fulfillmentStatus === "delivered"
                        ? "डिलीवर हो गया"
                        : "स्वीकृत व पैकिंग में"}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 -z-0 transition-all duration-500"
                      style={{
                        width:
                          order.fulfillmentStatus === "delivered"
                            ? "100%"
                            : order.fulfillmentStatus === "shipped"
                            ? "66%"
                            : "33%",
                      }}
                    ></div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">ऑर्डर दर्ज</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">डिस्पैच हुआ</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          order.fulfillmentStatus === "delivered"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {order.fulfillmentStatus === "delivered" ? "✓" : "3"}
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">डिलीवर</span>
                    </div>
                  </div>
                </div>

                {/* Courier Details */}
                {order.courierName && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500 block">कूरियर पार्टनर:</span>
                      <span className="font-bold text-gray-900">{order.courierName}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="text-right">
                        <span className="text-gray-500 block">AWB ट्रैकिंग नंबर:</span>
                        <span className="font-mono font-bold text-emerald-800">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-center pt-2">
                  <Link
                    href={`/order-success/${order.orderNumber}`}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    पूर्ण ऑर्डर विवरण व रसीद देखें →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-bold text-gray-900 text-base">
                  कोई ऑर्डर नहीं मिला
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                  कृपया अपनी सही ऑर्डर संख्या या मोबाइल नंबर दोबारा जांचें। सहायता के लिए हमारी WhatsApp हेल्पलाइन पर संपर्क करें।
                </p>
                <div className="pt-2">
                  <Link
                    href="/support"
                    className="inline-flex items-center text-xs font-bold text-emerald-700 hover:underline"
                  >
                    ग्राहक सहायता से संपर्क करें →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
