"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Order } from "@/types";
import {
  User,
  Package,
  LogOut,
  Lock,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  ShoppingBag,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function AccountPage() {
  const { user, isLoggedIn, isAdmin, loginWithGoogle, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    // Check URL query parameters for security notifications
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "unauthorized_admin") {
        setAuthNotice("यह खाता एडमिनिस्ट्रेटर के रूप में अधिकृत नहीं है। एडमिन डैशबोर्ड केवल अधिकृत एडमिन ईमेल के लिए उपलब्ध है।");
      } else if (params.get("authRequired") === "admin") {
        setAuthNotice("एडमिन पोर्टल का उपयोग करने के लिए कृपया अपने अधिकृत एडमिन Google खाते से लॉगिन करें।");
      }
    }

    // Load local orders from localStorage
    try {
      const savedOrders: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
      setOrders(savedOrders);
    } catch {
      // ignore
    }
  }, []);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] py-10 sm:py-14 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Security Notification Banner if redirected */}
        {authNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">सुरक्षा सूचना (Security Notice)</p>
              <p className="mt-0.5 text-amber-800">{authNotice}</p>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              ग्राहक खाता एवं ऑर्डर (Account & Orders)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              अपने ऑर्डर का इतिहास देखें, स्थिति ट्रैक करें एवं खाता प्रबंधित करें।
            </p>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              लॉगआउट
            </button>
          )}
        </div>

        {isLoggedIn ? (
          <div className="space-y-6">

            {/* Special Admin Dashboard Banner (ONLY Visible When Authenticated User is Admin) */}
            {isAdmin && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-gray-900 text-base sm:text-lg">
                        एडमिनिस्ट्रेटर डैशबोर्ड (Admin Portal)
                      </h3>
                      <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        प्रबंधक
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      उत्पाद सूची, कॉम्बो ऑफर, ग्राहक ऑर्डर, डिलीवरी स्थिति व रिफंड प्रबंधित करें।
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin"
                  id="account-admin-portal-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all shrink-0"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>एडमिन डैशबोर्ड खोलें</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl uppercase shrink-0">
                  {user?.name ? user.name.charAt(0) : <User className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {user?.name || "सत्यापित ग्राहक"}
                    </h3>
                    {isAdmin ? (
                      <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        एडमिनिस्ट्रेटर
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        सत्यापित ग्राहक
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">
                    {user?.email || "पंजीकृत खाता"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/track-order"
                  className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors"
                >
                  लाइव ऑर्डर ट्रैक करें
                </Link>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-700" />
                  <span>आपके हाल के ऑर्डर (Order History)</span>
                </h2>
                <span className="text-xs text-gray-400 font-medium">
                  कुल ऑर्डर: {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">अभी तक कोई ऑर्डर नहीं है</h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                    माँ आयुर्वेदिक क्रीम के विशेष कॉम्बो ऑफर देखें और दाद, खाज, खुजली से प्राकृतिक राहत पाएं।
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/#offers"
                      className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all"
                    >
                      <span>कॉम्बो ऑफर देखें</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 space-y-3 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/60">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">ऑर्डर संख्या:</span>
                          <span className="font-mono font-bold text-gray-900 ml-1.5 text-sm">
                            {ord.orderNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              ord.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.paymentStatus === "paid" ? "ऑनलाइन भुगतान" : "कैश ऑन डिलीवरी"}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 capitalize">
                            {ord.fulfillmentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                        <span className="font-bold text-gray-900">कुल राशि: ₹{ord.totalPaise / 100}</span>
                        <span>डिलीवरी: {ord.shippingAddress?.city}, {ord.shippingAddress?.state}</span>
                        <Link
                          href={`/order-success/${ord.orderNumber}`}
                          className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>विवरण व इनवॉइस</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Login Card - Clean Google OAuth Only (No guest checkout, no public admin buttons) */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm max-w-lg mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                ग्राहक लॉगिन (Google Auth)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                उच्च सुरक्षा और त्वरित प्रमाणीकरण के लिए केवल अपने आधिकारिक Google खाते द्वारा सुरक्षित लॉगिन करें।
              </p>
            </div>

            {/* Google OAuth Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-bold py-3.5 px-4 rounded-2xl shadow-xs transition-all text-sm group cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{authLoading ? "लॉगिन किया जा रहा है..." : "Google के साथ सुरक्षित लॉगिन करें"}</span>
              </button>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>सुरक्षित 256-बिट एन्क्रिप्शन प्रमाणीकरण (No Password Required)</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/track-order"
                className="text-xs text-emerald-800 hover:underline font-semibold"
              >
                बिना लॉगिन के केवल ऑर्डर नंबर से ट्रैक करें →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
