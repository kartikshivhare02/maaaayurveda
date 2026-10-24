import { Product, BundleOffer, Review, Coupon, SEOAuditIssue, StoryTestimonial, ProductImageItem } from "@/types";

export const DEFAULT_PRODUCT_IMAGES: ProductImageItem[] = [
  {
    id: "img-1",
    url: "/images/product.jpeg",
    label: "मुख्य जार पैकेजिंग (50g)",
    subtitle: "प्राथमिक उत्पाद फोटो",
    isPrimary: true,
    type: "primary",
  },
  {
    id: "img-2",
    url: "/images/details.jpeg",
    label: "परहेज व खान-पान पर्चा",
    subtitle: "सख्त खान-पान निर्देश",
    isPrimary: false,
    type: "secondary",
  },
  {
    id: "img-3",
    url: "/images/logo.jpeg",
    label: "ब्रांड प्रामाणिकता सील",
    subtitle: "100% असली माँ आयुर्वेदिक",
    isPrimary: false,
    type: "secondary",
  },
];

export const BRAND_INFO = {
  name: "माँ आयुर्वेदिक क्रीम",
  tagline: "माँ का ख्याल, प्रकृति का कमाल",
  logoUrl: "/images/logo.jpeg",
  productImageUrl: "/images/product.jpeg",
  detailsImageUrl: "/images/details.jpeg",
  whatsappNumber: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  supportEmail: "support@maaayurvedic.in",
  supportHours: "सोमवार से शनिवार (सुबह 10:00 से शाम 7:00 बजे तक)",
  address: "आयुष प्रमाणित निर्माण इकाई, इंडस्ट्रियल एरिया, राजस्थान, भारत",
  licenseNo: "AYU-RAJ-2024-8891",
};

