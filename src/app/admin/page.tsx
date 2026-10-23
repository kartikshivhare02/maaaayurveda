"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { MAIN_PRODUCT } from "@/lib/data/mockData";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Package,
  Eye,
  CheckCircle,
  Truck,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const saved: Order[] = JSON.parse(localStorage.getItem("maa_orders") || "[]");
      if (saved.length > 0) {
        setOrders(saved);
      } else {
        // Seed initial representative orders for realistic demonstration
        const initialOrders: Order[] = [
          {
            id: "ord-1",
            orderNumber: "MAA-882109",
            customerName: "राजेश कुमार शर्मा",
            customerPhone: "9829012345",
            shippingAddress: {
              fullName: "राजेश कुमार शर्मा",
              phone: "9829012345",
              flatHouseNo: "मकान नं 42",
              streetLocality: "शास्त्री नगर",
              city: "जयपुर",
              state: "राजस्थान",
              pincode: "302016",
            },
            items: [
              {
                id: "bundle-2-pack",
                bundleId: "bundle-2-pack",
                title: "2 पैक कॉम्बो (स्पेशल बचत)",
                packCount: 2,
                unitPricePaise: 89900,
                totalPricePaise: 89900,
                mrpPaise: 139800,
                quantity: 1,
                image: "/images/product.jpeg",
              },
            ],
            subtotalPaise: 89900,
            discountPaise: 0,
            shippingPaise: 0,
            totalPaise: 89900,
            paymentMethod: "razorpay_online",
            paymentStatus: "paid",
            fulfillmentStatus: "shipped",
            courierName: "Delhivery",
            trackingNumber: "DLV9928172635",
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "ord-2",
            orderNumber: "MAA-882110",
            customerName: "सुनीता देवी",
            customerPhone: "9414054321",
            shippingAddress: {
              fullName: "सुनीता देवी",
              phone: "9414054321",
              flatHouseNo: "फ्लैट 201, साईं कृपा",
              streetLocality: "एमजी रोड",
              city: "इंदौर",
              state: "मध्य प्रदेश",
              pincode: "452001",
            },
            items: [
              {
                id: "bundle-1-pack",
                bundleId: "bundle-1-pack",
                title: "1 पैक (ट्रायल पैक)",
                packCount: 1,
                unitPricePaise: 49900,
                totalPricePaise: 49900,
                mrpPaise: 69900,
                quantity: 1,
                image: "/images/product.jpeg",
              },
            ],
            subtotalPaise: 49900,
            discountPaise: 0,
            shippingPaise: 0,
            totalPaise: 49900,
            paymentMethod: "cod",
            paymentStatus: "pending",
            fulfillmentStatus: "confirmed",
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "ord-3",
            orderNumber: "MAA-882111",
            customerName: "सुरेश पाटिल",
            customerPhone: "9822099887",
            shippingAddress: {
              fullName: "सुरेश पाटिल",
              phone: "9822099887",
              flatHouseNo: "प्लॉट 14",
              streetLocality: "ताराबाई पार्क",
              city: "कोल्हापुर",
              state: "महाराष्ट्र",
              pincode: "416003",
            },
            items: [
              {
                id: "bundle-3-pack",
                bundleId: "bundle-3-pack",
                title: "3 पैक सम्पूर्ण राहत पैक",
                packCount: 3,
                unitPricePaise: 124900,
                totalPricePaise: 124900,
                mrpPaise: 209700,
                quantity: 1,
                image: "/images/product.jpeg",
              },
            ],
            subtotalPaise: 124900,
            discountPaise: 10000,
            shippingPaise: 0,
            totalPaise: 114900,
            paymentMethod: "razorpay_online",
            paymentStatus: "paid",
            fulfillmentStatus: "delivered",
            courierName: "BlueDart",
            trackingNumber: "BD771829102",
            createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setOrders(initialOrders);
        localStorage.setItem("maa_orders", JSON.stringify(initialOrders));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalRevenuePaise = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + o.totalPaise, 0);

  const paidOrdersCount = orders.filter((o) => o.paymentStatus === "paid").length;
  const pendingOrdersCount = orders.filter((o) => o.paymentStatus === "pending").length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            डैशबोर्ड अवलोकन (Dashboard Overview)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            माँ आयुर्वेदिक क्रीम — ई-कॉमर्स बिक्री, स्टॉक एवं ऑर्डर विश्लेषण
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
          >
            सभी ऑर्डर्स देखें
          </Link>
          <Link
            href="/admin/seo"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            SEO ऑडिट चलाएं
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>सत्यापित कुल आय</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            ₹{(totalRevenuePaise / 100).toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            सत्यापित ऑनलाइन भुगतान से
          </p>
        </div>

        {/* Paid Orders */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>सत्यापित भुगतान ऑर्डर</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">{paidOrdersCount}</div>
          <p className="text-xs text-gray-500">कुल ऑर्डर: {orders.length}</p>
        </div>

        {/* Pending COD */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>लंबित COD भुगतान</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            {pendingOrdersCount}
          </div>
          <p className="text-xs text-gray-500">डिलीवरी पर वसूली योग्य</p>
        </div>

        {/* Stock Status */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>उपलब्ध स्टॉक (Units)</span>
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {MAIN_PRODUCT.stockCount}
          </div>
          <p className="text-xs text-emerald-600 font-semibold">पर्याप्त स्टॉक उपलब्ध</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">हाल के ऑर्डर (Recent Orders)</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              ग्राहकों द्वारा हाल ही में दर्ज किए गए ऑर्डर की सूची
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">ऑर्डर संख्या</th>
                <th className="py-3 px-4">ग्राहक</th>
                <th className="py-3 px-4">स्थान</th>
                <th className="py-3 px-4">राशि</th>
                <th className="py-3 px-4">भुगतान स्थिति</th>
                <th className="py-3 px-4">शिपिंग स्थिति</th>
                <th className="py-3 px-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.orderNumber} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">{ord.customerName}</div>
                    <div className="text-[11px] text-gray-400">{ord.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {ord.shippingAddress?.city}, {ord.shippingAddress?.state?.split(" ")[0]}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    ₹{ord.totalPaise / 100}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        ord.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.paymentStatus === "paid" ? "Paid" : "Pending COD"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {ord.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      प्रबंधित करें
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
