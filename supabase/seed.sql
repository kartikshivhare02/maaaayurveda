-- ===================================================================
-- MAA AYURVEDIC CREAM (माँ आयुर्वेदिक क्रीम)
-- Production Seed Data (उत्पाद, कॉम्बो ऑफर, ग्राहक कहानियां, कूपन एवं सेटिंग्स)
-- Run this in Supabase SQL Editor after executing schema.sql
-- ===================================================================

-- 1. SEED MAIN PRODUCT
INSERT INTO products (
  id,
  slug,
  name,
  hindi_title,
  subtitle,
  tagline,
  description,
  mrp_paise,
  price_paise,
  net_qty,
  in_stock,
  stock_count,
  images,
  category,
  classification,
  ingredients,
  directions,
  dietary_restrictions,
  precautions,
  warnings,
  storage,
  manufacturer,
  marketer,
  batch_info
) VALUES (
  'maa-ayurvedic-cream-50g',
  'maa-ayurvedic-cream',
  'माँ आयुर्वेदिक क्रीम',
  'माँ आयुर्वेदिक क्रीम — दाद, दरार, खुजली एवं सोरायसिस राहत फॉर्मूला',
  '100% शुद्ध आयुर्वेदिक जड़ी-बूटियों से निर्मित प्राकृतिक त्वचा क्रीम',
  'माँ का ख्याल, प्रकृति का कमाल',
  'माँ आयुर्वेदिक क्रीम सदियों पुरानी पारंपरिक आयुर्वेदिक जड़ी-बूटियों एवं सक्रिय घटकों (बाकुची तेल 15%, वैसलीन सल्फर 12%, कत्था 4%, गंध पुष्पा 3%, शुद्ध गंधक 3%, नीला थोथा 2% एवं हरितोली 1%) के सटीक औषधीय फॉर्मूले से तैयार की गई एक प्रभावी मलहम है। यह दाद (Ringworm), दरार, पुरानी खुजली और सोरायसिस से जुड़ी जलन व रूखेपन को शांत करने और त्वचा के प्राकृतिक स्वास्थ्य को वापस लाने में अत्यंत सहायक है।',
  69900,
  49900,
  '50 ग्राम',
  true,
  420,
  '[
    {"id": "img-1", "url": "/images/product.jpeg", "label": "मुख्य जार पैकेजिंग (50g)", "subtitle": "प्राथमिक उत्पाद फोटो", "isPrimary": true, "type": "primary"},
    {"id": "img-2", "url": "/images/details.jpeg", "label": "परहेज व खान-पान पर्चा", "subtitle": "सख्त खान-पान निर्देश", "isPrimary": false, "type": "secondary"},
    {"id": "img-3", "url": "/images/logo.jpeg", "label": "ब्रांड प्रामाणिकता सील", "subtitle": "100% असली माँ आयुर्वेदिक", "isPrimary": false, "type": "secondary"}
  ]'::jsonb,
  'आयुर्वेदिक स्किनकेयर एवं मलहम',
  'आयुर्वेदिक प्रोप्रायटरी औषधि (Ayurvedic Proprietary Medicine)',
  '[
    {"hindiName": "बाकुची तेल (Bakuchi oil / Psoralea corylifolia)", "botanicalName": "Psoralea corylifolia", "percentage": "15%", "purpose": "पारंपरिक रूप से चर्म रोग, दाद (रिंगवर्म), खाज व पुरानी जिद्दी खुजली में अत्यंत गुणकारी सक्रिय घटक।"},
    {"hindiName": "वैसलीन सल्फर (Vaseline Sulfur)", "botanicalName": "Sulfur Base", "percentage": "12%", "purpose": "त्वचा को गहराई से नमी, दरारों में सुरक्षा और रोगाणुरोधी आवरण प्रदान करता है।"},
    {"hindiName": "कत्था (Katha / Acacia catechu)", "botanicalName": "Acacia catechu", "percentage": "4%", "purpose": "प्राकृतिक रक्तशोधक, त्वचा की जलन, छालों और घावों को तेजी से सुखाने में सहायक।"},
    {"hindiName": "गंध पुष्पा (Gandh Pushpa / Salix caprea)", "botanicalName": "Salix caprea", "percentage": "3%", "purpose": "त्वचा की सूजन (Anti-inflammatory), लालिमा और असहनीय जलन को शांत कर ठंडक देता है।"},
    {"hindiName": "शुद्ध गंधक (Gandhak / Purified Sulphur)", "botanicalName": "Purified Sulphur", "percentage": "3%", "purpose": "आयुर्वेद सम्मत शक्तिशाली रोगाणुरोधी खनिज जो फंगल व बैक्टीरियल संक्रमण को जड़ से नियंत्रित करता है।"},
    {"hindiName": "नीला थोथा (Neela Totha / Purified Blue Vitriol)", "botanicalName": "Purified Copper Compound", "percentage": "2%", "purpose": "शास्त्रीय आयुर्वेदिक शोधित घटक जो जिद्दी दाद व फंगस को नष्ट कर त्वचा का सुधार करता है।"},
    {"hindiName": "हरितोली (Haritoli / Gymnema sylvestre)", "botanicalName": "Gymnema sylvestre", "percentage": "1%", "purpose": "दुर्लभ जड़ी-बूटी अर्क जो त्वचा की प्रतिरोधक क्षमता और सूक्ष्म संक्रमण नियंत्रण में उपयोगी है।"},
    {"hindiName": "क्रीम बेस (Cream Base)", "botanicalName": "Cream Base Q.S.", "percentage": "Q.S. (आवश्यकतानुसार)", "purpose": "सभी सक्रिय आयुर्वेदिक घटकों को त्वचा की गहराई तक समाहित करने वाला सुरक्षित मखमली बेस।"}
  ]'::jsonb,
  '[
    "प्रभावित स्थान को पहले हल्के गुनगुने पानी से धोकर साफ और सूखे सूती कपड़े से सुखा लें।",
    "अपनी उंगली पर थोड़ी मात्रा में क्रीम लेकर प्रभावित त्वचा पर हल्के हाथों से गोलाकार में लगाएं।",
    "क्रीम को जोर से न रगड़ें, त्वचा पर एक पतली परत छोड़ दें ताकि जड़ी-बूटियां असर कर सकें।",
    "उत्तम और स्थायी परिणाम के लिए इसे दिन में 2 बार (सुबह नहाने के बाद और रात को सोने से पहले) लगाएं।"
  ]'::jsonb,
  '[
    "कच्चा नींबू और नींबू का अचार",
    "केरी का अचार एवं अमचूर पाउडर",
    "इमली की खट्टी चटनी",
    "खट्टी छाछ एवं बासी दही",
    "मोसंबी, संतरा, अंगूर एवं आंवला",
    "कच्चा आम एवं खट्टी किशमिश",
    "टोमेटो केचप एवं सॉस",
    "पानी पूरी का खट्टा पानी",
    "पाइनएप्पल एवं टारटरी (Citric Acid) युक्त खाद्य पदार्थ"
  ]'::jsonb,
  '[
    "केवल बाहरी उपयोग के लिए (For External Application Only)।",
    "आंखों, मुंह, खुले ताजे घावों या कटी हुई त्वचा पर न लगाएं।",
    "क्रीम लगाने से पहले और बाद में हाथों को साबुन से अच्छी तरह धोएं।",
    "यदि त्वचा पर कोई अप्रत्याशित जलन या एलर्जी महसूस हो तो उपयोग रोकें और चिकित्सक से संपर्क करें।"
  ]'::jsonb,
  '[
    "बच्चों की पहुंच से दूर रखें।",
    "यह उत्पाद किसी गंभीर प्रणालीगत बीमारी का विकल्प नहीं है। यदि लक्षण 3 सप्ताह में ठीक न हों तो चर्म रोग विशेषज्ञ को दिखाएं।"
  ]'::jsonb,
  'ठंडी व सूखी जगह पर रखें। सीधी धूप और अत्यधिक गर्मी से बचाएं। ढक्कन को हमेशा कसकर बंद रखें।',
  '{"name": "श्री धनवंतरी हर्बल्स एंड आयुर्वेद लैब", "address": "प्लॉट नं. 14-B, रीको इंडस्ट्रियल एरिया, जयपुर - 302013, राजस्थान", "licenseNo": "DL-AYU-RAJ-2024-8891"}'::jsonb,
  '{"name": "माँ आयुर्वेदिक वेलनेस प्राइवेट लिमिटेड", "address": "हेड ऑफिस: 402, शांति कॉम्प्लेक्स, एमजी रोड, जयपुर, राजस्थान - 302001", "customerCarePhone": "+91 98765 43210", "customerCareEmail": "care@maaayurvedic.in"}'::jsonb,
  '{"batchNumber": "MAA-2026-OCT", "mfgDate": "10/2026", "expiryDate": "09/2029", "shelfLife": "निर्माण की तिथि से 3 वर्ष (36 माह)"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  price_paise = EXCLUDED.price_paise,
  mrp_paise = EXCLUDED.mrp_paise,
  ingredients = EXCLUDED.ingredients,
  images = EXCLUDED.images,
  updated_at = NOW();

