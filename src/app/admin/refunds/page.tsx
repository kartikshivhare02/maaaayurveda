"use client";

import React, { useState } from "react";
import { RefundRequest } from "@/types";
import { RotateCcw, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminRefundsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>([
    {
      id: "REF-992101",
      orderNumber: "MAA-882109",
      customerName: "मोहन लाल",
      customerPhone: "9829102938",
      customerEmail: "mohan@gmail.com",
      reason: "नियमित उपयोग व परहेज के बाद भी पर्याप्त सुधार नहीं हुआ",
      details: "मैंने 25 दिन क्रीम लगाई और अचार-नींबू का परहेज रखा लेकिन चकत्ता अभी भी लाल है।",
      status: "pending",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "REF-992102",
      orderNumber: "MAA-882045",
      customerName: "कविता शर्मा",
      customerPhone: "9414987654",
      customerEmail: "kavita@yahoo.com",
      reason: "गलत अथवा क्षतिग्रस्त उत्पाद प्राप्त हुआ",
      details: "डिलीवरी के समय ढक्कन टूटा हुआ था।",
      status: "approved",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ]);

  const updateStatus = (id: string, newStatus: RefundRequest["status"]) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
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
          <p className="text-center py-8 text-gray-400 text-sm">कोई रिफंड दावा लंबित नहीं है।</p>
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
                    <span className="text-xs text-gray-500 ml-2">
                      (ऑर्डर: <strong className="text-gray-800">{req.orderNumber}</strong>)
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      req.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : req.status === "refunded"
                        ? "bg-emerald-100 text-emerald-800"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">ग्राहक:</span>
                    <span className="font-bold text-gray-900">{req.customerName}</span>
                    <span className="block text-gray-600">{req.customerPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block">कारण:</span>
                    <span className="font-bold text-gray-800">{req.reason}</span>
                    <p className="text-gray-600 mt-1 italic">&ldquo;{req.details}&rdquo;</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-gray-200/70">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, "approved")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors"
                      >
                        स्वीकृत करें (Approve)
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "rejected")}
                        className="bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors"
                      >
                        अस्वीकृत (Reject)
                      </button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <button
                      onClick={() => updateStatus(req.id, "refunded")}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-colors"
                    >
                      धन वापसी पूर्ण (Mark Refunded)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
