"use client";

import React, { useState, useEffect } from "react";
import { Order, FulfillmentStatus, PaymentStatus } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { triggerAdminSuccess } from "@/lib/context/AdminToastContext";
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
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form for updating shipping info
  const [editCourier, setEditCourier] = useState("Delhivery");
  const [editTracking, setEditTracking] = useState("");
  const [editStatus, setEditStatus] = useState<FulfillmentStatus>("shipped");

  const loadOrders = async (showToast = false) => {
    setIsRefreshing(true);
    let combined: Order[] = [];

    // 1. Fetch from server API (Supabase Admin)
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.orders && Array.isArray(json.orders)) {
          combined = json.orders;
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders from server API:", err);
    }

    // 2. Direct Supabase fallback if empty
    if (combined.length === 0 && supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          combined = data.map((d: any) => ({
            id: d.id,
            orderNumber: d.order_number,
            customerName: d.customer_name,
            customerPhone: d.customer_phone,
            customerEmail: d.customer_email,
            shippingAddress: d.shipping_address,
            items: d.items || [],
            subtotalPaise: d.subtotal_paise || 0,
            discountPaise: d.discount_paise || 0,
            shippingPaise: d.shipping_paise || 0,
            totalPaise: d.total_paise || 0,
            paymentMethod: d.payment_method || "cod",
            paymentStatus: d.payment_status || "pending",
            fulfillmentStatus: d.fulfillment_status || "placed",
            courierName: d.courier_name,
            trackingNumber: d.tracking_number,
            createdAt: d.created_at || new Date().toISOString(),
            updatedAt: d.updated_at || d.created_at || new Date().toISOString(),
          }));
        }
      } catch {
        // ignore
      }
    }

    // 3. LocalStorage merge without mock orders
    try {
      const saved: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
      const isMockOrder = (o: Order) =>
        o.id === "ord-1" ||
        o.id === "ord-2" ||
        o.id === "ord-3" ||
        o.orderNumber === "MAA-882109" ||
        o.orderNumber === "MAA-882110" ||
        o.orderNumber === "MAA-882111" ||
        o.customerName === "राजेश कुमार शर्मा" ||
        o.customerName === "सुनीता देवी" ||
        o.customerName === "सुरेश पाटिल";

      const realSaved = saved.filter((o) => !isMockOrder(o));
      if (realSaved.length !== saved.length) {
        localStorage.setItem("maa_orders", JSON.stringify(realSaved));
      }

      const existingNumbers = new Set(combined.map((o) => o.orderNumber));
      for (const o of realSaved) {
        if (!existingNumbers.has(o.orderNumber)) {
          combined.push(o);
          existingNumbers.add(o.orderNumber);
        }
      }
    } catch {
      // ignore
    }

    setOrders(combined);
    setSelectedOrder((curr) => {
      if (curr) {
        const found = combined.find((o) => o.orderNumber === curr.orderNumber);
        return found || (combined.length > 0 ? combined[0] : null);
      }
      return combined.length > 0 ? combined[0] : null;
    });

    setIsRefreshing(false);
    if (showToast) {
      triggerAdminSuccess(`डेटाबेस से ${combined.length} ऑर्डर लोड किए गए!`);
    }
  };

  useEffect(() => {
    loadOrders();

    // Auto-poll orders every 8 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 8000);

    // Refresh when user focuses the tab
    const handleFocus = () => loadOrders();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleSelectOrder = (o: Order) => {
    setSelectedOrder(o);
    setEditStatus(o.fulfillmentStatus);
    setEditCourier(o.courierName || "Delhivery");
    setEditTracking(o.trackingNumber || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
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

    // Update in Supabase via server admin endpoint
    try {
      await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: selectedOrder.orderNumber,
          fulfillmentStatus: editStatus,
          courierName: editCourier,
          trackingNumber: editTracking || selectedOrder.trackingNumber,
        }),
      });
    } catch (e) {
      console.error("Failed to update status in Supabase:", e);
    }

    triggerAdminSuccess(
      `ऑर्डर ${selectedOrder.orderNumber} की स्थिति डेटाबेस में सफलतापूर्वक सेव हो गई!`
    );
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
          ग्राहकों के वास्तविक ऑर्डर देखें, शिपिंग स्थिति अपडेट करें और कूरियर ट्रैकिंग नंबर जोड़ें।
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
            <option value="placed">नया ऑर्डर (Placed / New)</option>
            <option value="confirmed">Confirmed (स्वीकृत)</option>
            <option value="shipped">Shipped (डिस्पैच)</option>
            <option value="in_transit">In Transit (रास्ते में)</option>
            <option value="delivered">Delivered (डिलीवर)</option>
            <option value="cancelled">Cancelled (रद्द)</option>
          </select>

          <button
            onClick={() => loadOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            title="डेटाबेस से ताज़ा ऑर्डर प्राप्त करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span className="hidden sm:inline">{isRefreshing ? "रिफ्रेश..." : "ताज़ा करें (Refresh)"}</span>
          </button>
        </div>
      </div>

      {/* Layout: Orders List & Order Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>कुल परिणाम: {filteredOrders.length}</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="font-semibold text-gray-700">कोई ऑर्डर नहीं मिला</p>
                <p className="text-xs text-gray-400 mt-1">
                  स्टोर से नया ऑर्डर दर्ज होते ही यहाँ तुरंत दिखाई देगा।
                </p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.orderNumber === ord.orderNumber;
                return (
                  <div
                    key={ord.orderNumber}
                    onClick={() => handleSelectOrder(ord)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50/70 border-l-4 border-emerald-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          ord.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.paymentStatus === "paid" ? "Paid" : "COD"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div>
                        <span className="font-semibold text-gray-900">{ord.customerName}</span>{" "}
                        <span className="text-gray-400">({ord.customerPhone})</span>
                      </div>
                      <span className="font-bold text-gray-900">₹{ord.totalPaise / 100}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                      <span>{new Date(ord.createdAt).toLocaleDateString("hi-IN")}</span>
                      <span className="font-semibold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                        {ord.fulfillmentStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Order Actions & Details */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 space-y-6">
          {selectedOrder ? (
            <>
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">ऑर्डर विवरण</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {selectedOrder.orderNumber}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  {selectedOrder.customerName}
                </h2>
                <p className="text-xs text-gray-500">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-xs text-gray-500">{selectedOrder.customerEmail}</p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-gray-700">डिलीवरी का पता:</p>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress?.flatHouseNo},{" "}
                  {selectedOrder.shippingAddress?.streetLocality}
                </p>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{" "}
                  <span className="font-bold">{selectedOrder.shippingAddress?.pincode}</span>
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700">ऑर्डर उत्पाद:</p>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-gray-800">
                        {it.title} (x{it.quantity})
                      </span>
                      <span className="font-bold text-gray-900">
                        ₹{(it.totalPricePaise * it.quantity) / 100}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">माँ आयुर्वेदिक क्रीम कॉम्बो पैक</p>
                )}
                <div className="flex justify-between text-xs font-bold pt-2 border-t border-gray-100 text-gray-900">
                  <span>कुल राशि:</span>
                  <span className="text-emerald-700">₹{selectedOrder.totalPaise / 100}</span>
                </div>
              </div>

              {/* Update Shipping Status Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  शिपिंग स्थिति व कूरियर अपडेट
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as FulfillmentStatus)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="confirmed">Confirmed (ऑर्डर स्वीकृत)</option>
                    <option value="shipped">Shipped (डिस्पैच किया गया)</option>
                    <option value="in_transit">In Transit (रास्ते में)</option>
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
              <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              कृपया विवरण देखने के लिए सूची से कोई ऑर्डर चुनें।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