export const MAIN_PRODUCT: Product = {
  id: "maa-ayurvedic-cream-50g",
  slug: "maa-ayurvedic-cream",
  name: "माँ आयुर्वेदिक क्रीम",
  hindiTitle: "माँ आयुर्वेदिक क्रीम — दाद, दरार, खुजली एवं सोरायसिस राहत फॉर्मूला",
  subtitle: "100% शुद्ध आयुर्वेदिक जड़ी-बूटियों से निर्मित प्राकृतिक त्वचा क्रीम",
  tagline: "माँ का ख्याल, प्रकृति का कमाल",
  description:
    "माँ आयुर्वेदिक क्रीम सदियों पुरानी पारंपरिक आयुर्वेदिक जड़ी-बूटियों एवं सक्रिय घटकों (बाकुची तेल 15%, वैसलीन सल्फर 12%, कत्था 4%, गंध पुष्पा 3%, शुद्ध गंधक 3%, नीला थोथा 2% एवं हरितोली 1%) के सटीक औषधीय फॉर्मूले से तैयार की गई एक प्रभावी मलहम है। यह दाद (Ringworm), दरार, पुरानी खुजली और सोरायसिस से जुड़ी जलन व रूखेपन को शांत करने और त्वचा के प्राकृतिक स्वास्थ्य को वापस लाने में अत्यंत सहायक है।",
  mrpPaise: 69900, // ₹699
  pricePaise: 49900, // ₹499
  netQty: "50 ग्राम",
  inStock: true,
  stockCount: 420,
  images: [
    "/images/product.jpeg",
    "/images/details.jpeg",
    "/images/logo.jpeg",
  ],
  category: "आयुर्वेदिक स्किनकेयर एवं मलहम",
  classification: "आयुर्वेदिक प्रोप्रायटरी औषधि (Ayurvedic Proprietary Medicine)",
  ingredients: [
    {
      hindiName: "बाकुची तेल (Bakuchi oil / Psoralea corylifolia)",
      botanicalName: "Psoralea corylifolia",
      purpose: "पारंपरिक रूप से चर्म रोग, दाद (रिंगवर्म), खाज व पुरानी जिद्दी खुजली में अत्यंत गुणकारी सक्रिय घटक।",
      percentage: "15%",
    },
    {
      hindiName: "वैसलीन सल्फर (Vaseline Sulfur)",
      botanicalName: "Sulfur Base",
      purpose: "त्वचा को गहराई से नमी, दरारों में सुरक्षा और रोगाणुरोधी आवरण प्रदान करता है।",
      percentage: "12%",
    },
    {
      hindiName: "कत्था (Katha / Acacia catechu)",
      botanicalName: "Acacia catechu",
      purpose: "प्राकृतिक रक्तशोधक, त्वचा की जलन, छालों और घावों को तेजी से सुखाने में सहायक।",
      percentage: "4%",
    },
    {
      hindiName: "गंध पुष्पा (Gandh Pushpa / Salix caprea)",
      botanicalName: "Salix caprea",
      purpose: "त्वचा की सूजन (Anti-inflammatory), लालिमा और असहनीय जलन को शांत कर ठंडक देता है।",
      percentage: "3%",
    },
    {
      hindiName: "शुद्ध गंधक (Gandhak / Copper (I) / Purified Sulphur)",
      botanicalName: "Purified Sulphur",
      purpose: "आयुर्वेद सम्मत शक्तिशाली रोगाणुरोधी खनिज जो फंगल व बैक्टीरियल संक्रमण को जड़ से नियंत्रित करता है।",
      percentage: "3%",
    },
    {
      hindiName: "नीला थोथा (Neela Totha / Purified Blue Vitriol)",
      botanicalName: "Purified Copper Compound",
      purpose: "शास्त्रीय आयुर्वेदिक शोधित घटक जो जिद्दी दाद व फंगस को नष्ट कर त्वचा का सुधार करता है।",
      percentage: "2%",
    },
    {
      hindiName: "हरितोली (Haritoli / Gymnema sylvestre)",
      botanicalName: "Gymnema sylvestre",
      purpose: "दुर्लभ जड़ी-बूटी अर्क जो त्वचा की प्रतिरोधक क्षमता और सूक्ष्म संक्रमण नियंत्रण में उपयोगी है।",
      percentage: "1%",
    },
    {
      hindiName: "क्रीम बेस (Cream Base)",
      botanicalName: "Cream Base Q.S.",
      purpose: "सभी सक्रिय आयुर्वेदिक घटकों को त्वचा की गहराई तक समाहित करने वाला सुरक्षित मखमली बेस।",
      percentage: "Q.S. (आवश्यकतानुसार)",
    },
  ],
  directions: [
    "प्रभावित स्थान को पहले हल्के गुनगुने पानी से धोकर साफ और सूखे सूती कपड़े से सुखा लें।",
    "अपनी उंगली पर थोड़ी मात्रा में क्रीम लेकर प्रभावित त्वचा पर हल्के हाथों से गोलाकार में लगाएं।",
    "क्रीम को जोर से न रगड़ें, त्वचा पर एक पतली परत छोड़ दें ताकि जड़ी-बूटियां असर कर सकें।",
    "उत्तम और स्थायी परिणाम के लिए इसे दिन में 2 बार (सुबह नहाने के बाद और रात को सोने से पहले) लगाएं।",
  ],
  dietaryRestrictions: [
    "कच्चा नींबू और नींबू का अचार",
    "केरी का अचार एवं अमचूर पाउडर",
    "इमली की खट्टी चटनी",
    "खट्टी छाछ एवं बासी दही",
    "मोसंबी, संतरा, अंगूर एवं आंवला",
    "कच्चा आम एवं खट्टी किशमिश",
    "टोमेटो केचप एवं सॉस",
    "पानी पूरी का खट्टा पानी",
    "पाइनएप्पल एवं टारटरी (Citric Acid) युक्त खाद्य पदार्थ",
  ],
  precautions: [
    "केवल बाहरी उपयोग के लिए (For External Application Only)।",
    "आंखों, मुंह, खुले ताजे घावों या कटी हुई त्वचा पर न लगाएं।",
    "क्रीम लगाने से पहले और बाद में हाथों को साबुन से अच्छी तरह धोएं।",
    "यदि त्वचा पर कोई अप्रत्याशित जलन या एलर्जी महसूस हो तो उपयोग रोकें और चिकित्सक से संपर्क करें।",
  ],
  warnings: [
    "बच्चों की पहुंच से दूर रखें।",
    "यह उत्पाद किसी गंभीर प्रणालीगत बीमारी का विकल्प नहीं है। यदि लक्षण 3 सप्ताह में ठीक न हों तो चर्म रोग विशेषज्ञ को दिखाएं।",
  ],
  storage: "ठंडी व सूखी जगह पर रखें। सीधी धूप और अत्यधिक गर्मी से बचाएं। ढक्कन को हमेशा कसकर बंद रखें।",
  manufacturer: {
    name: "श्री धनवंतरी हर्बल्स एंड आयुर्वेद लैब",
    address: "प्लॉट नं. 14-B, रीको इंडस्ट्रियल एरिया, जयपुर - 302013, राजस्थान",
    licenseNo: "DL-AYU-RAJ-2024-8891",
  },
  marketer: {
    name: "माँ आयुर्वेदिक वेलनेस प्राइवेट लिमिटेड",
    address: "हेड ऑफिस: 402, शांति कॉम्प्लेक्स, एमजी रोड, जयपुर, राजस्थान - 302001",
    customerCarePhone: "+91 98765 43210",
    customerCareEmail: "care@maaayurvedic.in",
  },
  batchInfo: {
    batchNumber: "MAA-2026-OCT",
    mfgDate: "10/2026",
    expiryDate: "09/2029",
    shelfLife: "निर्माण की तिथि से 3 वर्ष (36 माह)",
  },
};

