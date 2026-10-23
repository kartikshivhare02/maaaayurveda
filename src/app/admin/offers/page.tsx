"use client";

import React, { useState } from "react";
import { BUNDLE_OFFERS, COUPONS } from "@/lib/data/mockData";
import { BundleOffer, Coupon } from "@/types";
import { Tag, Sparkles, Plus, Trash2, Edit, CheckCircle } from "lucide-react";

export default function AdminOffersPage() {
  const [bundles, setBundles] = useState<BundleOffer[]>(BUNDLE_OFFERS);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);

  // New coupon form state
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(100);
  const [newMinOrder, setNewMinOrder] = useState(800);
  const [newDesc, setNewDesc] = useState("");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon: Coupon = {
      code: newCode.trim().toUpperCase(),
      discountType: "fixed",
      discountValue: newDiscount * 100, // paise
      minOrderPaise: newMinOrder * 100,
      expiryDate: "2027-12-31",
      isActive: true,
      description: newDesc || `₹${newMinOrder} के ऑर्डर पर ₹${newDiscount} की छूट`,
    };

    setCoupons([coupon, ...coupons]);
    setNewCode("");
    setNewDesc("");
  };

  const toggleCoupon = (code: string) => {
    setCoupons(
      coupons.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          कॉम्बो ऑफर एवं कूपन प्रबंधन (Offers & Coupons)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          बंडल छूट, कॉम्बो पैक मूल्य और डिस्काउंट कूपन कोड को कॉन्फ़िगर करें।
        </p>
      </div>

      {/* 1. Bundles Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          सक्रिय कॉम्बो पैक (Bundle Offers)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">पैक का नाम</th>
                <th className="py-3 px-4">पैक संख्या</th>
                <th className="py-3 px-4">विक्रय मूल्य (₹)</th>
                <th className="py-3 px-4">एमआरपी (₹)</th>
                <th className="py-3 px-4">बचत</th>
                <th className="py-3 px-4">टैग</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bundles.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-900">{b.title}</td>
                  <td className="py-3 px-4 text-gray-700">{b.packCount}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    ₹{b.pricePaise / 100}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400 line-through">
                    ₹{b.mrpPaise / 100}
                  </td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">
                    ₹{b.savingsPaise / 100} ({b.savingsPercentage}%)
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {b.hindiTag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Coupons Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-700" />
          डिस्काउंट कूपन कोड (Promo Coupons)
        </h2>

        {/* Add Coupon Form */}
        <form onSubmit={handleAddCoupon} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase">नया कूपन कोड बनाएं</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">कूपन कोड</label>
              <input
                type="text"
                required
                placeholder="उदा. SAVE100"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono font-bold uppercase focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-1">छूट राशि (₹)</label>
              <input
                type="number"
                required
                value={newDiscount}
                onChange={(e) => setNewDiscount(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-1">न्यूनतम ऑर्डर (₹)</label>
              <input
                type="number"
                required
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl transition-colors shadow-xs"
              >
                + कूपन जोड़ें
              </button>
            </div>
          </div>
        </form>

        {/* Active Coupons List */}
        <div className="space-y-3">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="p-4 rounded-2xl border border-gray-200/80 bg-white flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                  {c.code}
                </span>
                <div>
                  <p className="font-bold text-gray-900">
                    ₹{c.discountValue / 100} की सीधी छूट (Min ₹{c.minOrderPaise / 100})
                  </p>
                  <p className="text-xs text-gray-500">{c.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleCoupon(c.code)}
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    c.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.isActive ? "सक्रिय (Active)" : "निष्क्रिय"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
