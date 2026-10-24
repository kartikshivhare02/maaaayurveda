"use client";

import React from "react";
import Link from "next/link";
import { useProductStore } from "@/lib/store/productStore";
import { BRAND_INFO } from "@/lib/data/mockData";
import { HeroProductGallery } from "@/components/HeroProductGallery";
import { ComboSelector } from "@/components/ComboSelector";
import { DietaryPrecautions } from "@/components/DietaryPrecautions";
import {
  ShieldCheck,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Award,
  Truck,
  Building,
  Calendar,
  FileCheck,
} from "lucide-react";

export default function ProductDetailPage() {
  const { product } = useProductStore();

  return (
    <div className="bg-[#fcfcfc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">
            होम
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{product.name} {product.netQty}</span>
        </nav>

        {/* Top Product Hero: Sliding Primary-Secondary Image Gallery & Buy Options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Gallery with Sliding Primary & Secondary Selection */}
          <div className="lg:col-span-5 space-y-6">
            <HeroProductGallery />
          </div>

          {/* Product Overview & Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                {product.classification}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                {product.hindiTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Regulatory Net Qty & Category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 block">शुद्ध मात्रा (Net Qty):</span>
                <span className="font-bold text-gray-900 text-sm">{product.netQty}</span>
              </div>
              <div>
                <span className="text-gray-500 block">विक्रय मूल्य (Price):</span>
                <span className="font-bold text-emerald-800 text-sm">
                  ₹{product.pricePaise / 100}{" "}
                  <span className="text-gray-400 line-through text-xs font-normal">
                    ₹{product.mrpPaise / 100}
                  </span>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-500 block">आयुष लाइसेंस सं.:</span>
                <span className="font-bold text-gray-900 text-sm">
                  {BRAND_INFO.licenseNo}
                </span>
              </div>
            </div>

            {/* Interactive Pack Selector */}
            <ComboSelector />
          </div>
        </div>

        {/* Legal Metrology & Detailed Compliance Specifications */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-xs mb-16 space-y-6 sm:space-y-8">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-700" />
              विस्तृत तकनीकी एवं कानूनी मेट्रोलॉजी विनिर्देश (Compliance Details)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              उपभोक्ता संरक्षण (ई-कॉमर्स) नियम, 2020 एवं औषधि व प्रसाधन सामग्री नियमों के अंतर्गत अनिवार्य प्रकटीकरण
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {/* Ingredients (Transcribed from label) */}
            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                <Leaf className="w-4 h-4 text-emerald-600" />
                सक्रिय सामग्री एवं सांद्रता (प्रति 100g)
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {product.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between border-b border-gray-200/50 pb-1">
                    <span>{ing.hindiName}</span>
                    <span className="font-bold text-emerald-800">{ing.percentage}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Manufacturer Details */}
            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                <Building className="w-4 h-4 text-emerald-600" />
                निर्माता विवरण (Manufacturer)
              </h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">{product.manufacturer.name}</p>
                <p>{product.manufacturer.address}</p>
                <p className="pt-1 text-gray-500">
                  लाइसेंस नंबर:{" "}
                  <span className="font-mono text-gray-900">
                    {product.manufacturer.licenseNo}
                  </span>
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200/60 text-xs">
                <p className="font-semibold text-gray-900">मार्केटर (विपणनकर्ता):</p>
                <p>{product.marketer.name}</p>
                <p>{product.marketer.address}</p>
                <p>हेल्पलाइन: {product.marketer.customerCarePhone}</p>
              </div>
            </div>

            {/* Batch & Expiry Info */}
            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-emerald-600" />
                बैच व एक्सपायरी विवरण
              </h3>
              <div className="text-xs text-gray-700 space-y-2">
                <div className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span>बैच संख्या (Batch No.):</span>
                  <span className="font-mono font-bold text-gray-900">
                    {product.batchInfo.batchNumber}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span>निर्माण माह व वर्ष:</span>
                  <span className="font-bold text-gray-900">{product.batchInfo.mfgDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span>अवसान माह व वर्ष (Expiry):</span>
                  <span className="font-bold text-emerald-800">
                    {product.batchInfo.expiryDate}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 pt-1">
                  शेल्फ लाइफ: <span className="text-gray-900">{product.batchInfo.shelfLife}</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  संग्रहण: {product.storage}
                </div>
              </div>
            </div>
          </div>

          {/* Precautions and Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <h4 className="text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                सावधानियां (Precautions)
              </h4>
              <ul className="text-xs text-amber-900 space-y-1 list-disc pl-4">
                {product.precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/70 space-y-2">
              <h4 className="text-xs font-bold text-red-950 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                चेतावनी एवं अस्वीकरण (Warnings & Referral)
              </h4>
              <ul className="text-xs text-red-900 space-y-1 list-disc pl-4">
                {product.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dietary Rules / परहेज गाइड */}
        <DietaryPrecautions />
      </div>
    </div>
  );
}
