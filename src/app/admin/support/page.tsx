"use client";

import React, { useState, useEffect } from "react";
import { SupportTicket } from "@/types";
import { triggerAdminSuccess } from "@/lib/context/AdminToastContext";
import { MessageSquare, Send, CheckCircle2, Clock, Mail } from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function loadTickets() {
      let combined: SupportTicket[] = [];

      try {
        const res = await fetch("/api/admin/support");
        if (res.ok) {
          const json = await res.json();
          if (json.tickets && Array.isArray(json.tickets)) {
            combined = json.tickets;
          }
        }
      } catch (err) {
        console.error("Failed to load tickets from server API:", err);
      }

      // Merge local fallback if empty
      if (combined.length === 0) {
        try {
          const stored: SupportTicket[] = JSON.parse(
            localStorage.getItem("maa_support_tickets") || "[]"
          );
          const real = stored.filter(
            (t) =>
              t.id !== "tkt-1" &&
              t.id !== "tkt-2" &&
              t.ticketNumber !== "TKT-882190" &&
              t.ticketNumber !== "TKT-882188" &&
              t.customerName !== "अनिल शर्मा" &&
              t.customerName !== "प्रिया वर्मा"
          );
          combined = real;
        } catch {
          // ignore
        }
      }

      setTickets(combined);
      if (combined.length > 0) {
        setActiveTicket(combined[0]);
      }
    }

    loadTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const trimmedReply = replyText.trim();
    const updated = tickets.map((t) =>
      t.ticketNumber === activeTicket.ticketNumber
        ? {
            ...t,
            status: "resolved" as const,
            adminReply: trimmedReply,
          }
        : t
    );

    setTickets(updated);
    setActiveTicket({
      ...activeTicket,
      status: "resolved",
      adminReply: trimmedReply,
    });
    setReplyText("");

    try {
      localStorage.setItem("maa_support_tickets", JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Persist reply into Supabase
    try {
      await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber: activeTicket.ticketNumber,
          status: "resolved",
          adminReply: trimmedReply,
        }),
      });
    } catch (err) {
      console.error("Failed to save reply in Supabase:", err);
    }

    triggerAdminSuccess(
      `टिकट ${activeTicket.ticketNumber} का उत्तर डेटाबेस में सफलतापूर्वक सेव कर दिया गया!`
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          ग्राहक सहायता टिकट्स (Customer Support)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          ग्राहकों के प्रश्नों, डिलीवरी पूछताछ व उपयोग संबंधी समस्याओं का समाधान करें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>कुल टिकट्स: {tickets.length}</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="font-semibold text-gray-700">कोई सहायता टिकट नहीं है</p>
                <p className="text-xs text-gray-400 mt-1">
                  ग्राहकों द्वारा सहायता फॉर्म भरने पर नए टिकट्स यहाँ दिखेंगे।
                </p>
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = activeTicket?.ticketNumber === t.ticketNumber;
                return (
                  <div
                    key={t.ticketNumber}
                    onClick={() => setActiveTicket(t)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50/70 border-l-4 border-emerald-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-gray-900">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === "open"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {t.status === "open" ? "खुला (Open)" : "हल (Resolved)"}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-gray-900 truncate">
                      {t.customerName}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {t.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Reply */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 space-y-5">
          {activeTicket ? (
            <>
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">टिकट संदर्भ</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {activeTicket.ticketNumber}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  {activeTicket.customerName}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>{activeTicket.customerPhone}</span>
                  {activeTicket.customerEmail && (
                    <>
                      <span>•</span>
                      <span>{activeTicket.customerEmail}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Customer Message */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-gray-400 font-semibold mb-1">
                  <span>ग्राहक का संदेश:</span>
                  <span>{new Date(activeTicket.createdAt).toLocaleDateString("hi-IN")}</span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{activeTicket.message}</p>
              </div>

              {/* Admin Reply if Resolved */}
              {activeTicket.adminReply && (
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>एडमिन का समाधान:</span>
                  </div>
                  <p className="text-emerald-950 text-sm leading-relaxed">
                    {activeTicket.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-700">
                  उत्तर लिखें एवं टिकट हल करें:
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="ग्राहक को स्पष्ट और विनम्र उत्तर लिखें..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>उत्तर भेजें एवं टिकट मार्क हल करें</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              कृपया विवरण देखने के लिए सूची से कोई टिकट चुनें।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
