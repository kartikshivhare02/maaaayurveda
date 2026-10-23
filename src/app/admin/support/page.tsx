"use client";

import React, { useState } from "react";
import { SupportTicket } from "@/types";
import { MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-882190",
    customerName: "अनिल शर्मा",
    customerPhone: "9876543210",
    customerEmail: "anil@gmail.com",
    category: "delivery",
    message: "मेरा ऑर्डर MAA-882109 कब तक डिलीवर होगा? कूरियर ट्रैकिंग में देरी दिखा रहा है।",
    status: "open",
    createdAt: "2026-03-21T07:00:00.000Z",
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-882188",
    customerName: "प्रिया वर्मा",
    customerPhone: "9414001122",
    customerEmail: "priya@gmail.com",
    category: "product_usage",
    message: "क्या यह क्रीम चेहरे पर पिंपल्स के लिए लगा सकते हैं?",
    status: "resolved",
    adminReply: "नमस्ते प्रिया जी, माँ आयुर्वेदिक क्रीम मुख्य रूप से दाद, दरार, खुजली और सोरायसिस के लिए है। चेहरे के पिंपल्स पर इसे सीधे न लगाएं।",
    createdAt: "2026-03-20T14:00:00.000Z",
  },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(tickets[0]);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const updated = tickets.map((t) =>
      t.ticketNumber === activeTicket.ticketNumber
        ? {
            ...t,
            status: "resolved" as const,
            adminReply: replyText.trim(),
          }
        : t
    );

    setTickets(updated);
    setActiveTicket({
      ...activeTicket,
      status: "resolved",
      adminReply: replyText.trim(),
    });
    setReplyText("");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          ग्राहक सहायता टिकट्स (Support Tickets)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          ग्राहकों के प्रश्नों का उत्तर दें और टिकट की स्थिति को हल (Resolved) चिह्नित करें।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tickets List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-xs uppercase text-gray-700">
            सभी टिकट्स ({tickets.length})
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {tickets.map((t) => {
              const isSelected = activeTicket?.ticketNumber === t.ticketNumber;
              return (
                <div
                  key={t.ticketNumber}
                  onClick={() => setActiveTicket(t)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? "bg-emerald-50/70" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-gray-900">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === "open"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {t.status === "open" ? "खुला (Open)" : "Resolved"}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs truncate">
                    {t.customerName}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{t.message}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Conversation */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-5">
          {activeTicket ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono font-bold text-base text-gray-900">
                    {activeTicket.ticketNumber}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeTicket.customerName} ({activeTicket.customerPhone})
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700">
                  श्रेणी: {activeTicket.category}
                </span>
              </div>

              {/* Message from Customer */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  ग्राहक का संदेश:
                </span>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {activeTicket.message}
                </p>
              </div>

              {/* Existing Reply */}
              {activeTicket.adminReply && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    एडमिन उत्तर:
                  </span>
                  <p className="text-sm text-emerald-950 leading-relaxed">
                    {activeTicket.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-700">
                  ग्राहक को उत्तर भेजें (Send Reply to Customer)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="कृपया समाधान अथवा उत्तर लिखें..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>उत्तर भेजें एवं हल करें</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              कृपया देखने के लिए कोई टिकट चुनें।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
