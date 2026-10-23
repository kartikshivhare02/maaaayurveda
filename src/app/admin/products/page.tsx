"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MAIN_PRODUCT } from "@/lib/data/mockData";
import { Package, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [product, setProduct] = useState({
    name: MAIN_PRODUCT.name,
    hindiTitle: MAIN_PRODUCT.hindiTitle,
    subtitle: MAIN_PRODUCT.subtitle,
    description: MAIN_PRODUCT.description,
    priceRupees: MAIN_PRODUCT.pricePaise / 100,
    mrpRupees: MAIN_PRODUCT.mrpPaise / 100,
    netQty: MAIN_PRODUCT.netQty,
    stockCount: MAIN_PRODUCT.stockCount,
    inStock: MAIN_PRODUCT.inStock,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            उत्पाद विवरण एवं स्टॉक प्रबंधन (Product Management)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            माँ आयुर्वेदिक क्रीम के मूल्य, एमआरपी, हिंदी विवरण एवं स्टॉक मात्रा को अपडेट करें।
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>उत्पाद विवरण सफलतापूर्वक अपडेट कर दिया गया है!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
            <Image
              src={MAIN_PRODUCT.images[0]}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
            <p className="text-xs text-emerald-700 font-semibold">{product.netQty} जार</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              उत्पाद का हिंदी शीर्षक (Hindi Title)
            </label>
            <input
              type="text"
              required
              value={product.hindiTitle}
              onChange={(e) => setProduct({ ...product, hindiTitle: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              टैगलाइन व उपशीर्षक (Tagline / Subtitle)
            </label>
            <input
              type="text"
              value={product.subtitle}
              onChange={(e) => setProduct({ ...product, subtitle: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                विक्रय मूल्य (Selling Price in ₹)
              </label>
              <input
                type="number"
                required
                value={product.priceRupees}
                onChange={(e) =>
                  setProduct({ ...product, priceRupees: Number(e.target.value) })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                अधिकतम खुदरा मूल्य (MRP in ₹)
              </label>
              <input
                type="number"
                required
                value={product.mrpRupees}
                onChange={(e) =>
                  setProduct({ ...product, mrpRupees: Number(e.target.value) })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                उपलब्ध स्टॉक (Units in Stock)
              </label>
              <input
                type="number"
                required
                value={product.stockCount}
                onChange={(e) =>
                  setProduct({ ...product, stockCount: Number(e.target.value) })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              विस्तृत विवरण (Description)
            </label>
            <textarea
              rows={4}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.inStock}
                onChange={(e) => setProduct({ ...product, inStock: e.target.checked })}
                className="text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <span className="font-semibold text-gray-800">
                स्टॉक में उपलब्ध रखें (Show In-Stock on Storefront)
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>परिवर्तन सुरक्षित करें (Save Changes)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
