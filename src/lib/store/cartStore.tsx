"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BundleOffer, CartItem, Coupon } from "@/types";
import { BUNDLE_OFFERS, COUPONS, MAIN_PRODUCT } from "@/lib/data/mockData";

interface CartContextType {
  items: CartItem[];
  addItem: (bundle: BundleOffer, qty?: number) => void;
  removeItem: (bundleId: string) => void;
  updateQuantity: (bundleId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  finalTotalPaise: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedBundle: BundleOffer;
  setSelectedBundle: (bundle: BundleOffer) => void;
  bundles: BundleOffer[];
  updateBundles: (updated: BundleOffer[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bundles, setBundles] = useState<BundleOffer[]>(BUNDLE_OFFERS);
  const [selectedBundle, setSelectedBundle] = useState<BundleOffer>(
    BUNDLE_OFFERS.find((b) => b.isPopular) || BUNDLE_OFFERS[0]
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedBundles = localStorage.getItem("maa_bundle_offers");
      if (savedBundles) {
        const parsedBundles: BundleOffer[] = JSON.parse(savedBundles);
        if (Array.isArray(parsedBundles) && parsedBundles.length > 0) {
          setBundles(parsedBundles);
          const popular = parsedBundles.find((b) => b.isPopular) || parsedBundles[0];
          setSelectedBundle(popular);
        }
      }

      const saved = localStorage.getItem("maa_ayurvedic_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          // Default to the popular 2-pack bundle
          const defaultBundle = BUNDLE_OFFERS.find((b) => b.isPopular) || BUNDLE_OFFERS[0];
          setItems([
            {
              id: defaultBundle.id,
              bundleId: defaultBundle.id,
              title: defaultBundle.title,
              packCount: defaultBundle.packCount,
              unitPricePaise: defaultBundle.pricePaise,
              totalPricePaise: defaultBundle.pricePaise,
              mrpPaise: defaultBundle.mrpPaise,
              quantity: 1,
              image: MAIN_PRODUCT.images[0],
            },
          ]);
        }
      } else {
        // Default popular 2-pack
        const defaultBundle = BUNDLE_OFFERS.find((b) => b.isPopular) || BUNDLE_OFFERS[0];
        setItems([
          {
            id: defaultBundle.id,
            bundleId: defaultBundle.id,
            title: defaultBundle.title,
            packCount: defaultBundle.packCount,
            unitPricePaise: defaultBundle.pricePaise,
            totalPricePaise: defaultBundle.pricePaise,
            mrpPaise: defaultBundle.mrpPaise,
            quantity: 1,
            image: MAIN_PRODUCT.images[0],
          },
        ]);
      }
    } catch {
      // Fallback
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("maa_ayurvedic_cart", JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isLoaded]);

  // Sync bundles across windows/events
  useEffect(() => {
    const handleBundleSync = () => {
      try {
        const saved = localStorage.getItem("maa_bundle_offers");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBundles(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("maa_bundles_updated", handleBundleSync);
    window.addEventListener("storage", handleBundleSync);
    return () => {
      window.removeEventListener("maa_bundles_updated", handleBundleSync);
      window.removeEventListener("storage", handleBundleSync);
    };
  }, []);

  const updateBundles = (updated: BundleOffer[]) => {
    setBundles(updated);
    try {
      localStorage.setItem("maa_bundle_offers", JSON.stringify(updated));
      window.dispatchEvent(new Event("maa_bundles_updated"));
    } catch {
      // ignore
    }
  };

  const addItem = (bundle: BundleOffer, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.bundleId === bundle.id);
      if (existing) {
        return prev.map((item) =>
          item.bundleId === bundle.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                totalPricePaise: (item.quantity + qty) * item.unitPricePaise,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: bundle.id,
          bundleId: bundle.id,
          title: bundle.title,
          packCount: bundle.packCount,
          unitPricePaise: bundle.pricePaise,
          totalPricePaise: bundle.pricePaise * qty,
          mrpPaise: bundle.mrpPaise * qty,
          quantity: qty,
          image: MAIN_PRODUCT.images[0],
        },
      ];
    });
  };

  const removeItem = (bundleId: string) => {
    setItems((prev) => prev.filter((item) => item.bundleId !== bundleId));
  };

  const updateQuantity = (bundleId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bundleId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.bundleId === bundleId
          ? {
              ...item,
              quantity,
              totalPricePaise: quantity * item.unitPricePaise,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalPaise = items.reduce((acc, item) => acc + item.totalPricePaise, 0);

  // Discount calculation
  let discountPaise = 0;
  if (appliedCoupon && subtotalPaise >= appliedCoupon.minOrderPaise) {
    if (appliedCoupon.discountType === "fixed") {
      discountPaise = appliedCoupon.discountValue;
    } else {
      const calculated = Math.round((subtotalPaise * appliedCoupon.discountValue) / 100);
      discountPaise = appliedCoupon.maxDiscountPaise
        ? Math.min(calculated, appliedCoupon.maxDiscountPaise)
        : calculated;
    }
  }

  // Free delivery for all prepaid and standard orders
  const shippingPaise = 0;
  const finalTotalPaise = Math.max(0, subtotalPaise - discountPaise + shippingPaise);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: "अमान्य कूपन कोड (Invalid Coupon Code)" };
    }

    if (subtotalPaise < found.minOrderPaise) {
      const minRs = found.minOrderPaise / 100;
      return {
        success: false,
        message: `यह कूपन न्यूनतम ₹${minRs} के ऑर्डर पर लागू होता है`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `कूपन '${cleanCode}' सफलतापूर्वक लागू किया गया!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalPaise,
        discountPaise,
        shippingPaise,
        finalTotalPaise,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedBundle,
        setSelectedBundle,
        bundles,
        updateBundles,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
