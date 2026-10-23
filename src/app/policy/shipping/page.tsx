import React from "react";
import { BRAND_INFO } from "@/lib/data/mockData";
import { Truck, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "शिपिंग एवं डिलीवरी नीति — माँ आयुर्वेदिक क्रीम",
  description: "संपूर्ण भारत में डिलीवरी समय-सीमा, कूरियर पार्टनर एवं पार्सल ट्रैकिंग नियम।",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              डिलीवरी मानक
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              शिपिंग एवं डिलीवरी नीति (Shipping & Delivery Policy)
            </h1>
            <p className="text-xs text-gray-500 mt-1">अंतिम अद्यतन: अक्टूबर 2026</p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              1. मुफ्त डिलीवरी (Free Shipping Across India)
            </h3>
            <p>
              हम माँ आयुर्वेदिक क्रीम के सभी कॉम्बो पैक पर पूरे भारत में 100% मुफ्त डिलीवरी प्रदान करते हैं। ग्राहक से कोई अतिरिक्त पैकेजिंग या गुप्त डिलीवरी शुल्क नहीं लिया जाता है।
            </p>

            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              2. डिस्पैच एवं अनुमानित डिलीवरी समय
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>डिस्पैच:</strong> कार्य दिवसों में ऑर्डर पुष्टि के 24 घंटे के भीतर पार्सल डिस्पैच कर दिया जाता है।
              </li>
              <li>
                <strong>मेट्रो एवं प्रमुख शहर:</strong> 2 से 3 कार्य दिवस (Delhi NCR, Mumbai, Jaipur, Bengaluru, Ahmedabad आदि)।
              </li>
              <li>
                <strong>अन्य शहर एवं ग्रामीण क्षेत्र:</strong> 3 से 5 कार्य दिवस।
              </li>
            </ul>

            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              3. सुरक्षित सील-पैक पैकेजिंग
            </h3>
            <p>
              प्रत्येक पार्सल को मजबूत, सुरक्षित और छेड़छाड़-रोधी (tamper-evident) सील पैक बॉक्स में पैक किया जाता है ताकि यात्रा के दौरान क्रीम पूरी तरह सुरक्षित रहे।
            </p>

            <h3 className="text-base font-bold text-gray-900">4. कूरियर पार्टनर्स एवं ट्रैकिंग</h3>
            <p>
              हम विश्वसनीय राष्ट्रीय लॉजिस्टिक्स पार्टनर्स जैसे Delhivery, BlueDart, DTDC, Xpressbees एवं India Post (Speed Post) के माध्यम से पार्सल भेजते हैं। डिस्पैच होते ही ग्राहक को SMS एवं WhatsApp पर AWB ट्रैकिंग लिंक भेजा जाता है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
