"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_INFO, FAQS } from "@/lib/data/mockData";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    category: "order",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.message.trim()) {
      setErrorMsg("कृपया नाम, फोन नंबर और अपनी समस्या का विवरण भरें।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(data.message);
      } else {
        throw new Error(data.error || "टिकट दर्ज करने में समस्या आई।");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
            24/7 सहायता एवं परामर्श
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mt-2">
            हम आपकी सहायता के लिए सदैव तत्पर हैं
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            ऑर्डर, डिलीवरी, परहेज, उपयोग विधि अथवा किसी भी प्रश्न के लिए सीधे संपर्क करें।
          </p>
        </div>

        {/* 3 Contact Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-7 h-7 fill-current" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">WhatsApp सहायता</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                सबसे तेज जवाब पाने के लिए हमारी आधिकारिक WhatsApp हेल्पलाइन पर संदेश भेजें।
              </p>
              <p className="text-sm font-bold text-emerald-800 font-mono">
                {BRAND_INFO.whatsappDisplay}
              </p>
            </div>
            <div className="pt-4">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  "नमस्ते, मुझे माँ आयुर्वेदिक क्रीम के संबंध में सहायता चाहिए।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                चैट शुरू करें
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">ईमेल सहायता</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                औपचारिक प्रश्नों, इनवॉइस या बल्क पूछताछ के लिए हमें ईमेल लिखें।
              </p>
              <p className="text-sm font-bold text-blue-800 font-mono">
                {BRAND_INFO.supportEmail}
              </p>
            </div>
            <div className="pt-4">
              <a
                href={`mailto:${BRAND_INFO.supportEmail}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" />
                ईमेल भेजें
              </a>
            </div>
          </div>

          {/* Office & Timing Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">कार्य समय एवं पता</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                कॉल व चैट सहायता: {BRAND_INFO.supportHours}
              </p>
              <p className="text-xs text-gray-700 font-medium pt-1">
                {BRAND_INFO.address}
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/track-order"
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                ऑर्डर ट्रैक करें
              </Link>
            </div>
          </div>
        </div>

        {/* Contact & Ticket Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              ऑनलाइन सहायता टिकट दर्ज करें (Submit Support Ticket)
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              हमारी टीम 24 घंटे में आपके पंजीकृत फोन अथवा ईमेल पर उत्तर देगी।
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-gray-900">टिकट सफलतापूर्वक दर्ज हुई!</h4>
                <p className="text-xs text-emerald-900">{submitted}</p>
                <button
                  onClick={() => setSubmitted(null)}
                  className="mt-2 text-xs font-bold text-emerald-800 hover:underline"
                >
                  अन्य प्रश्न पूछें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      आपका नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. अमित शर्मा"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      मोबाइल नंबर *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10 अंकों का फोन नंबर"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ईमेल आईडी (वैकल्पिक)
                    </label>
                    <input
                      type="email"
                      placeholder="amit@gmail.com"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      प्रश्न की श्रेणी (Category) *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as any })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="order">ऑर्डर व डिलीवरी संबंधी</option>
                      <option value="product_usage">उपयोग विधि व परहेज संबंधी</option>
                      <option value="refund">रिफंड व गारंटी संबंधी</option>
                      <option value="general">सामान्य पूछताछ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    अपनी समस्या या प्रश्न का विवरण लिखें *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="कृपया विस्तार से बताएं कि हम आपकी किस प्रकार सहायता कर सकते हैं..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-colors text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>सबमिट हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>सहायता टिकट भेजें</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick FAQ Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-100">
              <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700" />
                त्वरित सहायता (Quick Answers)
              </h3>
              <div className="space-y-3 text-xs text-gray-700">
                <div className="p-3 bg-white rounded-xl border border-emerald-100/60">
                  <p className="font-bold text-gray-900 mb-1">डिलीवरी में कितना समय लगता है?</p>
                  <p>सामान्यतः 3 से 5 कार्य दिवसों में पूरे भारत में डिलीवरी हो जाती है।</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100/60">
                  <p className="font-bold text-gray-900 mb-1">क्या डिलीवरी के समय पैसे दे सकते हैं?</p>
                  <p>हाँ, कैश ऑन डिलीवरी (COD) की सुविधा उपलब्ध है।</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100/60">
                  <p className="font-bold text-gray-900 mb-1">परहेज का पर्चा कहां मिलेगा?</p>
                  <p>प्रत्येक डिब्बे के साथ खट्टी चीजों के परहेज की विस्तृत सूची भेजी जाती है।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