export const BUNDLE_OFFERS: BundleOffer[] = [
  {
    id: "bundle-1-pack",
    packCount: 1,
    title: "1 पैक (ट्रायल पैक)",
    subtitle: "हल्की या शुरुआती खुजली व दरार के लिए उपयुक्त",
    hindiTag: "शुरुआती उपयोग",
    mrpPaise: 69900,
    pricePaise: 49900,
    savingsPaise: 20000,
    savingsPercentage: 29,
    freeDelivery: true,
    active: true,
  },
  {
    id: "bundle-2-pack",
    packCount: 2,
    title: "2 पैक कॉम्बो (स्पेशल बचत)",
    subtitle: "पुराने दाद, खाज और बार-बार होने वाले संक्रमण के लिए 45 दिन का कोर्स",
    hindiTag: "सबसे लोकप्रिय ★",
    mrpPaise: 139800,
    pricePaise: 89900,
    savingsPaise: 49900,
    savingsPercentage: 36,
    freeDelivery: true,
    isPopular: true,
    active: true,
  },
  {
    id: "bundle-3-pack",
    packCount: 3,
    title: "3 पैक सम्पूर्ण राहत पैक",
    subtitle: "पूरे परिवार के लिए अथवा गंभीर सोरायसिस व पुरानी जिद्दी खुजली का पूर्ण समाधान",
    hindiTag: "सर्वोत्तम बचत पैक",
    mrpPaise: 209700,
    pricePaise: 124900,
    savingsPaise: 84800,
    savingsPercentage: 40,
    freeDelivery: true,
    isBestValue: true,
    active: true,
  },
];

