"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { BRAND_INFO, MAIN_PRODUCT } from "@/lib/data/mockData";
import { Order, CartItem } from "@/types";
import { TaxInvoice } from "@/components/TaxInvoice";
import {
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Package,
  MapPin,
  Phone,
  Banknote,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface OrderPlacedViewProps {
  orderId: string;
  orderType?: string;
}

export const OrderPlacedView: React.FC<OrderPlacedViewProps> = ({
  orderId,
  orderType = "prepaid",
}) => {
  const [order, setOrder] = useState<Partial<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const cleanOrderId = (orderId || "").trim();

  useEffect(() => {
    // 1. Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#0f4c3a", "#d97706", "#10b981", "#fbbf24", "#059669"],
      });
    } catch {
      // ignore
    }

    // 2. Compute delivery date (4 days from today)
    const d = new Date();
    d.setDate(d.getDate() + 4);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDeliveryDate(d.toLocaleDateString("hi-IN", options));

    // 3. Load order from localStorage or Database API
    const loadOrderData = async () => {
      let foundOrder: any = null;

      // Check localStorage first for immediate reactivity
      try {
        const local = localStorage.getItem("maa_orders");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            foundOrder = parsed.find(
              (o: any) =>
                o.orderNumber === cleanOrderId ||
                o.id === cleanOrderId ||
                String(o.orderNumber).toLowerCase() === cleanOrderId.toLowerCase()
            );
          }
        }
      } catch (err) {
        console.warn("Could not read local orders:", err);
      }

      // If not in localStorage or missing items/price, fetch from tracking API
      if (!foundOrder || !foundOrder.items || foundOrder.items.length === 0 || !foundOrder.totalPaise) {
        try {
          const res = await fetch(`/api/orders/track?q=${encodeURIComponent(cleanOrderId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.order) {
              foundOrder = {
                ...foundOrder,
                ...data.order,
                items: data.order.items?.length > 0 ? data.order.items : foundOrder?.items,
                totalPaise: data.order.totalPaise || data.order.total_paise || foundOrder?.totalPaise || foundOrder?.total_paise,
                subtotalPaise: data.order.subtotalPaise || data.order.subtotal_paise || foundOrder?.subtotalPaise,
                paymentMethod: data.order.paymentMethod || data.order.payment_method || foundOrder?.paymentMethod,
              };
            }
          }
        } catch (apiErr) {
          console.warn("Tracking API fetch error:", apiErr);
        }
      }

      if (foundOrder) {
        setOrder(foundOrder);
      }
      setLoading(false);
    };

    loadOrderData();
  }, [cleanOrderId]);

  const handleCopyOrderNumber = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cleanOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const effectiveType = order?.paymentMethod || orderType || "prepaid";
  const isCod = effectiveType === "cod";

  const items: CartItem[] =
    order?.items && order.items.length > 0
      ? order.items
      : [
          {
            id: "item-default",
            bundleId: "bundle-2-pack",
            title: "2 पैक कॉम्बो (स्पेशल बचत)",
            packCount: 2,
            unitPricePaise: 149900,
            totalPricePaise: 149900,
            mrpPaise: 199800,
            quantity: 1,
            image: MAIN_PRODUCT.images[0],
          },
        ];

  const itemsTotalCalculated = items.reduce(
    (acc, it) =>
      acc + (Number(it.totalPricePaise) || Number(it.unitPricePaise) * Number(it.quantity) || 0),
    0
  );

  const totalPaise =
    Number(order?.totalPaise) ||
    Number((order as any)?.total_paise) ||
    itemsTotalCalculated ||
    149900;
  const subtotalPaise =
    Number(order?.subtotalPaise) ||
    Number((order as any)?.subtotal_paise) ||
    totalPaise;
  const discountPaise =
    Number(order?.discountPaise) ||
    Number((order as any)?.discount_paise) ||
    0;
  const shippingPaise =
    Number(order?.shippingPaise) ||
    Number((order as any)?.shipping_paise) ||
    0;

  const address = order?.shippingAddress;
  const customerName = order?.customerName || address?.fullName || "सम्मानित ग्राहक";
  const customerPhone = order?.customerPhone || address?.phone || "";

  return (
    <>
      {/* Normal Web Screen (Hidden during print) */}
      <div className="hide-on-print bg-[#f8faf9] min-h-[80vh] py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-950/10 shadow-lg text-center space-y-7">
            
            {/* Top Success Badge */}
            <div className="space-y-3">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-700/20 animate-scale-in">
                  <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.2]" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow border-2 border-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  कन्फर्म
                </span>
              </div>

              <div>
                <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  ऑर्डर सफलतापूर्वक दर्ज हो गया! (Order Placed)
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  धन्यवाद, {customerName}!
                </h1>
                <p className="text-sm text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                  आपका ऑर्डर सफलतापूर्वक प्राप्त हो चुका है और 24 घंटे के अंदर सुरक्षित रूप से डिस्पैच किया जा रहा है।
                </p>
              </div>
            </div>

            {/* Order Number Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">
                  आपका ऑर्डर नंबर (Order Number):
                </span>
                <span className="font-mono font-black text-lg sm:text-xl text-emerald-950 tracking-wider">
                  {cleanOrderId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-100/60 border border-emerald-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs"
                title="ऑर्डर नंबर कॉपी करें"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>ऑर्डर नंबर कॉपी करें</span>
                  </>
                )}
              </button>
            </div>

            {/* Clean Essential Order Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Payment & Amount */}
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                  कुल देय राशि (Total Amount)
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-900">
                  ₹{totalPaise / 100}
                </div>
                <p className="text-xs font-semibold text-gray-600">
                  {isCod ? "कैश ऑन डिलीवरी (COD - पार्सल मिलने पर भुगतान)" : "ऑनलाइन भुगतान पूर्ण (सत्यापित)"}
                </p>
              </div>

              {/* Delivery Estimation */}
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  अनुमानित डिलीवरी तिथि
                </span>
                <div className="text-sm sm:text-base font-bold text-gray-900">
                  {deliveryDate || "3-4 कार्य दिवस"}
                </div>
                <p className="text-xs font-semibold text-emerald-700">
                  मुफ्त सुरक्षित होम डिलीवरी
                </p>
              </div>
            </div>

            {/* Ordered Item(s) Details */}
            {items.length > 0 && (
              <div className="bg-gray-50/60 rounded-2xl p-4 border border-gray-100 text-left space-y-2.5">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-700" />
                  चुना हुआ पैक (Ordered Pack)
                </span>
                <div className="divide-y divide-gray-100">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-white">
                          <Image
                            src={it.image || MAIN_PRODUCT.images[0]}
                            alt={it.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{it.title}</p>
                          <p className="text-[11px] text-gray-500">मात्रा: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        ₹{(it.totalPricePaise || it.unitPricePaise * it.quantity) / 100}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Address Summary */}
            {address && (
              <div className="bg-gray-50/60 rounded-2xl p-4 border border-gray-100 text-left text-xs text-gray-700 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  डिलीवरी का पता
                </span>
                <p className="font-bold text-gray-900">{address.fullName || customerName} {customerPhone ? `(${customerPhone})` : ""}</p>
                <p>{[address.flatHouseNo, address.streetLocality, address.landmark, address.city, address.state].filter(Boolean).join(", ")} - {address.pincode}</p>
              </div>
            )}

            {/* Direct Action Buttons: Prominent Invoice Download & Return Home */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                id="download-invoice-btn"
                onClick={() => setShowInvoiceModal(true)}
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                <span>इनवॉइस / बिल डाउनलोड करें (Download Invoice)</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                <Link
                  href={`/invoice/${encodeURIComponent(cleanOrderId)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-emerald-800 py-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>नए टैब में इनवॉइस खोलें</span>
                </Link>

                <span className="text-gray-300">•</span>

                <Link
                  href="/"
                  className="text-emerald-700 hover:text-emerald-900 py-1"
                >
                  <span>मुख्य पृष्ठ (Home)</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Printable Tax Invoice for instant printing */}
      <div className="hidden print:block">
        <TaxInvoice
          order={
            order || {
              orderNumber: cleanOrderId,
              customerName,
              customerPhone,
              shippingAddress: address,
              items,
              totalPaise,
              subtotalPaise,
              discountPaise,
              shippingPaise,
              paymentMethod: isCod ? "cod" : "razorpay_online",
              paymentStatus: isCod ? "pending" : "paid",
              createdAt: new Date().toISOString(),
            }
          }
          showActionToolbar={false}
        />
      </div>

      {/* Invoice Modal for Screen View / Direct Print */}
      {showInvoiceModal && (
        <div className="no-print fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-scale-in">
            <TaxInvoice
              order={
                order || {
                  orderNumber: cleanOrderId,
                  customerName,
                  customerPhone,
                  shippingAddress: address,
                  items,
                  totalPaise,
                  subtotalPaise,
                  discountPaise,
                  shippingPaise,
                  paymentMethod: isCod ? "cod" : "razorpay_online",
                  paymentStatus: isCod ? "pending" : "paid",
                  createdAt: new Date().toISOString(),
                }
              }
              onClose={() => setShowInvoiceModal(false)}
              showActionToolbar={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

