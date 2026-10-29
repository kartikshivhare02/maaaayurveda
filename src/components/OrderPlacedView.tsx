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
  Truck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Printer,
  Copy,
  Check,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Clock,
  Sparkles,
  ShoppingBag,
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
        particleCount: 90,
        spread: 80,
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

      // If not in localStorage or missing items, fetch from tracking API
      if (!foundOrder || !foundOrder.items || foundOrder.items.length === 0) {
        try {
          const res = await fetch(`/api/orders/track?q=${encodeURIComponent(cleanOrderId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.order) {
              foundOrder = data.order;
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

  const cleanWhatsAppPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");
  const effectiveType = order?.paymentMethod || orderType || "prepaid";
  const isCod = effectiveType === "cod";

  const items: CartItem[] = order?.items && order.items.length > 0
    ? order.items
    : [
        {
          id: "item-default",
          bundleId: "bundle-2pack",
          title: "माँ आयुर्वेदिक क्रीम (2 का पैक - संपूर्ण कोर्स)",
          packCount: 2,
          unitPricePaise: 89900,
          totalPricePaise: 89900,
          mrpPaise: 139800,
          quantity: 1,
          image: MAIN_PRODUCT.images[0],
        },
      ];

  const totalPaise = order?.totalPaise || (isCod ? 89900 : 89900);
  const subtotalPaise = order?.subtotalPaise || totalPaise;
  const discountPaise = order?.discountPaise || 0;
  const shippingPaise = order?.shippingPaise || 0;

  const address = order?.shippingAddress;
  const customerName = order?.customerName || address?.fullName || "सम्मानित ग्राहक";
  const customerPhone = order?.customerPhone || address?.phone || "";

  return (
    <>
      {/* 1. Normal Web View (Completely hidden during printing) */}
      <div className="hide-on-print bg-[#f8faf9] min-h-screen py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-950/10 shadow-lg space-y-8 print:shadow-none print:border-none print:p-0">
          
          {/* Top Celebration Banner */}
          <div className="text-center space-y-4">
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                धन्यवाद, {customerName}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-1.5">
                आपका ऑर्डर प्राप्त हो चुका है। हमारे आयुर्वेदिक केंद्र द्वारा इसे तैयार कर 24 घंटे के अंदर डिस्पैच किया जा रहा है।
              </p>
            </div>

            {/* Order Number Pill with Copy */}
            <div className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-2xl p-2 px-4 transition-colors">
              <span className="text-xs text-gray-500 font-medium">ऑर्डर संदर्भ संख्या:</span>
              <span className="font-mono font-black text-sm sm:text-base text-emerald-900 tracking-wide">
                {cleanOrderId}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-all ml-1"
                title="ऑर्डर नंबर कॉपी करें"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>कॉपी हुआ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>कॉपी</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-Step Interactive Order Lifecycle Timeline */}
          <div className="bg-gradient-to-r from-emerald-50/60 via-amber-50/30 to-emerald-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-100/80">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              ऑर्डर प्रगति ट्रैकर (Live Progress)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900">ऑर्डर दर्ज</span>
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                  पूर्ण हुआ
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/30 animate-pulse">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900">पैकिंग व QC</span>
                <span className="text-[10px] text-amber-800 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                  प्रक्रिया में
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-500">डिस्पैच</span>
                <span className="text-[10px] text-gray-400">24 घंटे में</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-500">डिलीवरी</span>
                <span className="text-[10px] text-gray-500 font-semibold truncate max-w-[90px]">
                  {deliveryDate ? deliveryDate.split(",")[0] : "3-4 दिन"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <strong>अनुमानित डिलीवरी तिथि:</strong> {deliveryDate || "3-4 कार्य दिवस"}
              </span>
              <span className="text-emerald-700 font-semibold bg-white/80 px-2.5 py-1 rounded-full border border-emerald-100">
                🚀 सुरक्षित एक्सप्रेस डिलीवरी
              </span>
            </div>
          </div>

          {/* Details Grid: Left = Items & Address, Right = Payment & Trust */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Ordered Items & Shipping Details */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Ordered Items List */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  ऑर्डर किए गए उत्पाद ({items.length})
                </h3>

                <div className="divide-y divide-gray-100">
                  {items.map((it, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                        <Image
                          src={it.image || MAIN_PRODUCT.images[0]}
                          alt={it.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {it.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          मात्रा: <span className="font-bold text-gray-800">{it.quantity}</span> | पैक संख्या: {it.packCount || 1}
                        </p>
                        <p className="text-xs font-bold text-emerald-800 mt-1">
                          ₹{(it.totalPricePaise || it.unitPricePaise * it.quantity) / 100}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3 text-xs sm:text-sm">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  डिलीवरी का पता (Shipping Address)
                </h3>

                {address ? (
                  <div className="space-y-1 text-gray-700 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{address.fullName || customerName}</p>
                    {customerPhone && (
                      <p className="flex items-center gap-1.5 text-gray-600 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        +91 {customerPhone}
                      </p>
                    )}
                    <p className="text-gray-700 pt-1">
                      {[address.flatHouseNo, address.streetLocality].filter(Boolean).join(", ")}
                    </p>
                    {address.landmark && (
                      <p className="text-gray-500">लैंडमार्क: {address.landmark}</p>
                    )}
                    <p className="font-semibold text-gray-900">
                      {[address.city, address.state].filter(Boolean).join(", ")} - {address.pincode}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs italic bg-gray-50 p-3 rounded-xl">
                    पता सुरक्षित रूप से डेटाबेस में दर्ज है। पार्सल डिस्पैच पर कूरियर ट्रैकिंग SMS/WhatsApp पर उपलब्ध होगी।
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Payment & Price Summary */}
            <div className="md:col-span-5 space-y-5">
              
              {/* Payment Summary */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  भुगतान एवं बिलिंग सारांश
                </h3>

                {/* Payment Mode Alert */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    isCod
                      ? "bg-amber-50/70 border-amber-200 text-amber-950"
                      : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  }`}
                >
                  {isCod ? (
                    <Banknote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-bold">
                      {isCod
                        ? "कैश ऑन डिलीवरी (Cash on Delivery)"
                        : "ऑनलाइन भुगतान (Razorpay Verified)"}
                    </p>
                    <p className="text-[11px] leading-tight text-gray-600">
                      {isCod
                        ? "पार्सल प्राप्त होने पर कूरियर डिलीवरी बॉय को नकद राशि दें।"
                        : "भुगतान पूर्णतः सत्यापित एवं सुरक्षित रूप से प्राप्त हो चुका है।"}
                    </p>
                  </div>
                </div>

                {/* Price Table */}
                <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span>कुल उत्पाद मूल्य (Subtotal):</span>
                    <span className="font-semibold text-gray-800">₹{subtotalPaise / 100}</span>
                  </div>

                  {discountPaise > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>कूपन छूट (Discount):</span>
                      <span>-₹{discountPaise / 100}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>डिलीवरी शुल्क (Shipping):</span>
                    <span className="font-bold text-emerald-700">
                      {shippingPaise === 0 ? "मुफ्त (FREE)" : `₹${shippingPaise / 100}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline text-sm font-black text-gray-900">
                    <span>कुल देय राशि (Total Amount):</span>
                    <span className="text-lg text-emerald-800 font-black">
                      ₹{totalPaise / 100}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Guarantees */}
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/70 space-y-2 text-xs text-emerald-900">
                <p className="flex items-center gap-2 font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  100% धन वापसी संतुष्टि गारंटी
                </p>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  यदि 30 दिनों में आप परिणामों से संतुष्ट नहीं होते हैं, तो बिना किसी सवाल के आपका पूरा पैसा वापस कर दिया जाएगा।
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: WhatsApp, Print, Track, Continue Shopping */}
          <div className="pt-4 border-t border-gray-100 space-y-4 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${cleanWhatsAppPhone}?text=${encodeURIComponent(
                  `नमस्ते, मेरा ऑर्डर नंबर ${cleanOrderId} है। कृपया मुझे इसकी लाइव डिलीवरी अपडेट प्रदान करें।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp पर लाइव अपडेट पाएं
              </a>

              <Link
                href={`/track-order?q=${encodeURIComponent(cleanOrderId)}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all hover:scale-[1.01]"
              >
                <Truck className="w-4 h-4" />
                ऑर्डर लाइव ट्रैक करें
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>बिल / रसीद प्रिंट करें (Print Bill)</span>
                </button>

                <Link
                  href={`/invoice/${encodeURIComponent(cleanOrderId)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-emerald-800 font-semibold py-2 px-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="नए टैब में बीजक खोलें"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  <span>नये टैब में</span>
                </Link>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-bold py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <span>← मुख्य पृष्ठ पर जाएं (Continue Shopping)</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* 2. Dedicated Printable Tax Invoice (Strictly visible only during printing) */}
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

      {/* 3. Invoice Preview Modal on Screen */}
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