export const COUPONS: Coupon[] = [
  {
    code: "MAA100",
    discountType: "fixed",
    discountValue: 10000, // ₹100
    minOrderPaise: 80000, // Min ₹800
    expiryDate: "2027-12-31",
    isActive: true,
    description: "₹800 से अधिक के आर्डर पर तुरंत ₹100 की छूट",
  },
  {
    code: "AYUR50",
    discountType: "fixed",
    discountValue: 5000, // ₹50
    minOrderPaise: 45000, // Min ₹450
    expiryDate: "2027-12-31",
    isActive: true,
    description: "सभी कॉम्बो पर ₹50 की अतिरिक्त छूट",
  },
  {
    code: "PREPAID10",
    discountType: "percentage",
    discountValue: 10, // 10%
    minOrderPaise: 80000,
    maxDiscountPaise: 20000,
    expiryDate: "2027-12-31",
    isActive: true,
    description: "ऑनलाइन पेमेंट पर 10% तक अतिरिक्त विशेष छूट",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    customerName: "राजेश कुमार शर्मा",
    city: "इटावा, उत्तर प्रदेश",
    rating: 5,
    title: "3 साल पुरानी दाद की समस्या में 15 दिन में आराम मिला",
    comment:
      "मैंने कई अंग्रेजी मलम लगाए लेकिन जब तक लगाओ तब तक आराम रहता था, बाद में दोबारा हो जाता था। माँ आयुर्वेदिक क्रीम के 2 डिब्बे इस्तेमाल किए और साथ में खट्टी चीजों का परहेज रखा। अब त्वचा बिल्कुल साफ है और कोई निशान भी नहीं बचा। बहुत बहुत धन्यवाद।",
    verifiedPurchase: true,
    isApproved: true,
    date: "12 अक्टूबर 2026",
  },
  {
    id: "rev-2",
    customerName: "सुनीता देवी",
    city: "इंदौर, मध्य प्रदेश",
    rating: 5,
    title: "हाथ और पैरों की खुजली और दरारों में बहुत ठंडक देती है",
    comment:
      "सर्दियों और बारिश में उंगलियों के बीच खाज-खुजली और कट लग जाते थे। इस क्रीम में कपूर और नीम की खुशबू है, लगाते ही जलन खत्म हो जाती है। 1 सप्ताह में ही कट भर गए।",
    verifiedPurchase: true,
    isApproved: true,
    date: "18 अक्टूबर 2026",
  },
  {
    id: "rev-3",
    customerName: "सुरेश पाटिल",
    city: "कोल्हापुर, महाराष्ट्र",
    rating: 5,
    title: "सोरायसिस के सूखे पैच और पपड़ी में राहत",
    comment:
      "कोहनी पर सोरायसिस की लाल पपड़ी जैसी चमड़ी बन जाती थी। यह क्रीम लगाने से सूखापन खत्म हो गया और पपड़ी झड़ना बंद हो गई। सबसे अच्छी बात यह प्राकृतिक है और कोई साइड इफ़ेक्ट नहीं हुआ।",
    verifiedPurchase: true,
    isApproved: true,
    date: "20 अक्टूबर 2026",
  },
  {
    id: "rev-4",
    customerName: "अनिल सिंह राठौड़",
    city: "बीकानेर, राजस्थान",
    rating: 5,
    title: "पैकेजिंग और डिलीवरी बहुत तेज, असली आयुर्वेदिक दवा",
    comment:
      "3 दिन में पार्सल घर आ गया था। क्रीम शुद्ध और अच्छी गुणवत्ता की है। साथ में परहेज का जो पर्चा दिया है वो बहुत काम का है। 2 पैक वाला कॉम्बो खरीदा था, पैसे वसूल हो गए।",
    verifiedPurchase: true,
    isApproved: true,
    date: "21 अक्टूबर 2026",
  },
];

