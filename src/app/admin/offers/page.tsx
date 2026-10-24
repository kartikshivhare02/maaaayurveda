"use client";

import React, { useState, useEffect } from "react";
import { BUNDLE_OFFERS, COUPONS } from "@/lib/data/mockData";
import { BundleOffer, Coupon } from "@/types";
import { Tag, Sparkles, Plus, Trash2, Edit, CheckCircle2, Save } from "lucide-react";

export default function AdminOffersPage() {
  const [bundles, setBundles] = useState<BundleOffer[]>(BUNDLE_OFFERS);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New coupon form state
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(100);
  const [newMinOrder, setNewMinOrder] = useState(800);
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    try {
      const savedBundles = localStorage.getItem("maa_bundle_offers");
      if (savedBundles) {
        const parsed = JSON.parse(savedBundles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBundles(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleBundlePriceChange = (
    id: string,
    field: "priceRupees" | "mrpRupees" | "title" | "hindiTag",
    value: string | number
  ) => {
    setBundles((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b };
        if (field === "priceRupees") {
          updated.pricePaise = Math.round(Number(value) * 100);
        } else if (field === "mrpRupees") {
          updated.mrpPaise = Math.round(Number(value) * 100);
        } else if (field === "title") {
          updated.title = String(value);
        } else if (field === "hindiTag") {
          updated.hindiTag = String(value);
        }

        // Recalculate savings
        updated.savingsPaise = Math.max(0, updated.mrpPaise - updated.pricePaise);
        updated.savingsPercentage =
          updated.mrpPaise > 0
            ? Math.round((updated.savingsPaise / updated.mrpPaise) * 100)
            : 0;

        return updated;
      })
    );
  };

  const handleSaveBundles = () => {
    try {
      localStorage.setItem("maa_bundle_offers", JSON.stringify(bundles));
      window.dispatchEvent(new Event("maa_bundles_updated"));
      showToast("कॉम्बो पैक विवरण एवं मूल्य सफलतापूर्वक अपडेट कर दिए गए!");
    } catch {
      showToast("सहेजने में त्रुटि हुई।");
    }
  };

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
    showToast(`कूपन कोड ${coupon.code} सफलतापूर्वक जोड़ा गया!`);
  };

  const toggleCoupon = (code: string) => {
    setCoupons(
      coupons.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            कॉम्बो ऑफर एवं कूपन प्रबंधन (Offers & Coupons)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            बंडल छूट, कॉम्बो पैक मूल्य और डिस्काउंट कूपन कोड को कॉन्फ़िगर करें।
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveBundles}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>कॉम्बो पैक परिवर्तन सुरक्षित करें</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* 1. Bundles Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            सक्रिय कॉम्बो पैक एवं मूल्य (Manage Bundle Offers)
          </h2>
          <span className="text-xs text-gray-500">
            मूल्य या एमआरपी सीधे संपादित करें
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-3">पैक का नाम (Title)</th>
                <th className="py-3 px-3">मात्रा (Packs)</th>
                <th className="py-3 px-3">विक्रय मूल्य (₹ Price)</th>
                <th className="py-3 px-3">एमआरपी (₹ MRP)</th>
                <th className="py-3 px-3">बचत</th>
                <th className="py-3 px-3">हाईलाइट टैग</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bundles.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) =>
                        handleBundlePriceChange(b.id, "title", e.target.value)
                      }
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-bold text-gray-900 text-xs w-full min-w-[140px]"
                    />
                  </td>
                  <td className="py-3 px-3 text-gray-700 font-bold">{b.packCount} जार</td>
                  <td className="py-3 px-3">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={b.pricePaise / 100}
                        onChange={(e) =>
                          handleBundlePriceChange(
                            b.id,
                            "priceRupees",
                            Number(e.target.value)
                          )
                        }
                        className="bg-emerald-50/70 border border-emerald-300 font-black text-emerald-900 rounded-lg pl-6 pr-2 py-1 text-xs w-full"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={b.mrpPaise / 100}
                        onChange={(e) =>
                          handleBundlePriceChange(
                            b.id,
                            "mrpRupees",
                            Number(e.target.value)
                          )
                        }
                        className="bg-gray-50 border border-gray-200 font-bold text-gray-600 rounded-lg pl-6 pr-2 py-1 text-xs w-full"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-bold text-xs whitespace-nowrap">
                    ₹{b.savingsPaise / 100} ({b.savingsPercentage}% OFF)
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={b.hindiTag || ""}
                      onChange={(e) =>
                        handleBundlePriceChange(b.id, "hindiTag", e.target.value)
                      }
                      className="bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded-lg px-2 py-1 text-[11px] w-28"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSaveBundles}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>परिवर्तन सहेजें (Save Changes)</span>
          </button>
        </div>
      </div>

      {/* 2. Coupons Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-700" />
          डिस्काउंट कूपन कोड (Promo Coupons)
        </h2>

        {/* Add Coupon Form */}
        <form
          onSubmit={handleAddCoupon}
          className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-3"
        >
          <h3 className="text-xs font-bold text-gray-700 uppercase">
            नया कूपन कोड बनाएं
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-gray-600 mb-1">कूपन कोड (उदा. MAA100)</label>
              <input
                type="text"
                required
                placeholder="MAA100"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 uppercase font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">छूट राशि (₹ Discount)</label>
              <input
                type="number"
                required
                min={10}
                value={newDiscount}
                onChange={(e) => setNewDiscount(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">न्यूनतम ऑर्डर मूल्य (₹ Min Order)</label>
              <input
                type="number"
                required
                min={0}
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">विवरण (Description)</label>
              <input
                type="text"
                placeholder="उदा. स्पेशल छूट"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-[#0b3d2e] hover:bg-[#07281e] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>कूपन जोड़ें</span>
          </button>
        </form>

        {/* Coupons List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-2.5 px-3">कोड</th>
                <th className="py-2.5 px-3">छूट (₹)</th>
                <th className="py-2.5 px-3">न्यूनतम ऑर्डर</th>
                <th className="py-2.5 px-3">स्थिति</th>
                <th className="py-2.5 px-3">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                    {c.code}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-gray-900">
                    ₹{c.discountValue / 100}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    ₹{c.minOrderPaise / 100}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.isActive ? "सक्रिय (Active)" : "निष्क्रिय"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => toggleCoupon(c.code)}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      {c.isActive ? "निष्क्रिय करें" : "सक्रिय करें"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