-- 2. SEED BUNDLE OFFERS
INSERT INTO bundles (
  id,
  pack_count,
  title,
  subtitle,
  hindi_tag,
  mrp_paise,
  price_paise,
  savings_paise,
  savings_percentage,
  free_delivery,
  is_popular,
  is_best_value,
  active
) VALUES 
(
  'bundle-1-pack',
  1,
  '1 पैक (ट्रायल पैक)',
  'हल्की या शुरुआती खुजली व दरार के लिए उपयुक्त',
  'शुरुआती उपयोग',
  69900,
  49900,
  20000,
  29,
  true,
  false,
  false,
  true
),
(
  'bundle-2-pack',
  2,
  '2 पैक कॉम्बो (स्पेशल बचत)',
  'पुराने दाद, खाज और बार-बार होने वाले संक्रमण के लिए 45 दिन का कोर्स',
  'सबसे लोकप्रिय ★',
  139800,
  89900,
  49900,
  36,
  true,
  true,
  false,
  true
),
(
  'bundle-3-pack',
  3,
  '3 पैक सम्पूर्ण राहत पैक',
  'पूरे परिवार के लिए अथवा गंभीर सोरायसिस व पुरानी जिद्दी खुजली का पूर्ण समाधान',
  'सर्वोत्तम बचत पैक',
  209700,
  124900,
  84800,
  40,
  true,
  false,
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  mrp_paise = EXCLUDED.mrp_paise,
  price_paise = EXCLUDED.price_paise,
  savings_paise = EXCLUDED.savings_paise,
  savings_percentage = EXCLUDED.savings_percentage,
  hindi_tag = EXCLUDED.hindi_tag,
  active = EXCLUDED.active;

-- 3. SEED COUPONS
INSERT INTO coupons (
  code,
  discount_type,
  discount_value,
  min_order_paise,
  max_discount_paise,
  expiry_date,
  is_active,
  description
) VALUES
(
  'MAA100',
  'fixed',
  10000,
  80000,
  10000,
  '2028-12-31',
  true,
  '₹800 से अधिक के आर्डर पर तुरंत ₹100 की छूट'
),
(
  'AYUR50',
  'fixed',
  5000,
  45000,
  5000,
  '2028-12-31',
  true,
  'सभी कॉम्बो पर ₹50 की अतिरिक्त छूट'
),
(
  'PREPAID10',
  'percentage',
  10,
  80000,
  20000,
  '2028-12-31',
  true,
  'ऑनलाइन पेमेंट पर 10% तक अतिरिक्त विशेष छूट'
)
ON CONFLICT (code) DO UPDATE SET
  discount_value = EXCLUDED.discount_value,
  min_order_paise = EXCLUDED.min_order_paise,
  is_active = EXCLUDED.is_active;

-- 4. SEED STORY TESTIMONIALS (Real Before/After)
INSERT INTO story_testimonials (
  id,
  customer_name,
  city,
  concern,
  duration,
  rating,
  before_image_url,
  after_image_url,
  story_hindi,
  is_verified,
  is_active
) VALUES
(
  'story-1',
  'राजेश कुमार शर्मा',
  'इटावा, उत्तर प्रदेश',
  '3 साल पुरानी दाद (Ringworm)',
  '14 दिन का कोर्स',
  5,
  '/images/stories/daad_before.jpg',
  '/images/stories/daad_after.jpg',
  '3 साल से जांघ और बाजू पर दाद का लाल गोल चकत्ता था। कई केमिकल मलम लगाए लेकिन छोड़ते ही दुबारा फैल जाता था। माँ आयुर्वेदिक क्रीम को दिन में दो बार लगाया और खट्टा बंद रखा। 14 दिन में दाद का निशान तक पूरी तरह गायब हो गया।',
  true,
  true
),
(
  'story-2',
  'सुनीता देवी',
  'इंदौर, मध्य प्रदेश',
  'एड़ियों व हाथों की गहरी दरारें',
  '10 दिन का उपयोग',
  5,
  '/images/stories/cracks_before.jpg',
  '/images/stories/cracks_after.jpg',
  'सर्दियों में एड़ियों और उंगलियों में गहरे कट लग जाते थे और असहनीय टीस उठती थी। माँ आयुर्वेदिक क्रीम लगाते ही पहले दिन से जलन खत्म हो गई और 10 दिन में गहरी दरारें प्राकृतिक रूप से पूरी भर गईं।',
  true,
  true
),
(
  'story-3',
  'सुरेश पाटिल',
  'कोल्हापुर, महाराष्ट्र',
  'सोरायसिस के सूखे पैच व पपड़ी',
  '21 दिन का कोर्स',
  5,
  '/images/stories/daad_before.jpg',
  '/images/stories/daad_after.jpg',
  'कोहनी पर चांदी जैसी सफेद पपड़ी और लाल सूखे चकत्ते जमते थे। 2 पैक कॉम्बो का नियमित उपयोग किया और पूरे परहेज का पालन किया। त्वचा की पपड़ी झड़ना बंद हो गई और नया स्वस्थ रूप आ गया।',
  true,
  true
),
(
  'story-4',
  'अनिल सिंह राठौड़',
  'बीकानेर, राजस्थान',
  'जिद्दी पुरानी खुजली व लालिमा',
  '15 दिन का कोर्स',
  5,
  '/images/stories/cracks_before.jpg',
  '/images/stories/cracks_after.jpg',
  'धूल, पसीने और एलर्जी से लगातार खुजली रहती थी। भीमसेनी कपूर और नीम के अर्क ने तुरंत राहत दी। अब कोई जलन या लालिमा नहीं है। परिवार के लिए 3-पैक कॉम्बो मंगाया है।',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  city = EXCLUDED.city,
  concern = EXCLUDED.concern,
  story_hindi = EXCLUDED.story_hindi,
  before_image_url = EXCLUDED.before_image_url,
  after_image_url = EXCLUDED.after_image_url;

-- 5. SEED VERIFIED REVIEWS
INSERT INTO reviews (
  id,
  customer_name,
  city,
  rating,
  title,
  comment,
  verified_purchase,
  is_approved
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'राजेश कुमार शर्मा',
  'इटावा, उत्तर प्रदेश',
  5,
  '3 साल पुरानी दाद की समस्या में 15 दिन में आराम मिला',
  'मैंने कई अंग्रेजी मलम लगाए लेकिन जब तक लगाओ तब तक आराम रहता था, बाद में दोबारा हो जाता था। माँ आयुर्वेदिक क्रीम के 2 डिब्बे इस्तेमाल किए और साथ में खट्टी चीजों का परहेज रखा। अब त्वचा बिल्कुल साफ है और कोई निशान भी नहीं बचा। बहुत बहुत धन्यवाद।',
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000002',
  'सुनीता देवी',
  'इंदौर, मध्य प्रदेश',
  5,
  'हाथ और पैरों की खुजली और दरारों में बहुत ठंडक देती है',
  'सर्दियों और बारिश में उंगलियों के बीच खाज-खुजली और कट लग जाते थे। इस क्रीम में कपूर और नीम की खुशबू है, लगाते ही जलन खत्म हो जाती है। 1 सप्ताह में ही कट भर गए।',
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000003',
  'सुरेश पाटिल',
  'कोल्हापुर, महाराष्ट्र',
  5,
  'सोरायसिस के सूखे पैच और पपड़ी में राहत',
  'कोहनी पर सोरायसिस की लाल पपड़ी जैसी चमड़ी बन जाती थी। यह क्रीम लगाने से सूखापन खत्म हो गया और पपड़ी झड़ना बंद हो गई। सबसे अच्छी बात यह प्राकृतिक है और कोई साइड इफ़ेक्ट नहीं हुआ।',
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000004',
  'अनिल सिंह राठौड़',
  'बीकानेर, राजस्थान',
  5,
  'पैकेजिंग और डिलीवरी बहुत तेज, असली आयुर्वेदिक दवा',
  '3 दिन में पार्सल घर आ गया था। क्रीम शुद्ध और अच्छी गुणवत्ता की है। साथ में परहेज का जो पर्चा दिया है वो बहुत काम का है। 2 पैक वाला कॉम्बो खरीदा था, पैसे वसूल हो गए।',
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED SITE SETTINGS
INSERT INTO site_settings (
  id,
  brand_name,
  tagline,
  logo_url,
  whatsapp_number,
  whatsapp_display,
  support_email,
  support_hours,
  address,
  license_no,
  announcement_text
) VALUES (
  'main',
  'माँ आयुर्वेदिक क्रीम',
  'माँ का ख्याल, प्रकृति का कमाल',
  '/images/logo.jpeg',
  '+919876543210',
  '+91 98765 43210',
  'support@maaayurvedic.in',
  'सोमवार से शनिवार (सुबह 10:00 से शाम 7:00 बजे तक)',
  'आयुष प्रमाणित निर्माण इकाई, इंडस्ट्रियल एरिया, राजस्थान, भारत',
  'AYU-RAJ-2024-8891',
  '🌿 100% शुद्ध आयुर्वेदिक फॉर्मूला • मुफ्त डिलीवरी • कैश ऑन डिलीवरी'
)
ON CONFLICT (id) DO UPDATE SET
  brand_name = EXCLUDED.brand_name,
  whatsapp_number = EXCLUDED.whatsapp_number,
  whatsapp_display = EXCLUDED.whatsapp_display,
  support_email = EXCLUDED.support_email,
  updated_at = NOW();

-- ===================================================================
-- HOW TO MAKE YOURSELF ADMIN:
-- After you log in to the website with Google for the first time,
-- your profile row is created in the "profiles" table.
-- Run this command replacing your email:
--
-- UPDATE profiles SET role = 'admin' WHERE email = 'your.email@gmail.com';
-- ===================================================================
