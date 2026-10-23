"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import { BRAND_INFO } from "@/lib/data/mockData";
import { PaymentMethod, ShippingAddress } from "@/types";
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";

// List of Indian States & UTs
const INDIAN_STATES = [
  "राजस्थान (Rajasthan)",
  "उत्तर प्रदेश (Uttar Pradesh)",
  "मध्य प्रदेश (Madhya Pradesh)",
  "दिल्ली (Delhi)",
  "हरियाणा (Haryana)",
  "पंजाब (Punjab)",
  "गुजरात (Gujarat)",
  "महाराष्ट्र (Maharashtra)",
  "बिहार (Bihar)",
  "उत्तराखंड (Uttarakhand)",
  "झारखंड (Jharkhand)",
  "छत्तीसगढ़ (Chhattisgarh)",
  "हिमाचल प्रदेश (Himachal Pradesh)",
  "पश्चिम बंगाल (West Bengal)",
  "ओडिशा (Odisha)",
  "असम (Assam)",
  "कर्नाटक (Karnataka)",
  "तेलंगाना (Telangana)",
  "आंध्र प्रदेश (Andhra Pradesh)",
  "तमिलनाडु (Tamil Nadu)",
  "केरल (Kerala)",
  "अन्य राज्य / केंद्र शासित प्रदेश",
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotalPaise,
    discountPaise,
    shippingPaise,
    finalTotalPaise,
    clearCart,
    appliedCoupon,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customer & Shipping Address State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    email: "",
    flatHouseNo: "",
    streetLocality: "",
    landmark: "",
    city: "",
    state: "राजस्थान (Rajasthan)",
    pincode: "",
  });

  // Payment method: "razorpay_online" or "cod"
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay_online");

  useEffect(() => {
    // If cart is empty, redirect back
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      try {
        const res = await fetch(`/api/pincode/${pin}`);
        const data = await res.json();
        if (data.deliverable && data.state) {
          // Auto select state if matches
          const match = INDIAN_STATES.find((s) => s.includes(data.state.split(" ")[0]));
          if (match) {
            setFormData((prev) => ({ ...prev, state: match }));
          }
        }
      } catch {
        // fallback
      }
    }
  };

  // Process Order and Payment
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone (10 digits)
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg("कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें।");
      return;
    }

    // Validate Pincode (6 digits)
    if (!/^\d{6}$/.test(formData.pincode)) {
      setErrorMsg("कृपया 6 अंकों का मान्य भारतीय पिन कोड दर्ज करें।");
      return;
    }

    if (!formData.fullName.trim() || !formData.flatHouseNo.trim() || !formData.streetLocality.trim() || !formData.city.trim()) {
      setErrorMsg("कृपया सभी आवश्यक पते के विवरण (मकान नं., क्षेत्र, शहर) भरें।");
      return;
    }

    setLoading(true);

    try {
      const orderNumber = `MAA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const orderPayload = {
        orderNumber,
        customerName: formData.fullName,
        customerPhone: cleanPhone,
        customerEmail: formData.email,
        shippingAddress: formData,
        items,
        subtotalPaise,
        discountPaise,
        shippingPaise,
        totalPaise: finalTotalPaise,
        paymentMethod,
        appliedCoupon: appliedCoupon?.code,
      };

      if (paymentMethod === "cod") {
        // Cash on delivery: Place directly
        // Save in localStorage for demo/persistence
        const existingOrders = JSON.parse(localStorage.getItem("maa_orders") || "[]");
        existingOrders.unshift({
          ...orderPayload,
          id: orderNumber,
          paymentStatus: "pending",
          fulfillmentStatus: "placed",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("maa_orders", JSON.stringify(existingOrders));

        clearCart();
        router.push(`/order-success/${orderNumber}?type=cod`);
        return;
      }

      // Online Payment via Razorpay
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerPhone: cleanPhone,
          customerName: formData.fullName,
        }),
      });

      const razorpayOrder = await res.json();
      if (!res.ok || !razorpayOrder.orderId) {
        throw new Error(razorpayOrder.error || "Order creation failed");
      }

      // Check if Razorpay script is in window, else simulate sandbox success
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock12345",
          amount: razorpayOrder.amount,
          currency: "INR",
          name: BRAND_INFO.name,
          description: "माँ आयुर्वेदिक क्रीम ऑर्डर भुगतान",
          image: BRAND_INFO.logoUrl,
          order_id: razorpayOrder.orderId,
          handler: async function (response: any) {
            // Verify signature
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderPayload,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              const existingOrders = JSON.parse(localStorage.getItem("maa_orders") || "[]");
              existingOrders.unshift({
                ...orderPayload,
                id: orderNumber,
                paymentStatus: "paid",
                fulfillmentStatus: "confirmed",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                createdAt: new Date().toISOString(),
              });
              localStorage.setItem("maa_orders", JSON.stringify(existingOrders));

              clearCart();
              router.push(`/order-success/${orderNumber}?type=prepaid`);
            } else {
              setErrorMsg("भुगतान सत्यापन विफल रहा। कृपया सहायता टीम से संपर्क करें।");
            }
          },
          prefill: {
            name: formData.fullName,
            contact: cleanPhone,
            email: formData.email || "",
          },
          theme: {
            color: "#0f4c3a",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Smooth Sandbox / Test Flow Simulation
        // Verify payment on backend with test signature
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockSignature = `sig_mock_${Date.now()}`;

        const verifyRes = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: razorpayOrder.orderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: mockSignature,
            orderData: orderPayload,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          const existingOrders = JSON.parse(localStorage.getItem("maa_orders") || "[]");
          existingOrders.unshift({
            ...orderPayload,
            id: orderNumber,
            paymentStatus: "paid",
            fulfillmentStatus: "confirmed",
            razorpayOrderId: razorpayOrder.orderId,
            razorpayPaymentId: mockPaymentId,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("maa_orders", JSON.stringify(existingOrders));

          clearCart();
          router.push(`/order-success/${orderNumber}?type=prepaid`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "ऑर्डर प्रक्रिया में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-700 font-medium mb-1"
            >
              <ChevronLeft className="w-4 h-4" />
              कार्ट में वापस जाएं
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              सुरक्षित चेकआउट (Secure Checkout)
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL एन्क्रिप्टेड सुरक्षित भुगतान</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Address & Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      डिलीवरी का पता (Shipping Details)
                    </h2>
                    <p className="text-xs text-gray-500">
                      जिस पते पर आप माँ आयुर्वेदिक क्रीम मंगवाना चाहते हैं
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        पूरा नाम (Full Name) *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="उदा. रमेश कुमार"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        10-अंकों का मोबाइल नंबर (Mobile No.) *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-sm font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-r-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ईमेल आईडी (Email Address) — वैकल्पिक
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="उदा. ramesh@gmail.com (ऑर्डर रसीद के लिए)"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        मकान नं. / फ्लैट नं. (Flat/House No.) *
                      </label>
                      <input
                        type="text"
                        name="flatHouseNo"
                        required
                        placeholder="मकान नं. 45-B"
                        value={formData.flatHouseNo}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        गली / मोहल्ला / इलाका (Locality/Street) *
                      </label>
                      <input
                        type="text"
                        name="streetLocality"
                        required
                        placeholder="शांति नगर, गांधी मार्ग"
                        value={formData.streetLocality}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        पिन कोड (6-Digit PIN) *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        placeholder="उदा. 302001"
                        value={formData.pincode}
                        onChange={handlePincodeChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        शहर / जिला (City) *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="उदा. जयपुर"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        राज्य (State) *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {INDIAN_STATES.map((st, i) => (
                          <option key={i} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      भुगतान का तरीका (Payment Method)
                    </h2>
                    <p className="text-xs text-gray-500">
                      सुरक्षित ऑनलाइन भुगतान अथवा कैश ऑन डिलीवरी चुनें
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "razorpay_online"
                        ? "border-emerald-600 bg-emerald-50/40"
                        : "border-gray-200 hover:border-emerald-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay_online"
                      checked={paymentMethod === "razorpay_online"}
                      onChange={() => setPaymentMethod("razorpay_online")}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          ऑनलाइन भुगतान (UPI, GPay, PhonePe, Paytm, Cards)
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          तेज व सुरक्षित
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Razorpay द्वारा संचालित 256-bit बैंक स्तर की सुरक्षा। त्वरित डिस्पैच।
                      </p>
                    </div>
                  </label>

                  {/* Cash On Delivery (COD) */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50/40"
                        : "border-gray-200 hover:border-emerald-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-700" />
                          कैश ऑन डिलीवरी (Cash on Delivery - COD)
                        </span>
                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                          पार्सल मिलने पर भुगतान
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        पार्सल घर पहुंचने पर कूरियर बॉय को नकद राशि का भुगतान करें।
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Pay Button */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
                <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
                  ऑर्डर विवरण (Items Summary)
                </h3>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.bundleId} className="flex items-center gap-3 text-sm">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-500">मात्रा: {item.quantity}</p>
                      </div>
                      <div className="text-right font-bold text-gray-900 text-sm">
                        ₹{item.totalPricePaise / 100}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>सबटोटल:</span>
                    <span className="font-medium text-gray-900">₹{subtotalPaise / 100}</span>
                  </div>
                  {discountPaise > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>कूपन छूट:</span>
                      <span>−₹{discountPaise / 100}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>शिपिंग शुल्क:</span>
                    <span className="text-emerald-700 font-bold uppercase text-xs">
                      मुफ्त (FREE)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                  <div>
                    <span className="font-black text-gray-900 text-base sm:text-lg">
                      कुल देय राशि:
                    </span>
                    <p className="text-[10px] text-gray-400">सभी कर व डिलीवरी सहित</p>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                    ₹{finalTotalPaise / 100}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-base sm:text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>ऑर्डर प्रोसेस हो रहा है...</span>
                    </>
                  ) : paymentMethod === "razorpay_online" ? (
                    <>
                      <span>ऑनलाइन भुगतान करें — ₹{finalTotalPaise / 100}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span>ऑर्डर कन्फर्म करें (COD) — ₹{finalTotalPaise / 100}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="space-y-2 pt-2 text-[11px] text-gray-500 text-center">
                  <p className="flex items-center justify-center gap-1.5 text-emerald-800 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    100% संतुष्टि अथवा धन वापसी गारंटी
                  </p>
                  <p>
                    ऑर्डर की पुष्टि के बाद 24 घंटे में डिस्पैच और लाइव ट्रैकिंग लिंक प्रदान किया जाएगा।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
