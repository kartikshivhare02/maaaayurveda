"use client";

import React from "react";
import { Order, CartItem } from "@/types";
import { BRAND_INFO, MAIN_PRODUCT } from "@/lib/data/mockData";
import { Printer, X, ShieldCheck, CheckCircle2 } from "lucide-react";

interface TaxInvoiceProps {
  order: Partial<Order>;
  onClose?: () => void;
  showActionToolbar?: boolean;
}

// Helper to convert number to Hindi/English words
export function numberToWordsIndian(num: number): string {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n: number): string => {
    if (n === 0) return "Zero";
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " and " + inWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 !== 0 ? " " + inWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 !== 0 ? " " + inWords(n % 100000) : "")
      );
    return (
      inWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 !== 0 ? " " + inWords(n % 10000000) : "")
    );
  };

  const rupees = Math.floor(num);
  return `रुपये ${inWords(rupees)} मात्र (Rupees ${inWords(rupees)} Only)`;
}

export const TaxInvoice: React.FC<TaxInvoiceProps> = ({
  order,
  onClose,
  showActionToolbar = true,
}) => {
  const orderNumber = order?.orderNumber || order?.id || "MAA-2026";
  const address = order?.shippingAddress;
  const isCod = (order?.paymentMethod || "cod") === "cod";
  const isPaid = order?.paymentStatus === "paid" || !isCod;

  const rawDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = rawDate.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = rawDate.toLocaleTimeString("hi-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const items: CartItem[] =
    order?.items && order.items.length > 0
      ? order.items
      : [
          {
            id: "default-item",
            bundleId: "bundle-2pack",
            title: "माँ आयुर्वेदिक क्रीम (2 का पैक - संपूर्ण कोर्स)",
            packCount: 2,
            unitPricePaise: 149900,
            totalPricePaise: 149900,
            mrpPaise: 199800,
            quantity: 1,
            image: MAIN_PRODUCT.images[0],
          },
        ];

  const calculatedFromItems = items.reduce(
    (acc, it) => acc + (Number(it.totalPricePaise) || Number(it.unitPricePaise) * Number(it.quantity) || 0),
    0
  );

  const totalPaise =
    Number(order?.totalPaise) ||
    Number((order as any)?.total_paise) ||
    calculatedFromItems ||
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
  const totalRupees = totalPaise / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-modal-wrapper">
      {/* Action Toolbar (Never Printed) */}
      {showActionToolbar && (
        <div className="no-print bg-gray-900 text-white p-3 px-4 sm:px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-bold">
              टैक्स इनवॉइस एवं बिल प्रीव्यू (Tax Invoice Preview) — {orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow transition-all hover:scale-105 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट करें (Print Bill / Save PDF)</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">बंद करें</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actual A4 Printable Sheet */}
      <div className="py-6 px-3 sm:px-6 bg-gray-100 min-h-screen print:bg-white print:p-0 print:min-h-0">
        <div
          id="printable-tax-invoice"
          className="printable-invoice-container bg-white max-w-[210mm] mx-auto p-6 sm:p-10 border border-gray-300 shadow-xl rounded-2xl print:border-none print:shadow-none print:rounded-none print:p-0 print:m-0 text-gray-900 font-sans"
        >
          {/* Header Strip */}
          <div className="border-b-2 border-emerald-900 pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-900 text-white flex items-center justify-center font-serif font-black text-lg">
                    माँ
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-emerald-950 tracking-tight leading-none">
                      माँ आयुर्वेदिक (Maa Ayurvedic)
                    </h1>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                      100% शुद्ध आयुर्वेदिक व प्राकृतिक त्वचा उपचार
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-600 mt-2 space-y-0.5">
                  <p>
                    <strong>निर्माता / विपणक:</strong> माँ आयुर्वेदिक हर्बल्स प्रा. लि.
                  </p>
                  <p>42, हर्बल एवेन्यू, ऑर्गेनिक पार्क, इंदौर, मध्य प्रदेश - 452001</p>
                  <p>
                    <strong>आयुष लाइसेंस सं. (AYUSH Mfg Lic No.):</strong> MP/25D/19/712
                  </p>
                  <p>
                    <strong>हेल्पलाइन:</strong> +91 {BRAND_INFO.whatsappNumber} |{" "}
                    <strong>ईमेल:</strong> {BRAND_INFO.supportEmail}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block bg-emerald-900 text-white text-xs font-black px-3 py-1 rounded tracking-wider uppercase mb-1">
                  मूल्य बीजक / RETAIL INVOICE
                </span>
                <p className="text-xs font-bold text-gray-800 mt-1">
                  इनवॉइस सं.: <span className="font-mono text-emerald-950 font-black">INV-{orderNumber}</span>
                </p>
                <p className="text-xs text-gray-600">
                  ऑर्डर संदर्भ: <span className="font-mono font-bold">{orderNumber}</span>
                </p>
                <p className="text-xs text-gray-600">
                  दिनांक: <span className="font-semibold">{formattedDate}</span> ({formattedTime})
                </p>
              </div>
            </div>
          </div>

          {/* Bill-To and Shipping Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-200 text-xs">
            {/* Customer Details */}
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/60 space-y-1">
              <span className="font-black text-emerald-950 uppercase tracking-wider text-[10px] block border-b border-gray-200 pb-1">
                बिल प्राप्तकर्ता / Shipped To:
              </span>
              <p className="text-sm font-bold text-gray-900 pt-0.5">
                {order.customerName || address?.fullName || "सम्मानित ग्राहक"}
              </p>
              {(order.customerPhone || address?.phone) && (
                <p className="text-gray-700">
                  <strong>मोबाईल नं.:</strong> +91 {order.customerPhone || address?.phone}
                </p>
              )}
              {order.customerEmail && (
                <p className="text-gray-700">
                  <strong>ईमेल:</strong> {order.customerEmail}
                </p>
              )}
              <p className="text-gray-700 pt-0.5 leading-relaxed">
                <strong>डिलीवरी पता:</strong>{" "}
                {[address?.flatHouseNo, address?.streetLocality, address?.landmark]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-gray-800 font-semibold">
                {[address?.city, address?.state].filter(Boolean).join(", ")} - {address?.pincode}
              </p>
            </div>

            {/* Payment & Logistics Metadata */}
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/60 space-y-1">
              <span className="font-black text-emerald-950 uppercase tracking-wider text-[10px] block border-b border-gray-200 pb-1">
                भुगतान एवं शिपमेंट विवरण:
              </span>
              <div className="pt-0.5 space-y-1 text-gray-700">
                <p className="flex justify-between">
                  <span>भुगतान का माध्यम:</span>
                  <strong className="text-gray-900">
                    {isCod ? "कैश ऑन डिलीवरी (COD)" : "ऑनलाइन भुगतान (Razorpay)"}
                  </strong>
                </p>
                <p className="flex justify-between">
                  <span>भुगतान स्थिति:</span>
                  <span
                    className={`font-black uppercase px-2 py-0.5 rounded text-[10px] ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {isPaid ? "सत्यापित (PAID)" : "डिलीवरी पर देय (DUE ON DELIVERY)"}
                  </span>
                </p>
                {order.razorpayPaymentId && (
                  <p className="flex justify-between font-mono text-[11px]">
                    <span>पेमेंट ID:</span>
                    <span>{order.razorpayPaymentId}</span>
                  </p>
                )}
                <p className="flex justify-between">
                  <span>कूरियर पार्टनर:</span>
                  <span className="font-semibold text-gray-900">
                    {order.courierName || "Delhivery Express"}
                  </span>
                </p>
                <p className="flex justify-between font-mono text-[11px]">
                  <span>AWB / ट्रैकिंग सं.:</span>
                  <span className="font-bold text-emerald-800">
                    {order.trackingNumber || `DLV-${orderNumber.replace(/[^0-9]/g, "")}`}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Goods Table */}
          <div className="py-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-emerald-950 text-white font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 rounded-l">क्र.</th>
                  <th className="py-2.5 px-3">उत्पाद का विवरण (Description of Goods)</th>
                  <th className="py-2.5 px-2 text-center">HSN कोड</th>
                  <th className="py-2.5 px-2 text-center">मात्रा</th>
                  <th className="py-2.5 px-3 text-right">दर (Rate)</th>
                  <th className="py-2.5 px-3 text-right rounded-r">कुल राशि (Amount)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((it, idx) => {
                  const unitPrice = (it.unitPricePaise || it.totalPricePaise) / 100;
                  const itemTotal = (it.totalPricePaise || it.unitPricePaise * it.quantity) / 100;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 text-gray-500 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-900">{it.title}</p>
                        <p className="text-[10px] text-gray-500">
                          शुद्ध वजन: 50g प्रति जार | आयुर्वेदिक स्वामित्व औषधि | 100% प्राकृतिक
                        </p>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-gray-600">30049011</td>
                      <td className="py-3 px-2 text-center font-bold text-gray-900">
                        {it.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-gray-700">
                        ₹{unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                        ₹{itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Totals & Grand Summary */}
          <div className="border-t-2 border-gray-200 pt-3 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
            {/* Amount In Words & Declaration */}
            <div className="space-y-2 flex-1 max-w-md">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">
                  कुल राशि अक्षरों में (Amount in Words):
                </span>
                <p className="font-bold text-gray-900 text-xs mt-0.5">
                  {numberToWordsIndian(totalRupees)}
                </p>
              </div>

              <div className="text-[10px] text-gray-500 space-y-0.5 leading-relaxed">
                <p className="font-semibold text-gray-700">नियम व शर्तें (Terms & Conditions):</p>
                <p>1. यह एक कम्प्यूटरीकृत टैक्स बीजक है, जिस पर किसी भौतिक हस्ताक्षर की आवश्यकता नहीं है।</p>
                <p>2. सभी औषधीय उत्पाद आयुष मंत्रालय के दिशानिर्देशानुसार 100% प्राकृतिक घटकों से निर्मित हैं।</p>
                <p>3. 30 दिन की मनी-बैक गारंटी हमारी अधिकृत वेबसाइट की शर्तों के अधीन मान्य है।</p>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>कुल उत्पाद मूल्य (Subtotal):</span>
                <span className="font-mono font-semibold text-gray-800">
                  ₹{(subtotalPaise / 100).toFixed(2)}
                </span>
              </div>

              {discountPaise > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>कूपन / विशेष छूट (Discount):</span>
                  <span className="font-mono">-₹{(discountPaise / 100).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>डिलीवरी व हैंडलिंग (Shipping):</span>
                <span className="font-bold text-emerald-800">
                  {shippingPaise === 0 ? "मुफ्त (FREE)" : `₹${(shippingPaise / 100).toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>लागू कर (GST @ 5% शामिल):</span>
                <span className="font-mono">समावेशी (Inclusive)</span>
              </div>

              <div className="border-t-2 border-emerald-900 pt-2 flex justify-between items-baseline text-sm font-black text-gray-900">
                <span className="text-emerald-950 font-black">कुल देय राशि (Total):</span>
                <span className="text-base text-emerald-900 font-black font-mono">
                  ₹{totalRupees.toFixed(2)}
                </span>
              </div>

              {/* Status Ribbon in print */}
              <div
                className={`mt-2 p-2 rounded text-center font-bold text-xs ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-amber-50 text-amber-950 border border-amber-200"
                }`}
              >
                {isPaid
                  ? "✓ भुगतान सफलतापूर्वक प्राप्त (Paid Online)"
                  : `कैश ऑन डिलीवरी — डिलीवरी पर ₹${totalRupees.toFixed(0)} देय`}
              </div>
            </div>
          </div>

          {/* Authorized Signature Strip */}
          <div className="border-t border-gray-200 mt-6 pt-5 flex justify-between items-end text-xs">
            <div className="space-y-1 text-[11px] text-gray-500">
              <p className="flex items-center gap-1 font-semibold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                100% शुद्ध आयुर्वेदिक संतुष्टि गारंटी
              </p>
              <p>कस्टमर केयर: +91 {BRAND_INFO.whatsappNumber} | www.maaayurvedic.store</p>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-gray-400 pb-1 w-44 text-center">
                <span className="font-serif italic font-bold text-emerald-950 text-xs">
                  Maa Ayurvedic Herbals
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">
                अधिकृत हस्ताक्षरकर्ता (Authorized Signatory)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

