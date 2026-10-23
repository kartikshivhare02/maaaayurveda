import React from "react";
import { BookOpen, AlertCircle, Stethoscope } from "lucide-react";

interface ConditionInfo {
  id: string;
  title: string;
  medicalTerm: string;
  tag: string;
  symptoms: string[];
  cause: string;
  ayurvedicApproach: string;
  whatAvoid: string;
}

const CONDITIONS: ConditionInfo[] = [
  {
    id: "daad",
    title: "1. दाद (Ringworm)",
    medicalTerm: "Tinea Corporis / Cruris",
    tag: "फंगल संक्रमण (कवक जनित)",
    symptoms: [
      "त्वचा पर गोल रिंग के आकार में लाल चकत्ते",
      "चकत्तों के किनारों पर छोटे उभार या दाने",
      "पसीना व नमी आने पर असहनीय खुजली व जलन",
    ],
    cause: "डर्माटोफाइट फंगस (गीले कपड़े, पसीना या संक्रमित वस्तुएं)।",
    ayurvedicApproach: "नीम, करंज और शुद्ध गंधक के रोगाणुरोधी तत्वों से फंगल फैलाव को रोकना।",
    whatAvoid: "गीले कपड़े, सिंथेटिक अंडरगारमेंट्स और खट्टी चीजें।",
  },
  {
    id: "khaaj",
    title: "2. खाज एवं दरारें (Dry Eczema)",
    medicalTerm: "Eczema / Fissured Dermatitis",
    tag: "सूखापन व दरारें",
    symptoms: [
      "त्वचा का अत्यधिक रूखा व खुरदुरा होना",
      "हाथों-पैरों व उंगलियों में गहरी दरारें व कट",
      "पानी या साबुन लगने पर तेज जलन व टीस",
    ],
    cause: "त्वचा की नमी खत्म होना, तेज डिटर्जेंट व रासायनिक साबुन का संपर्क।",
    ayurvedicApproach: "शुद्ध तिल तेल और मोम बेस से गहरी दरारों का भरण व प्राकृतिक पोषण।",
    whatAvoid: "कास्टिक सोडा वाले साबुन, गर्म पानी और खुजलाना।",
  },
  {
    id: "khujli",
    title: "3. पुरानी खुजली (Pruritus)",
    medicalTerm: "Chronic Pruritus",
    tag: "सामान्य लक्षण",
    symptoms: [
      "त्वचा पर बिना दाने के भी तीव्र खुजली की सनसनाहट",
      "रात को सोते समय या पसीने में खुजली का बढ़ना",
      "नाखूनों से खरोंचने पर त्वचा का काला पड़ना",
    ],
    cause: "रक्त में पित्त की अधिकता, धूल-मिट्टी या एलर्जी।",
    ayurvedicApproach: "भीमसेनी कपूर की प्राकृतिक शीतलता से नर्व सिग्नल्स और जलन को शांत करना।",
    whatAvoid: "नाखून लगाना (सॉफ्ट कॉटन कपड़े से हल्का सहलाएं)।",
  },
  {
    id: "psoriasis",
    title: "4. सोरायसिस (Psoriasis)",
    medicalTerm: "Plaque Psoriasis",
    tag: "ऑटोइम्यून अवस्था",
    symptoms: [
      "त्वचा पर लाल पैच के ऊपर चांदी जैसी सफेद पपड़ी जमना",
      "कोहनी, घुटनों, पीठ या सिर की त्वचा का सूखकर निकलना",
      "यह संक्रामक (छुआछूत का रोग) बिल्कुल नहीं है",
    ],
    cause: "शरीर की रोग-प्रतिरोधक प्रणाली में असंतुलन व त्वचा कोशिकाओं का अति-निर्माण।",
    ayurvedicApproach: "हल्दी व नीम से त्वचा के प्रदाह (Inflammation) को कम करना और पपड़ी को नम रखना।",
    whatAvoid: "तनाव, धूम्रपान, अत्यधिक शराब और खट्टी चीजें।",
  },
];

export const EducationalSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#e9e3d8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#f4fbf7] text-[#0b3d2e] border border-emerald-900/15 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>त्वचा स्वास्थ्य शिक्षा एवं मार्गदर्शन</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            दाद, खाज, खुजली और सोरायसिस में क्या अंतर है?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            हर प्रकार की खुजली केवल एक साधारण इन्फेक्शन नहीं होती। सही समझ और उचित पहचान ही त्वचा की समस्या के समाधान की पहली सीढ़ी है।
          </p>
        </div>

        {/* 4 Professional Distinction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CONDITIONS.map((item) => (
            <div
              key={item.id}
              className="bg-[#faf8f5] rounded-2xl p-5 sm:p-6 border border-[#e9e3d8] hover:border-[#0b3d2e]/30 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#0b3d2e] bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium italic">
                    {item.medicalTerm}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3">
                  {item.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <span className="text-xs font-semibold text-gray-700 block">मुख्य लक्षण:</span>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    {item.symptoms.map((sym, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5"></span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-200/60 text-xs text-gray-700 space-y-1">
                  <p><strong className="text-gray-900">कारण:</strong> {item.cause}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/10 bg-white/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl text-[11px] text-emerald-900 font-medium">
                🌿 <strong className="text-emerald-950">आयुर्वेदिक समाधान:</strong> {item.ayurvedicApproach}
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Steroid Warning Strip */}
        <div className="bg-[#fff9f8] rounded-2xl p-6 sm:p-8 border border-red-200/80 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md uppercase">
                  विशेष चिकित्सीय चेतावनी
                </span>
                <span className="text-xs text-gray-500 font-medium">स्टेरॉयड रिबाउंड इफ़ेक्ट</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-900">
                सावधान: स्टेरॉयड युक्त रासायनिक मलम से त्वचा क्यों पतली और बदतर हो जाती है?
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                बाजार में मिलने वाले कई तेज केमिकल मलम (जैसे Clobetasol, Betamethasone युक्त क्रीम) 2 दिन के लिए लाली और खुजली दबा देते हैं, लेकिन त्वचा की प्राकृतिक रोग-प्रतिरोधक क्षमता को कमजोर कर त्वचा को कागज जैसा पतला कर देते हैं। मलम छोड़ते ही फंगल इन्फेक्शन कई गुना अधिक आक्रामक होकर लौटता है। <strong>माँ आयुर्वेदिक क्रीम में 0% स्टेरॉयड है</strong> — यह नीम, करंज, शुद्ध गंधक और भीमसेनी कपूर की प्राकृतिक शक्ति से बिना त्वचा को नुकसान पहुंचाए शांति प्रदान करती है।
              </p>
            </div>
          </div>
        </div>

        {/* When to consult a qualified doctor */}
        <div className="border border-[#0b3d2e]/20 bg-[#f4fbf7]/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b3d2e] text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-sm sm:text-base">
                डॉक्टर अथवा चर्म रोग विशेषज्ञ से कब परामर्श लेना चाहिए?
              </h5>
              <p className="text-xs text-gray-600 mt-0.5">
                यदि त्वचा पर खुला घाव हो, मवाद बह रहा हो, बुखार हो अथवा 3 सप्ताह के पूर्ण परहेज और प्रयोग के बाद भी आराम न दिखे, तो नजदीकी योग्य त्वचा विशेषज्ञ से चिकित्सकीय जांच कराएं।
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-[#0b3d2e] bg-white border border-[#0b3d2e]/20 px-3.5 py-2 rounded-xl shadow-2xs">
            पारदर्शी चिकित्सा नीति
          </span>
        </div>
      </div>
    </section>
  );
};
