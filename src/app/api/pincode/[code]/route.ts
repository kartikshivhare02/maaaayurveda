import { NextResponse } from "next/server";

// Common Indian Pin Code ranges and mappings
const PIN_REGIONS: Record<string, { state: string; region: string; days: string }> = {
  "11": { state: "दिल्ली (Delhi)", region: "नॉर्थ जोन", days: "2-3 दिन" },
  "12": { state: "हरियाणा (Haryana)", region: "नॉर्थ जोन", days: "2-3 दिन" },
  "13": { state: "हरियाणा / पंजाब", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "14": { state: "पंजाब (Punjab)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "16": { state: "चंडीगढ़ (Chandigarh)", region: "नॉर्थ जोन", days: "2-3 दिन" },
  "20": { state: "उत्तर प्रदेश (West UP)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "21": { state: "उत्तर प्रदेश (Central UP)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "22": { state: "उत्तर प्रदेश (East UP)", region: "नॉर्थ जोन", days: "3-4 दिन" },
  "24": { state: "उत्तराखंड (Uttarakhand)", region: "नॉर्थ जोन", days: "3-5 दिन" },
  "30": { state: "राजस्थान (Jaipur Zone)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "31": { state: "राजस्थान (Udaipur Zone)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "32": { state: "राजस्थान (Kota Zone)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "33": { state: "राजस्थान (Bikaner Zone)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "34": { state: "राजस्थान (Jodhpur Zone)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "38": { state: "गुजरात (Ahmedabad)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "39": { state: "गुजरात (Surat/South)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "40": { state: "महाराष्ट्र (Mumbai)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "41": { state: "महाराष्ट्र (Pune/West)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "45": { state: "मध्य प्रदेश (Indore)", region: "सेंट्रल जोन", days: "2-4 दिन" },
  "46": { state: "मध्य प्रदेश (Bhopal)", region: "सेंट्रल जोन", days: "2-4 दिन" },
  "50": { state: "तेलंगाना (Hyderabad)", region: "साउथ जोन", days: "3-5 दिन" },
  "56": { state: "कर्नाटक (Bengaluru)", region: "साउथ जोन", days: "3-5 दिन" },
  "60": { state: "तमिलनाडु (Chennai)", region: "साउथ जोन", days: "3-5 दिन" },
  "70": { state: "पश्चिम बंगाल (Kolkata)", region: "ईस्ट जोन", days: "3-5 दिन" },
  "80": { state: "बिहार (Patna)", region: "ईस्ट जोन", days: "3-5 दिन" },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const pin = code.trim();

  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json(
      { deliverable: false, message: "कृपया 6 अंकों का मान्य भारतीय पिन कोड दर्ज करें।" },
      { status: 400 }
    );
  }

  const prefix = pin.substring(0, 2);
  const info = PIN_REGIONS[prefix] || {
    state: "भारत (India)",
    region: "स्टैंडर्ड एक्सप्रेस डिलीवरी",
    days: "3-5 दिन",
  };

  return NextResponse.json({
    deliverable: true,
    pincode: pin,
    state: info.state,
    region: info.region,
    estimatedDays: info.days,
    codAvailable: true,
    freeDelivery: true,
    message: `पिन कोड ${pin} पर डिलीवरी उपलब्ध है! अनुमानित समय: ${info.days}`,
  });
}
