import { NextResponse } from "next/server";

// Fallback Indian Pin Code regions
const PIN_REGIONS: Record<string, { city: string; state: string; region: string; days: string }> = {
  "11": { city: "नई दिल्ली (New Delhi)", state: "दिल्ली (Delhi)", region: "नॉर्थ जोन", days: "2-3 दिन" },
  "12": { city: "गुरुग्राम / फरीदाबाद", state: "हरियाणा (Haryana)", region: "नॉर्थ जोन", days: "2-3 दिन" },
  "13": { city: "अंबाला / करनाल", state: "हरियाणा (Haryana)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "14": { city: "लुधियाना / अमृतसर", state: "पंजाब (Punjab)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "16": { city: "चंडीगढ़", state: "चंडीगढ़ (Chandigarh)", region: "नॉर्थ जोन", days: "2-3 दिन" },
  "20": { city: "नोएडा / गाजियाबाद", state: "उत्तर प्रदेश (UP)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "21": { city: "इलाहाबाद / प्रयागराज", state: "उत्तर प्रदेश (UP)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "22": { city: "लखनऊ / वाराणसी", state: "उत्तर प्रदेश (UP)", region: "नॉर्थ जोन", days: "2-4 दिन" },
  "24": { city: "देहरादून / हरिद्वार", state: "उत्तराखंड (Uttarakhand)", region: "नॉर्थ जोन", days: "3-5 दिन" },
  "30": { city: "जयपुर (Jaipur)", state: "राजस्थान (Rajasthan)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "31": { city: "उदयपुर (Udaipur)", state: "राजस्थान (Rajasthan)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "32": { city: "कोटा (Kota)", state: "राजस्थान (Rajasthan)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "33": { city: "बीकानेर (Bikaner)", state: "राजस्थान (Rajasthan)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "34": { city: "जोधपुर (Jodhpur)", state: "राजस्थान (Rajasthan)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "38": { city: "अहमदाबाद (Ahmedabad)", state: "गुजरात (Gujarat)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "39": { city: "सूरत / वडोदरा", state: "गुजरात (Gujarat)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "40": { city: "मुंबई (Mumbai)", state: "महाराष्ट्र (Maharashtra)", region: "वेस्ट जोन", days: "2-3 दिन" },
  "41": { city: "पुणे (Pune)", state: "महाराष्ट्र (Maharashtra)", region: "वेस्ट जोन", days: "2-4 दिन" },
  "45": { city: "इंदौर (Indore)", state: "मध्य प्रदेश (MP)", region: "सेंट्रल जोन", days: "2-4 दिन" },
  "46": { city: "भोपाल (Bhopal)", state: "मध्य प्रदेश (MP)", region: "सेंट्रल जोन", days: "2-4 दिन" },
  "50": { city: "हैदराबाद (Hyderabad)", state: "तेलंगाना (Telangana)", region: "साउथ जोन", days: "3-5 दिन" },
  "56": { city: "बेंगलुरु (Bengaluru)", state: "कर्नाटक (Karnataka)", region: "साउथ जोन", days: "3-5 दिन" },
  "60": { city: "चेन्नई (Chennai)", state: "तमिलनाडु (Tamil Nadu)", region: "साउथ जोन", days: "3-5 दिन" },
  "70": { city: "कोलकाता (Kolkata)", state: "पश्चिम बंगाल (West Bengal)", region: "ईस्ट जोन", days: "3-5 दिन" },
  "80": { city: "पटना (Patna)", state: "बिहार (Bihar)", region: "ईस्ट जोन", days: "3-5 दिन" },
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

  let city = "";
  let state = "";
  let region = "स्टैंडर्ड एक्सप्रेस डिलीवरी";
  let estimatedDays = "2-4 दिन";

  // Try real-time Indian Postal Service API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3200);

    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache 24 hours
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        city = po.District || po.Block || po.Name || "";
        state = po.State || "";
        region = po.Region || po.Circle || "भारत";
      }
    }
  } catch {
    // If network timeout or failed, fall back safely
  }

  // Fallback if Postal API was down or returned empty
  const prefix = pin.substring(0, 2);
  const fallback = PIN_REGIONS[prefix];

  if (!city && fallback) {
    city = fallback.city;
  }
  if (!state && fallback) {
    state = fallback.state;
  }
  if (fallback?.days) {
    estimatedDays = fallback.days;
  }

  if (!state) {
    state = "भारत (India)";
  }

  const locationString = city ? `${city}, ${state}` : state;

  return NextResponse.json(
    {
      deliverable: true,
      pincode: pin,
      city: city || "",
      state: state,
      region: region,
      estimatedDays: estimatedDays,
      codAvailable: true,
      freeDelivery: true,
      message: `पिन कोड ${pin} (${locationString}) पर मुफ्त डिलीवरी व कैश ऑन डिलीवरी उपलब्ध है!`,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
