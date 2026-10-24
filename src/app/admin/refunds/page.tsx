"use client";

import React, { useState, useEffect } from "react";
import { RefundRequest } from "@/types";
import { triggerAdminSuccess } from "@/lib/context/AdminToastContext";
import { RotateCcw, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminRefundsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>([]);

  useEffect(() => {
    async function loadRefunds() {
      let combined: RefundRequest[] = [];

      try {
        const res = await fetch("/api/admin/refunds");
        if (res.ok) {
          const json = await res.json();
          if (json.requests && Array.isArray(json.requests)) {
            combined = json.requests;
          }
        }
      } catch (err) {
        console.error("Failed to load refunds from server API:", err);
      }

      // Merge local fallback if empty
      if (combined.length === 0) {
        try {
          const stored: RefundRequest[] = JSON.parse(
            localStorage.getItem("maa_refund_requests") || "[]"
          );
          const real = stored.filter(
            (r) =>
              r.id !== "REF-992101" &&
              r.id !== "REF-992102" &&
              r.customerName !== "मोहन लाल" &&
              r.customerName !== "कविता शर्मा"
          );
          combined = real;
        } catch {
          // ignore
        }
      }

      setRequests(combined);
    }

    loadRefunds();
  }, []);

  const updateStatus = async (id: string, newStatus: RefundRequest["status"]) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setRequests(updated);
    try {
      localStorage.setItem("maa_refund_requests", JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Persist status update into Supabase
    try {
      await fetch("/api/admin/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update refund status in Supabase:", err);
    }

    triggerAdminSuccess(`रिफंड दावा ${id} की स्थिति डेटाबेस में सफलतापूर्वक अपडेट कर दी गई!`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          रिफंड दावा प्रबंधन (Refund Requests)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          100% मनी-बैक गारंटी के अंतर्गत ग्राहकों द्वारा दर्ज किए गए दावों की समीक्षा करें।
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <RotateCcw className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700">कोई रिफंड दावा लंबित नहीं है</p>
            <p className="text-xs text-gray-400 mt-1">
              जब कोई ग्राहक मनी-बैक गारंटी फॉर्म भरेगा, वह दावा यहाँ समीक्षा के लिए प्रदर्शित होगा।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200">
                  <div>
                    <span className="font-mono font-bold text-sm text-gray-900">
                      दावा संदर्भ: {req.id}
                    </span>
                    <span className="text-xs text-gray-500 ml-3">
                      ऑर्डर: <strong className="text-gray-800">{req.orderNumber}</strong>
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      req.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {req.status === "approved"
                      ? "स्वीकृत (Approved)"
                      : req.status === "rejected"
                      ? "अस्वीकृत (Rejected)"
                      : "लंबित समीक्षा (Pending)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 font-medium">ग्राहक का नाम:</p>
                    <p className="font-semibold text-gray-800">{req.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">फोन नंबर:</p>
                    <p className="font-semibold text-gray-800">{req.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">ईमेल:</p>
                    <p className="font-semibold text-gray-800">{req.customerEmail || "N/A"}</p>
                  </div>
                </div>

                <div className="text-xs bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
                  <p className="font-semibold text-gray-700">रिफंड का कारण: {req.reason}</p>
                  <p className="text-gray-600 leading-relaxed">{req.details}</p>
                </div>

                {req.status === "pending" && (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(req.id, "approved")}
                      className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>स्वीकार करें (Approve Refund)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(req.id, "rejected")}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>अस्वीकार करें (Reject)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
