"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useProductStore } from "@/lib/store/productStore";
import { ProductImageItem } from "@/types";
import {
  Package,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Upload,
  Info,
} from "lucide-react";

export default function AdminProductsPage() {
  const {
    product,
    images,
    slidingImages,
    updateProduct,
    setPrimaryImage,
    addImage,
    removeImage,
    moveImage,
    resetToDefault,
  } = useProductStore();

  const [activeTab, setActiveTab] = useState<"details" | "images">("details");

  // Form State for Product Details
  const [formData, setFormData] = useState({
    name: product.name,
    hindiTitle: product.hindiTitle,
    subtitle: product.subtitle,
    tagline: product.tagline,
    description: product.description,
    priceRupees: product.pricePaise / 100,
    mrpRupees: product.mrpPaise / 100,
    netQty: product.netQty,
    stockCount: product.stockCount,
    inStock: product.inStock,
    ingredients: product.ingredients,
  });

  // State for Add Image Modal / Form
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("/images/product.jpeg");
  const [newImageLabel, setNewImageLabel] = useState("");
  const [newImageSubtitle, setNewImageSubtitle] = useState("");
  const [newImageIsPrimary, setNewImageIsPrimary] = useState(false);

  // Live Slider Preview State
  const [previewIdx, setPreviewIdx] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct({
      name: formData.name,
      hindiTitle: formData.hindiTitle,
      subtitle: formData.subtitle,
      tagline: formData.tagline,
      description: formData.description,
      pricePaise: Math.round(Number(formData.priceRupees) * 100),
      mrpPaise: Math.round(Number(formData.mrpRupees) * 100),
      netQty: formData.netQty,
      stockCount: Number(formData.stockCount),
      inStock: formData.inStock,
      ingredients: formData.ingredients,
    });
    showToast("उत्पाद विवरण, मूल्य एवं स्टॉक सफलतापूर्वक अपडेट कर दिया गया!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    addImage({
      url: newImageUrl.trim(),
      label: newImageLabel.trim() || `उत्पाद फोटो ${images.length + 1}`,
      subtitle: newImageSubtitle.trim() || "अतिरिक्त फोटो",
      isPrimary: newImageIsPrimary,
      type: newImageIsPrimary ? "primary" : "secondary",
    });

    setIsAddImageOpen(false);
    setNewImageLabel("");
    setNewImageSubtitle("");
    setNewImageIsPrimary(false);
    showToast("नयी फोटो सफलतापूर्वक जोड़ी गई!");
  };

  const handleIngredientChange = (
    index: number,
    field: "hindiName" | "percentage" | "purpose",
    val: string
  ) => {
    const updated = [...formData.ingredients];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, ingredients: updated });
  };

  const savingsRupees = Math.max(0, formData.mrpRupees - formData.priceRupees);
  const savingsPct = formData.mrpRupees > 0
    ? Math.round((savingsRupees / formData.mrpRupees) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            उत्पाद एवं फोटो प्रबंधन (Product & Images Management)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            मूल्य, मात्रा (Quantity), स्टॉक, घटक एवं स्लाइडिंग प्राइमरी/सेकेंडरी फोटो नियंत्रित करें।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("क्या आप वाकई डिफ़ॉल्ट डेटा रीसेट करना चाहते हैं?")) {
              resetToDefault();
              showToast("डेटा डिफ़ॉल्ट पर रीसेट कर दिया गया!");
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>डिफ़ॉल्ट रीसेट करें</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Modern Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "details"
              ? "bg-[#0b3d2e] text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>उत्पाद विवरण एवं मूल्य (Price & Details)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("images")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "images"
              ? "bg-[#0b3d2e] text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>फोटो व स्लाइडिंग प्राइमरी/सेकेंडरी (Images & Slider)</span>
          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
            {images.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PRODUCT DETAILS & PRICING */}
      {activeTab === "details" && (
        <form
          onSubmit={handleProductSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                मूल्य, मात्रा व स्टॉक सेटिंग्स (Live Pricing & Stock)
              </h2>
              <p className="text-xs text-gray-500">
                यहाँ किए गए बदलाव वेबसाइट के होमपेज, प्रोडक्ट पेज व कार्ट पर तुरंत लागू होंगे।
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  उत्पाद का नाम व मुख्य शीर्षक (Product Name)
                </label>
                <input
                  type="text"
                  required
                  value={formData.hindiTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, hindiTitle: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  टैगलाइन व उपशीर्षक (Subtitle / Tagline)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Price, MRP, Net Quantity & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  विक्रय मूल्य (Selling Price in ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.priceRupees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceRupees: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-gray-900 font-black text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  अधिकतम खुदरा मूल्य (MRP in ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.mrpRupees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mrpRupees: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-gray-900 font-black text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  छूट: ₹{savingsRupees} ({savingsPct}% OFF)
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  उत्पाद मात्रा (Net Quantity) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. 50 ग्राम, 100 ग्राम"
                  value={formData.netQty}
                  onChange={(e) =>
                    setFormData({ ...formData, netQty: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-gray-500">जार या पैक साइज</span>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  उपलब्ध स्टॉक (Units in Stock) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stockCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockCount: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.checked })
                    }
                    className="text-emerald-600 rounded"
                  />
                  <span className="text-[11px] font-semibold text-gray-700">
                    स्टॉक में उपलब्ध
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                विस्तृत विवरण (Description in Hindi)
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              ></textarea>
            </div>

            {/* Ingredients Table (Transcribed from label) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block font-bold text-gray-900">
                  सत्यापित घटक एवं अनुपात (Verified Ingredients from Label — Per 100g)
                </label>
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
                  लेबल से सत्यापित
                </span>
              </div>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">घटक का नाम (Ingredient)</th>
                        <th className="py-2.5 px-3 w-28">मात्रा (% Qty)</th>
                        <th className="py-2.5 px-3">औषधीय कार्य (Purpose)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.ingredients.map((ing, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ing.hindiName}
                              onChange={(e) =>
                                handleIngredientChange(idx, "hindiName", e.target.value)
                              }
                              className="w-full bg-transparent font-medium text-gray-900 focus:outline-none focus:bg-white px-1 py-0.5 rounded border border-transparent focus:border-gray-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ing.percentage || ""}
                              onChange={(e) =>
                                handleIngredientChange(idx, "percentage", e.target.value)
                              }
                              className="w-full bg-transparent font-bold text-emerald-800 focus:outline-none focus:bg-white px-1 py-0.5 rounded border border-transparent focus:border-gray-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ing.purpose}
                              onChange={(e) =>
                                handleIngredientChange(idx, "purpose", e.target.value)
                              }
                              className="w-full bg-transparent text-gray-600 focus:outline-none focus:bg-white px-1 py-0.5 rounded border border-transparent focus:border-gray-300"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-sm transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>उत्पाद विवरण सुरक्षित करें (Save Details & Price)</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: IMAGE MANAGEMENT & SLIDING PRIMARY/SECONDARY SELECTION */}
      {activeTab === "images" && (
        <div className="space-y-6">
          {/* Instructions and Add Image Button */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                उत्पाद फोटो एवं स्लाइडर चयन (Manage Images & Sliding Selection)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                किसी भी फोटो को <strong>★ मुख्य फोटो (Primary)</strong> या <strong>सहायक फोटो (Secondary)</strong> के रूप में सेट करें और स्लाइडिंग क्रम व्यवस्थित करें।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddImageOpen(true)}
              className="inline-flex items-center gap-2 bg-[#0b3d2e] hover:bg-[#07281e] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>नयी फोटो जोड़ें (Add Image)</span>
            </button>
          </div>

          {/* Live Sliding Preview Bar */}
          <div className="bg-[#f4fbf7] border border-emerald-900/15 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  लाइव स्लाइडिंग प्रीव्यू (Live Storefront Sliding Preview)
                </span>
              </div>
              <span className="text-xs text-emerald-800 font-semibold">
                कुल फोटो: {slidingImages.length}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-2xl border border-emerald-900/10">
              {/* Preview Box */}
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-emerald-600 shrink-0 bg-gray-50 shadow-md">
                {slidingImages[previewIdx] && (
                  <Image
                    src={slidingImages[previewIdx].url}
                    alt="Preview"
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                )}
                {slidingImages[previewIdx]?.isPrimary ? (
                  <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    ★ मुख्य फोटो (Primary)
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 bg-gray-800/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                    स्लाइडिंग फोटो (Secondary)
                  </span>
                )}
              </div>

              {/* Slider Controls */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-sm font-bold text-gray-900">
                  {slidingImages[previewIdx]?.label || "उत्पाद फोटो"}
                </p>
                <p className="text-xs text-gray-500">
                  {slidingImages[previewIdx]?.subtitle || "होमपेज और उत्पाद पेज पर स्लाइडर में दिखाई देगा।"}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewIdx((p) =>
                        p === 0 ? slidingImages.length - 1 : p - 1
                      )
                    }
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-gray-700">
                    स्लाइड {previewIdx + 1} / {slidingImages.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewIdx((p) => (p + 1) % slidingImages.length)
                    }
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List of Managed Images with Primary / Secondary Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              सभी उत्पाद फोटो सूची (All Product Images & Roles)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between space-y-3 ${
                    img.isPrimary
                      ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                      <Image
                        src={img.url}
                        alt={img.label}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {img.isPrimary ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                            प्राथमिक (Primary)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                            सहायक (Secondary)
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-400">
                          #{idx + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-xs truncate">
                        {img.label}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {img.subtitle || img.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Role Switcher */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {/* Make Primary Button */}
                      {!img.isPrimary ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPrimaryImage(img.id);
                            showToast(`"${img.label}" को मुख्य फोटो (Primary) बना दिया गया!`);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
                          title="इस फोटो को मुख्य (Primary) बनाएं"
                        >
                          <Star className="w-3 h-3 text-amber-600" />
                          <span>प्राथमिक बनाएं</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                          ✓ वर्तमान प्राथमिक
                        </span>
                      )}
                    </div>

                    {/* Reorder and Delete Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, "up")}
                        className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100"
                        title="पहले लाएं"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => moveImage(idx, "down")}
                        className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100"
                        title="बाद में लाएं"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`क्या आप "${img.label}" फोटो को हटाना चाहते हैं?`)) {
                            removeImage(img.id);
                            showToast("फोटो हटा दी गई!");
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 ml-1"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Image */}
      {isAddImageOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                नयी उत्पाद फोटो जोड़ें
              </h3>
              <button
                type="button"
                onClick={() => setIsAddImageOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateImage} className="space-y-4 text-xs sm:text-sm">
              {/* Quick Select Preset Images */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  पहले से उपलब्ध इमेज चुनें (Predefined Assets)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "जार फोटो", url: "/images/product.jpeg" },
                    { label: "परहेज पर्चा", url: "/images/details.jpeg" },
                    { label: "लोगो सील", url: "/images/logo.jpeg" },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setNewImageUrl(preset.url)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        newImageUrl === preset.url
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Or enter custom URL */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  फोटो का URL (Image URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/product.jpeg अथवा https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              {/* Or Upload file directly */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  अथवा डिवाइस से फोटो अपलोड करें (Upload File)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-gray-50 hover:bg-emerald-50/40 text-gray-600 hover:text-emerald-800 text-xs font-semibold transition-all">
                    <Upload className="w-4 h-4" />
                    <span>इमेज फाइल चुनें (JPG, PNG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Label & Subtitle */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  फोटो का शीर्षक / लेबल (Label) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. क्रीम जार (50g) अथवा निर्देश पर्चा"
                  value={newImageLabel}
                  onChange={(e) => setNewImageLabel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  उपशीर्षक / विवरण (Subtitle)
                </label>
                <input
                  type="text"
                  placeholder="उदा. 100% प्रामाणिक माँ आयुर्वेदिक"
                  value={newImageSubtitle}
                  onChange={(e) => setNewImageSubtitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Primary vs Secondary Choice */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newImageIsPrimary}
                    onChange={(e) => setNewImageIsPrimary(e.target.checked)}
                    className="text-emerald-600 rounded"
                  />
                  <span className="font-bold text-gray-800">
                    इस फोटो को मुख्य (Primary) फोटो के रूप में सेट करें
                  </span>
                </label>
                <p className="text-[11px] text-gray-500 mt-1 pl-5">
                  यदि चयनित किया जाता है, तो यह फोटो होमपेज और उत्पाद पेज पर पहली और मुख्य फोटो बनेगी।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddImageOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  फोटो जोड़ें (Add Image)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
