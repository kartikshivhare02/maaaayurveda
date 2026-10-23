"use client";

import React, { useState, useEffect } from "react";
import { Order, FulfillmentStatus, PaymentStatus } from "@/types";
import {
  Truck,
  Package,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ChevronDown,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form for updating shipping info
  const [editCourier, setEditCourier] = useState("Delhivery");
  const [editTracking, setEditTracking] = useState("");
  const [editStatus, setEditStatus] = useState<FulfillmentStatus>("shipped");

  useEffect(() => {
    try {
      const saved: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
      setOrders(saved);
      if (saved.length > 0) {
        setSelectedOrder(saved[0]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = orders.map((o) =>
      o.orderNumber === selectedOrder.orderNumber
        ? {
            ...o,
            fulfillmentStatus: editStatus,
            courierName: editCourier,
            trackingNumber: editTracking || o.trackingNumber,
            updatedAt: new Date().toISOString(),
          }
        : o
    );

    setOrders(updated);
    setSelectedOrder({
      ...selectedOrder,
      fulfillmentStatus: editStatus,
      courierName: editCourier,
      trackingNumber: editTracking || selectedOrder.trackingNumber,
    });
    localStorage.setItem("maa_orders", JSON.stringify(updated));
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);

    const matchesStatus =
      statusFilter === "all" || o.fulfillmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          ऑर्डर प्रबंधन (Orders Management)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          ग्राहकों के ऑर्डर देखें, शिपिंग स्थिति अपडेट करें और कूरियर ट्रैकिंग नंबर जोड़ें।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ऑर्डर नंबर, नाम या फोन से खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="all">सभी ऑर्डर (All)</option>
            <option value="placed">Placed (नया)</option>
            <option value="confirmed">Confirmed (पुष्टि)</option>
            <option value="shipped">Shipped (भेज दिया)</option>
            <option value="delivered">Delivered (डिलीवर)</option>
            <option value="cancelled">Cancelled (रद्द)</option>
          </select>
        </div>
      </div>

      {/* Two-Column: Orders List & Order Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">ऑर्डर सं.</th>
                  <th className="py-3 px-4">ग्राहक</th>
                  <th className="py-3 px-4">कुल राशि</th>
                  <th className="py-3 px-4">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      कोई ऑर्डर नहीं मिला।
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrder?.orderNumber === ord.orderNumber;
                    return (
                      <tr
                        key={ord.orderNumber}
                        onClick={() => setSelectedOrder(ord)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-emerald-50/70" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{ord.customerName}</div>
                          <div className="text-[11px] text-gray-400">{ord.customerPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          ₹{ord.totalPaise / 100}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              ord.fulfillmentStatus === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.fulfillmentStatus === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.fulfillmentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Order Detail Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium">ऑर्डर विवरण:</span>
                  <h3 className="text-lg font-mono font-bold text-gray-900">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                  title="प्रिंट करें"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                <p className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</p>
                <p className="text-gray-600">फोन: {selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-gray-600">ईमेल: {selectedOrder.customerEmail}</p>
                )}
                <p className="pt-1 text-gray-700">
                  <strong>पता:</strong> {selectedOrder.shippingAddress?.flatHouseNo},{" "}
                  {selectedOrder.shippingAddress?.streetLocality},{" "}
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state} -{" "}
                  {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>

              {/* Items in order */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                  आइटम (Purchased Items)
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-gray-100 bg-white"
                    >
                      <div>
                        <span className="font-bold text-gray-900 block">{it.title}</span>
                        <span className="text-gray-500">मात्रा: {it.quantity}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{it.totalPricePaise / 100}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Fulfillment Form */}
              <form onSubmit={handleUpdateStatus} className="pt-3 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase">
                  शिपिंग स्थिति एवं कूरियर अपडेट करें
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    फुलफिलमेंट स्थिति (Status)
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="confirmed">Confirmed (स्वीकृत)</option>
                    <option value="shipped">Shipped (डिस्पैच / मार्ग में)</option>
                    <option value="delivered">Delivered (सफलतापूर्वक डिलीवर)</option>
                    <option value="cancelled">Cancelled (रद्द किया गया)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      कूरियर पार्टनर
                    </label>
                    <select
                      value={editCourier}
                      onChange={(e) => setEditCourier(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
                    >
                      <option value="Delhivery">Delhivery</option>
                      <option value="BlueDart">BlueDart</option>
                      <option value="DTDC">DTDC</option>
                      <option value="India Post">India Post</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      AWB ट्रैकिंग नंबर
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. DLV882910"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  स्थिति सेव करें (Save Shipping Status)
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              कृपया विवरण देखने के लिए सूची से कोई ऑर्डर चुनें।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
