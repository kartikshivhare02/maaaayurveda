"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { BRAND_INFO } from "@/lib/data/mockData";
import { Order } from "@/types";
import {
  User,
  Package,
  LogOut,
  MapPin,
  Lock,
  ArrowRight,
  ExternalLink,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Check if Supabase session exists
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }

    // Load local orders from localStorage
    try {
      const savedOrders: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
      setOrders(savedOrders);
      const savedUser = localStorage.getItem("maa_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      if (supabase && isSupabaseConfigured()) {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/account`,
          },
        });
      } else {
        // Fallback demo login when Supabase credentials are pending in .env
        const demoUser = {
          name: "प्रमाणित गूगल ग्राहक (Google User)",
          email: "customer@gmail.com",
          picture: null,
        };
        setUser(demoUser);
        setIsLoggedIn(true);
        localStorage.setItem("maa_user", JSON.stringify(demoUser));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("maa_user");
  };

  return (
    <div className="bg-[#fcfcfc] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              ग्राहक खाता एवं ऑर्डर (Account & Orders)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              अपने ऑर्डर का इतिहास देखें एवं प्रोफाइल प्रबंधित करें।
            </p>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              लॉगआउट
            </button>
          )}
        </div>

        {isLoggedIn ? (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                {user?.name?.[0] || user?.email?.[0] || "ग"}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {user?.name || user?.user_metadata?.full_name || "सत्यापित ग्राहक"}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {user?.email || user?.phone || "पंजीकृत खाता"}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                सक्रिय सत्र (Active)
              </span>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                आपके हाल के ऑर्डर (Order History)
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Package className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500">अभी तक कोई ऑर्डर दर्ज नहीं है।</p>
                  <Link
                    href="/#offers"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    विशेष कॉम्बो ऑफर देखें →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 space-y-3"
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
                            {ord.paymentStatus === "paid" ? "Paid" : "COD"}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {ord.fulfillmentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                        <span>कुल राशि: ₹{ord.totalPaise / 100}</span>
                        <span>डिलीवरी: {ord.shippingAddress?.city}, {ord.shippingAddress?.state}</span>
                        <Link
                          href={`/order-success/${ord.orderNumber}`}
                          className="font-bold text-emerald-700 hover:underline"
                        >
                          विवरण व इनवॉइस देखें →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Login Card - Google OAuth Only */
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
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-bold py-3.5 px-4 rounded-2xl shadow-xs transition-all text-sm group"
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
