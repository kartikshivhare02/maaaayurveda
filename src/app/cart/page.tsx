"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    subtotalPaise,
    discountPaise,
    finalTotalPaise,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode);
    setCouponMessage({
      text: res.message,
      isError: !res.success,
    });
  };

  const totalMrpPaise = items.reduce((acc, i) => acc + i.mrpPaise, 0);
  const totalSavingsPaise = totalMrpPaise - finalTotalPaise;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-700">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          आपकी कार्ट अभी खाली है
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
          माँ आयुर्वेदिक क्रीम के विशेष कॉम्बो ऑफर देखें और अपनी त्वचा को दाद, खाज व खुजली से प्राकृतिक राहत दिलाएं।
        </p>
        <Link
          href="/#offers"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-all"
        >
          <span>कॉम्बो ऑफर देखें (View Offers)</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            आपकी शॉपिंग कार्ट (Shopping Cart)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            कृपया अपने चुने हुए कॉम्बो और ऑर्डर विवरण की समीक्षा करें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.bundleId}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex gap-4 items-center justify-between"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    कुल {item.packCount} पैक (50 ग्राम प्रत्येक)
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      ₹{item.totalPricePaise / 100}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.mrpPaise / 100}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.bundleId, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 font-bold text-xs text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.bundleId, item.quantity + 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.bundleId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="आइटम हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust badge under items */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                <strong>मुफ्त सुरक्षित शिपिंग:</strong> आपके ऑर्डर पर कोई डिलीवरी शुल्क नहीं लिया जाएगा।
              </span>
            </div>
          </div>

          {/* Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-5">
            {/* Coupon Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-emerald-600" />
                डिस्काउंट कूपन कोड लागू करें
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-emerald-900">
                      कूपन &apos;{appliedCoupon.code}&apos; लागू है
                    </span>
                    <p className="text-emerald-700">{appliedCoupon.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline font-semibold ml-2"
                  >
                    हटाएं
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="कूपन कोड (उदा. MAA100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    लागू करें
                  </button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    couponMessage.isError ? "text-red-600" : "text-emerald-700"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
                ऑर्डर सारांश (Order Summary)
              </h3>

              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>मूल एमआरपी (Total MRP):</span>
                  <span className="line-through text-gray-400">₹{totalMrpPaise / 100}</span>
                </div>
                <div className="flex justify-between">
                  <span>सबटोटल (Subtotal):</span>
                  <span className="font-medium text-gray-900">₹{subtotalPaise / 100}</span>
                </div>
                {discountPaise > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>कूपन छूट (Coupon Discount):</span>
                    <span>−₹{discountPaise / 100}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>डिलीवरी शुल्क (Delivery):</span>
                  <span className="text-emerald-700 font-bold uppercase text-xs">मुफ्त (Free)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="font-black text-gray-900 text-lg">कुल देय राशि:</span>
                  <p className="text-[11px] text-gray-500">(सभी कर सहित | All taxes incl.)</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-800">
                    ₹{finalTotalPaise / 100}
                  </span>
                  {totalSavingsPaise > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold">
                      (आपकी बचत: ₹{totalSavingsPaise / 100})
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-base"
              >
                <span>सुरक्षित चेकआउट करें</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="pt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit SSL सुरक्षित चेकआउट | 100% मनी-बैक गारंटी</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
