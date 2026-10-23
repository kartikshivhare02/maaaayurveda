import React from "react";
import { BRAND_INFO } from "@/lib/data/mockData";

export const metadata = {
  title: "गोपनीयता नीति (Privacy Policy) — माँ आयुर्वेदिक क्रीम",
  description: "ग्राहक डेटा सुरक्षा, गोपनीयता एवं डिजिटल व्यक्तिगत डेटा संरक्षण नीति।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              डेटा सुरक्षा
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              गोपनीयता नीति (Privacy Policy)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP) के अनुरूप
            </p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-bold text-gray-900">1. डेटा संग्रहण एवं उपयोग</h3>
            <p>
              {BRAND_INFO.name} केवल वही जानकारी एकत्र करता है जो आपके ऑर्डर को प्रोसेस करने, डिलीवरी पहुंचाने और ग्राहक सहायता प्रदान करने के लिए आवश्यक है (जैसे: नाम, फोन नंबर, डिलीवरी का पता, और ईमेल)।
            </p>

            <h3 className="text-base font-bold text-gray-900">2. भुगतान सुरक्षा</h3>
            <p>
              हम कभी भी आपके क्रेडिट/डेबिट कार्ड नंबर, सीवीवी या यूपीआई पिन को अपने सर्वर पर स्टोर नहीं करते हैं। सभी वित्तीय लेन-देन Razorpay के 256-बिट एन्क्रिप्टेड एवं PCI-DSS प्रमाणित सुरक्षित गेटवे के माध्यम से संचालित होते हैं।
            </p>

            <h3 className="text-base font-bold text-gray-900">3. संवेदनशील स्वास्थ्य डेटा एवं तस्वीरें</h3>
            <p>
              यदि ग्राहक स्वेच्छा से अपनी सहमति से रिफंड या परामर्श के लिए त्वचा की कोई तस्वीर साझा करता है, तो उसे केवल अधिकृत विशेषज्ञ टीम द्वारा अत्यंत गोपनीय रखा जाता है। ग्राहक की अलग से लिखित सहमति के बिना इसे किसी विज्ञापन या टेस्टिमोनियल में कभी प्रदर्शित नहीं किया जाता।
            </p>

            <h3 className="text-base font-bold text-gray-900">4. डेटा साझाकरण प्रतिबंध</h3>
            <p>
              हम आपका व्यक्तिगत डेटा कभी भी किसी तीसरे पक्ष को विपणन उद्देश्यों के लिए नहीं बेचते हैं। डेटा केवल डिलीवरी कूरियर पार्टनर्स के साथ पार्सल पहुंचाने के सीमित उद्देश्य से साझा किया जाता है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
