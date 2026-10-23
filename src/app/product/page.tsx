import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MAIN_PRODUCT, BRAND_INFO, BUNDLE_OFFERS } from "@/lib/data/mockData";
import { ComboSelector } from "@/components/ComboSelector";
import { PincodeChecker } from "@/components/PincodeChecker";
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

export const metadata = {
  title: "माँ आयुर्वेदिक क्रीम — घटक, उपयोग विधि एवं संपूर्ण उत्पाद विवरण",
  description:
    "माँ आयुर्वेदिक क्रीम 50g: संपूर्ण सामग्री, निर्माण, बैच, कानूनी मेट्रोलॉजी एवं सुरक्षित उपयोग निर्देश।",
};

export default function ProductDetailPage() {
  return (
    <div className="bg-[#fcfcfc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">
            होम
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{MAIN_PRODUCT.name} 50 ग्राम</span>
        </nav>

        {/* Top Product Hero: Image Gallery & Buy Options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
              <Image
                src={MAIN_PRODUCT.images[0]}
                alt={MAIN_PRODUCT.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {MAIN_PRODUCT.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-xs bg-white"
                >
                  <Image
                    src={img}
                    alt={`माँ आयुर्वेदिक क्रीम विवरण ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <PincodeChecker />
          </div>

          {/* Product Overview & Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                {MAIN_PRODUCT.classification}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                {MAIN_PRODUCT.hindiTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                {MAIN_PRODUCT.description}
              </p>
            </div>

            {/* Regulatory Net Qty & Category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 block">शुद्ध मात्रा (Net Qty):</span>
                <span className="font-bold text-gray-900 text-sm">{MAIN_PRODUCT.netQty}</span>
              </div>
              <div>
                <span className="text-gray-500 block">वर्गीकरण:</span>
                <span className="font-bold text-gray-900 text-sm">आयुर्वेदिक औषधि</span>
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
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs mb-16 space-y-8">
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
            {/* Ingredients */}
            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                <Leaf className="w-4 h-4 text-emerald-600" />
                सक्रिय सामग्री एवं सांद्रता
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {MAIN_PRODUCT.ingredients.map((ing, i) => (
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
                <p className="font-semibold text-gray-900">{MAIN_PRODUCT.manufacturer.name}</p>
                <p>{MAIN_PRODUCT.manufacturer.address}</p>
                <p className="pt-1 text-gray-500">
                  लाइसेंस नंबर:{" "}
                  <span className="font-mono text-gray-900">
                    {MAIN_PRODUCT.manufacturer.licenseNo}
                  </span>
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200/60 text-xs">
                <p className="font-semibold text-gray-900">मार्केटर (विपणनकर्ता):</p>
                <p>{MAIN_PRODUCT.marketer.name}</p>
                <p>{MAIN_PRODUCT.marketer.address}</p>
                <p>हेल्पलाइन: {MAIN_PRODUCT.marketer.customerCarePhone}</p>
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
                    {MAIN_PRODUCT.batchInfo.batchNumber}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span>निर्माण माह व वर्ष:</span>
                  <span className="font-bold text-gray-900">{MAIN_PRODUCT.batchInfo.mfgDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span>अवसान तिथि (Expiry):</span>
                  <span className="font-bold text-red-600">
                    {MAIN_PRODUCT.batchInfo.expiryDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>शेल्फ लाइफ:</span>
                  <span className="text-gray-900">{MAIN_PRODUCT.batchInfo.shelfLife}</span>
                </div>
                <p className="pt-2 text-[11px] text-gray-500">
                  संग्रहण: {MAIN_PRODUCT.storage}
                </p>
              </div>
            </div>
          </div>

          {/* Precautions & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-2">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                सावधानियां एवं निर्देश (Precautions)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-amber-950">
                {MAIN_PRODUCT.precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/70 text-xs space-y-2">
              <h4 className="font-bold text-red-900 flex items-center gap-1.5 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                वैधानिक चेतावनियां (Statutory Warnings)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-red-950">
                {MAIN_PRODUCT.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dietary Rules & Packaging Guide */}
        <DietaryPrecautions />
      </div>
    </div>
  );
}
