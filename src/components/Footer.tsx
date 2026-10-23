"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND_INFO } from "@/lib/data/mockData";
import { Phone, Mail, MapPin, ShieldAlert, Award, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
                <Image
                  src={BRAND_INFO.logoUrl}
                  alt={BRAND_INFO.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">{BRAND_INFO.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{BRAND_INFO.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              दाद, दरार, खुजली और सोरायसिस की जिद्दी समस्याओं के लिए प्राचीन भारतीय जड़ी-बूटियों (नीम, हल्दी, करंज, कपूर व गंधक) पर आधारित प्रामाणिक आयुर्वेदिक स्किनकेयर।
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                आयुष लाइसेंस नं: {BRAND_INFO.licenseNo}
              </p>
              <p className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                100% सुरक्षित भुगतान (256-bit SSL एन्क्रिप्शन)
              </p>
            </div>
          </div>

          {/* Col 3: त्वरित लिंक (Quick Links) */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base">ब्रांड एवं उत्पाद</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  होम पेज
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-emerald-400 transition-colors">
                  प्रोडक्ट विवरण एवं घटक
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  हमारे बारे में (About Us)
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-emerald-400 transition-colors">
                  विशेष कॉम्बो ऑफर
                </Link>
              </li>
              <li>
                <Link href="/#diet" className="hover:text-emerald-400 transition-colors">
                  खान-पान एवं परहेज गाइड
                </Link>
              </li>
              <li>
                <Link href="/#stories" className="hover:text-emerald-400 transition-colors">
                  सत्यापित ग्राहक कहानियां (Customer Stories)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: ग्राहक सहायता (Customer Support) */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base">ग्राहक सहायता</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="hover:text-emerald-400 transition-colors">
                  सहायता केंद्र (Contact Us)
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-emerald-400 transition-colors">
                  ऑर्डर ट्रैक करें (Track Order)
                </Link>
              </li>
              <li>
                <Link href="/refund-guarantee" className="hover:text-emerald-400 transition-colors">
                  100% मनी-बैक गारंटी नियम
                </Link>
              </li>
              <li>
                <Link href="/policy/refund" className="hover:text-emerald-400 transition-colors">
                  रिटर्न व रिफंड पॉलिसी
                </Link>
              </li>
              <li>
                <Link href="/policy/shipping" className="hover:text-emerald-400 transition-colors">
                  शिपिंग व डिलीवरी नियम
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: कानूनी एवं संपर्क (Legal & Contact) */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base">कानूनी एवं संपर्क</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policy/privacy" className="hover:text-emerald-400 transition-colors">
                  गोपनीयता नीति (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/policy/terms" className="hover:text-emerald-400 transition-colors">
                  नियम एवं शर्तें (Terms & Conditions)
                </Link>
              </li>
              <li className="flex items-start gap-2 pt-2 text-xs text-gray-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{BRAND_INFO.whatsappDisplay}</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-400">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{BRAND_INFO.supportEmail}</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Medical Disclaimer */}
        <div className="pt-8 pb-4 text-xs text-gray-400 space-y-3">
          <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-700/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-gray-200">
                महत्वपूर्ण कानूनी एवं चिकित्सीय डिस्क्लेमर (Medical & Legal Disclaimer):
              </p>
              <p className="leading-relaxed">
                यह उत्पाद एक पारंपरिक आयुर्वेदिक प्रोप्रायटरी औषधि (Ayurvedic Proprietary Medicine) है जो दाद, दरार, खाज, खुजली और सोरायसिस से उत्पन्न लक्षणों और रूखेपन को शांत करने में सहायक है। यह किसी भी एलोपैथिक एंटीफंगल दवा का रासायनिक विकल्प नहीं है और न ही बिना परहेज के रातों-रात 100% स्थायी उपचार का दावा करता है। यदि त्वचा पर गहरा खुला घाव हो, अत्यधिक संक्रमण हो या 3 सप्ताह तक कोई सुधार न दिखे, तो योग्य त्वचा रोग विशेषज्ञ (Dermatologist) से परामर्श अवश्य लें।
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-gray-400 pt-4 gap-2">
            <p>© 2026 {BRAND_INFO.name}. सर्वाधिकार सुरक्षित (All Rights Reserved)।</p>
            <p className="flex items-center gap-1 text-emerald-400 font-medium">
              <span>🇮🇳 भारत में निर्मित एवं आयुष मानकों के अनुरूप</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
