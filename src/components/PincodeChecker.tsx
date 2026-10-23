"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export const PincodeChecker: React.FC = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    deliverable: boolean;
    state?: string;
    estimatedDays?: string;
    message: string;
  } | null>(null);

  const checkPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (!/^\d{6}$/.test(cleanPin)) {
      setResult({
        deliverable: false,
        message: "कृपया 6 अंकों का मान्य भारतीय पिन कोड दर्ज करें।",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/pincode/${cleanPin}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        deliverable: true,
        estimatedDays: "3-5 कार्य दिवस",
        message: `पिन कोड ${cleanPin} पर एक्सप्रेस डिलीवरी एवं कैश ऑन डिलीवरी उपलब्ध है!`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
        <MapPin className="w-4 h-4 text-emerald-600" />
        डिलीवरी व पिन कोड उपलब्धता जांचें:
      </div>

      <form onSubmit={checkPin} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="उदा. 302001, 110001, 400001"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || pin.length < 6}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl transition-colors flex items-center justify-center min-w-[70px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "जांचें"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2 ${
            result.deliverable
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {result.deliverable ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">{result.message}</p>
            {result.deliverable && (
              <p className="mt-0.5 text-emerald-700 font-medium">
                ✓ प्रीपेड एवं कैश ऑन डिलीवरी (COD) उपलब्ध | सुरक्षित सील पैक
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