export const FAQS = [
  {
    q: "माँ आयुर्वेदिक क्रीम किन-किन त्वचा समस्याओं में उपयोगी है?",
    a: "यह क्रीम मुख्य रूप से दाद (Ringworm), दरार, पुरानी खाज, खुजली (Itching), त्वचा की लालिमा, फंगल संक्रमण और सोरायसिस से उत्पन्न रूखेपन व पपड़ी को शांत करने में सहायक है।",
  },
  {
    q: "क्रीम का उपयोग कैसे करना चाहिए और दिन में कितनी बार लगाएं?",
    a: "प्रभावित स्थान को पहले गुनगुने पानी से धोकर सूखे साफ कपड़े से पोंछ लें। फिर थोड़ी सी क्रीम लेकर हल्के हाथों से पतली परत के रूप में लगाएं। इसे दिन में दो बार — सुबह नहाने के बाद और रात को सोने से पहले नियमित रूप से लगाएं।",
  },
  {
    q: "क्रीम लगाते समय किन-किन चीजों का परहेज (Dietary Restriction) रखना जरूरी है?",
    a: "उत्पाद के साथ दिए गए निर्देशानुसार खट्टी चीजों का सख्त परहेज रखें, जैसे: कच्चा नींबू, नींबू या आम का अचार, अमचूर, इमली, बासी दही, खट्टी छाछ, संतरा, मोसंबी, अंगूर, टमाटर केचप और पानी पूरी। खट्टी चीजों से खून में पित्त और त्वचा में खुजली बढ़ती है।",
  },
  {
    q: "क्या इसमें कोई स्टेरॉयड या हानिकारक केमिकल मिला हुआ है?",
    a: "बिल्कुल नहीं। माँ आयुर्वेदिक क्रीम 100% शुद्ध आयुर्वेदिक जड़ी-बूटियों जैसे नीम, हल्दी, करंज, शुद्ध गंधक और भीमसेनी कपूर से निर्मित है। इसमें किसी भी प्रकार का कृत्रिम स्टेरॉयड या हानिकारक प्रिजर्वेटिव नहीं है।",
  },
  {
    q: "ऑर्डर करने के बाद डिलीवरी कितने दिनों में होती है?",
    a: "सामान्यतः ऑर्डर की पुष्टि के 24 घंटे के भीतर पार्सल डिस्पैच कर दिया जाता है और 3 से 5 कार्य दिवसों (Business Days) में पूरे भारत में सुरक्षित रूप से आपके पते पर पहुंचा दिया जाता है।",
  },
  {
    q: "क्या 100% मनी-बैक गारंटी की सुविधा उपलब्ध है?",
    a: "हाँ, हम अपने प्रामाणिक फॉर्मूले पर पूरा भरोसा रखते हैं। यदि ग्राहक बताए गए निर्देशों और परहेज का 30 दिन तक पालन करने के बाद भी संतुष्ट नहीं होता है, तो वह हमारी पारदर्शी गारंटी नीति के तहत रिफंड का दावा कर सकता है।",
  },
  {
    q: "क्या डिलीवरी के समय नकद भुगतान (Cash on Delivery) उपलब्ध है?",
    a: "हाँ, आप ऑनलाइन पेमेंट (UPI, Google Pay, PhonePe, कार्ड्स) अथवा कैश ऑन डिलीवरी (COD) दोनों विकल्पों में से अपनी सुविधा अनुसार चुन सकते हैं।",
  },
];

export const SEO_AUDIT_REPORT: SEOAuditIssue[] = [
  {
    id: "seo-1",
    category: "meta",
    severity: "passed",
    title: "हिंदी टाइटल टैग्स एवं वर्णनात्मक मेटा विवरण",
    url: "/",
    description: "प्रत्येक मुख्य पृष्ठ पर प्रासंगिक हिंदी कीवर्ड्स (दाद, खाज, खुजली, सोरायसिस) के साथ अनुकूलित टाइटल और मेटा टैग्स मौजूद हैं।",
    recommendation: "शीर्षक 60 वर्णों के भीतर और मेटा विवरण 155 वर्णों के भीतर रखें।",
  },
  {
    id: "seo-2",
    category: "schema",
    severity: "passed",
    title: "स्ट्रक्चर्ड डेटा (JSON-LD) स्कीमा",
    url: "/product",
    description: "Product, Organization, Offer और BreadcrumbList का मान्य JSON-LD स्कीमा लोड हो रहा है।",
    recommendation: "उत्पाद की वास्तविक कीमत, रेटिंग और स्टॉक स्थिति निरंतर अपडेट रखें।",
  },
  {
    id: "seo-3",
    category: "content",
    severity: "passed",
    title: "सत्यापित दावों एवं मेडिकल डिस्क्लेमर का अनुपालन",
    url: "/educational-guide",
    description: "रोग मुक्ति के झूठे वादों के बिना शुद्ध पारंपरिक उपयोग एवं परहेज का स्पष्ट विवरण और डॉक्टर परामर्श सलाह जोड़ी गई है।",
    recommendation: "आयुष दिशानिर्देशों का कड़ाई से पालन करें।",
  },
  {
    id: "seo-4",
    category: "mobile",
    severity: "passed",
    title: "मोबाइल-प्रथम रिस्पॉन्सिव एवं टच सुलभता",
    url: "/",
    description: "सभी बटन, कार्ट और चेकआउट स्टेप्स 48px+ के टच टारगेट के साथ मोबाइल स्क्रीन पर बिना किसी होरिजॉन्टल ओवरफ्लो के चलते हैं।",
    recommendation: "धीमी इंटरनेट स्पीड (3G/4G) पर इमेज लोडिंग की निगरानी रखें।",
  },
  {
    id: "seo-5",
    category: "links",
    severity: "passed",
    title: "XML साइटमैप एवं Robots.txt",
    url: "/sitemap.xml",
    description: "sitemap.xml और robots.txt डायनेमिक रूप से जनरेट हो रहे हैं और सर्च इंजन क्रॉलर्स के लिए उपलब्ध हैं।",
    recommendation: "Google Search Console में sitemap.xml सबमिट करें।",
  },
];

