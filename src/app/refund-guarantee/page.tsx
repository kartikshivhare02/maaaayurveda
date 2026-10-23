"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Lock,
  ArrowRight,
  Loader2,
  FileText,
} from "lucide-react";

export default function RefundGuaranteePage() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    reason: "नियमित उपयोग व परहेज के बाद भी पर्याप्त सुधार नहीं हुआ",
    details: "",
    consentGiven: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{
    claimId: string;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.orderNumber.trim() || !formData.customerName.trim() || !formData.customerPhone.trim()) {
      setErrorMsg("कृपया ऑर्डर नंबर, अपना नाम और फोन नंबर अवश्य दर्ज करें।");
      return;
    }

    if (!formData.consentGiven) {
      setErrorMsg("कृपया रिफंड नियमों व सत्यापन शर्तों से सहमति का बॉक्स चेक करें।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted({
          claimId: data.claimId,
          message: data.message,
        });
      } else {
        throw new Error(data.error || "दावा दर्ज करने में त्रुटि हुई।");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "अनुरोध दर्ज करने में समस्या आई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-9 h-9 stroke-[2]" />
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
            पारदर्शी गारंटी नीति
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mt-2">
            100% मनी-बैक गारंटी एवं रिफंड दावा पोर्टल
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
            हम अपने 100% शुद्ध आयुर्वेदिक फॉर्मूले के प्रति पूरी तरह प्रतिबद्ध हैं। यदि उत्पाद बताए गए निर्देशों और परहेज के अनुसार उपयोग करने पर परिणाम न दे, तो आप पूरा रिफंड पा सकते हैं।
          </p>
        </div>

        {/* 4 Policy Term Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Clock className="w-4 h-4 text-emerald-600" />
              1. दावा प्रस्तुत करने की अवधि
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              उत्पाद की डिलीवरी के दिन से 30 दिनों के भीतर दावा दर्ज किया जा सकता है। इससे ग्राहक को 3-4 सप्ताह तक क्रीम व परहेज का सही असर देखने का पर्याप्त समय मिलता है।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. पात्रता एवं खरीद का प्रमाण
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              दावे के लिए हमारी आधिकारिक वेबसाइट या अधिकृत चैनल से जारी वैध ऑर्डर संख्या (Order ID) अथवा इनवॉइस रसीद का होना अनिवार्य है।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. रिफंड राशि एवं माध्यम
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              सत्यापन के बाद ग्राहक द्वारा भुगतान की गई 100% उत्पाद राशि 5 से 7 कार्य दिवसों में उसी मूल खाते/UPI अथवा बैंक खाते में सीधे ट्रांसफर कर दी जाती है।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              4. गोपनीय एवं वैकल्पिक सत्यापन
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              ग्राहकों से केवल उनकी सहमति पर ही स्थिति की तस्वीर मांगी जा सकती है। यह पूरी तरह गोपनीय रखी जाती है और बिना अलग अनुमति के कभी प्रकाशित नहीं की जाती।
            </p>
          </div>
        </div>

        {/* Claim Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                रिफंड दावा सफलता पूर्वक दर्ज हुआ!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {submitted.message}
              </p>
              <div className="pt-2">
                <span className="font-mono font-bold text-sm bg-gray-100 px-3 py-1.5 rounded-lg text-gray-900">
                  संदर्भ संख्या: {submitted.claimId}
                </span>
              </div>
              <p className="text-xs text-gray-500 pt-2">
                हमारी रिफंड वेरिफिकेशन टीम आपसे 48 घंटे के भीतर संपर्क करेगी।
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-emerald-700 hover:underline text-sm font-bold"
                >
                  ← होम पेज पर जाएं
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  रिफंड दावा फॉर्म भरें (Submit Refund Claim)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  सभी विवरण ध्यानपूर्वक भरें ताकि प्रक्रिया में कोई विलंब न हो।
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ऑर्डर संख्या (Order Number) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. MAA-123456"
                    value={formData.orderNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ग्राहक का नाम (Customer Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राजेश कुमार"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    मोबाइल नंबर (Registered Phone) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-अंकों का फोन नंबर"
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

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ईमेल आईडी (Email)
                  </label>
                  <input
                    type="email"
                    placeholder="rajesh@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  रिफंड का मुख्य कारण चुनें *
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="नियमित उपयोग व परहेज के बाद भी पर्याप्त सुधार नहीं हुआ">
                    नियमित उपयोग व परहेज के बाद भी पर्याप्त सुधार नहीं हुआ
                  </option>
                  <option value="गलत अथवा क्षतिग्रस्त उत्पाद प्राप्त हुआ">
                    गलत अथवा क्षतिग्रस्त उत्पाद प्राप्त हुआ
                  </option>
                  <option value="त्वचा पर एलर्जी या उपयुक्त न होना">
                    त्वचा पर एलर्जी या उपयुक्त न होना
                  </option>
                  <option value="अन्य कारण">अन्य कारण</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  समस्या का संक्षिप्त विवरण (Details)
                </label>
                <textarea
                  rows={3}
                  placeholder="कृपया बताएं कि आपने कितने दिन क्रीम लगाई और क्या-क्या परहेज रखा..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Consent Checkbox */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs text-gray-600 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={(e) =>
                      setFormData({ ...formData, consentGiven: e.target.checked })
                    }
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500 rounded"
                  />
                  <span className="font-medium text-gray-800">
                    मैं पुष्टि करता/करती हूँ कि मैंने उत्पाद के साथ दिए गए निर्देशों और खट्टी चीजों के परहेज का पालन किया है तथा प्रस्तुत की गई जानकारी पूर्णतः सत्य है।
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-colors text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>दावा दर्ज हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>100% मनी-बैक दावा सबमिट करें</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