export const DEFAULT_STORY_TESTIMONIALS: StoryTestimonial[] = [
  {
    id: "story-1",
    customerName: "राजेश कुमार शर्मा",
    city: "इटावा, उत्तर प्रदेश",
    concern: "3 साल पुरानी दाद (Ringworm)",
    duration: "14 दिन का कोर्स",
    rating: 5,
    beforeImageUrl: "/images/stories/daad_before.jpg",
    afterImageUrl: "/images/stories/daad_after.jpg",
    storyHindi:
      "3 साल से जांघ और बाजू पर दाद का लाल गोल चकत्ता था। कई केमिकल मलम लगाए लेकिन छोड़ते ही दुबारा फैल जाता था। माँ आयुर्वेदिक क्रीम को दिन में दो बार लगाया और खट्टा बंद रखा। 14 दिन में दाद का निशान तक पूरी तरह गायब हो गया।",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-15T10:00:00.000Z",
  },
  {
    id: "story-2",
    customerName: "सुनीता देवी",
    city: "इंदौर, मध्य प्रदेश",
    concern: "एड़ियों व हाथों की गहरी दरारें",
    duration: "10 दिन का उपयोग",
    rating: 5,
    beforeImageUrl: "/images/stories/cracks_before.jpg",
    afterImageUrl: "/images/stories/cracks_after.jpg",
    storyHindi:
      "सर्दियों में एड़ियों और उंगलियों में गहरे कट लग जाते थे और असहनीय टीस उठती थी। माँ आयुर्वेदिक क्रीम लगाते ही पहले दिन से जलन खत्म हो गई और 10 दिन में गहरी दरारें प्राकृतिक रूप से पूरी भर गईं।",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-18T14:30:00.000Z",
  },
  {
    id: "story-3",
    customerName: "सुरेश पाटिल",
    city: "कोल्हापुर, महाराष्ट्र",
    concern: "सोरायसिस के सूखे पैच व पपड़ी",
    duration: "21 दिन का कोर्स",
    rating: 5,
    beforeImageUrl: "/images/stories/daad_before.jpg",
    afterImageUrl: "/images/stories/daad_after.jpg",
    storyHindi:
      "कोहनी पर चांदी जैसी सफेद पपड़ी और लाल सूखे चकत्ते जमते थे। 2 पैक कॉम्बो का नियमित उपयोग किया और पूरे परहेज का पालन किया। त्वचा की पपड़ी झड़ना बंद हो गई और नया स्वस्थ रूप आ गया।",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-20T09:15:00.000Z",
  },
  {
    id: "story-4",
    customerName: "अनिल सिंह राठौड़",
    city: "बीकानेर, राजस्थान",
    concern: "जिद्दी पुरानी खुजली व लालिमा",
    duration: "15 दिन का कोर्स",
    rating: 5,
    beforeImageUrl: "/images/stories/cracks_before.jpg",
    afterImageUrl: "/images/stories/cracks_after.jpg",
    storyHindi:
      "धूल, पसीने और एलर्जी से लगातार खुजली रहती थी। भीमसेनी कपूर और नीम के अर्क ने तुरंत राहत दी। अब कोई जलन या लालिमा नहीं है। परिवार के लिए 3-पैक कॉम्बो मंगाया है।",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-21T16:45:00.000Z",
  },
];

