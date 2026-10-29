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

export const CartProvider: React.FC<{
  children: React.ReactNode;
  initialBundles?: BundleOffer[];
}> = ({ children, initialBundles }) => {
  const defaultBundles =
    initialBundles && initialBundles.length > 0 ? initialBundles : BUNDLE_OFFERS;
  const [items, setItems] = useState<CartItem[]>([]);
  const [bundles, setBundles] = useState<BundleOffer[]>(defaultBundles);
  const [selectedBundle, setSelectedBundle] = useState<BundleOffer>(
    defaultBundles.find((b) => b.isPopular) || defaultBundles[0]
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
          // Check if parsedBundles are stale compared to defaultBundles
          const firstCurrent = defaultBundles[0];
          const firstParsed = parsedBundles.find((b) => b.id === firstCurrent?.id);
          const isStale = firstParsed && firstParsed.pricePaise !== firstCurrent.pricePaise;

          if (!isStale) {
            setBundles(parsedBundles);
            const popular = parsedBundles.find((b) => b.isPopular) || parsedBundles[0];
            setSelectedBundle(popular);
          } else {
            // Discard stale cache from localStorage
            localStorage.removeItem("maa_bundle_offers");
          }
        }
      }

      // Sync fresh bundle offers from Supabase
      fetch("/api/admin/bundles")
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.bundles && Array.isArray(json.bundles) && json.bundles.length > 0) {
            const mapped: BundleOffer[] = json.bundles
              .filter((b: any) => b.active !== false)
              .map((b: any) => ({
                id: b.id,
                packCount: b.pack_count,
                title: b.title,
                subtitle: b.subtitle || "",
                hindiTag: b.hindi_tag || "",
                mrpPaise: Number(b.mrp_paise),
                pricePaise: Number(b.price_paise),
                savingsPaise: Number(b.savings_paise),
                savingsPercentage: Number(b.savings_percentage),
                freeDelivery: b.free_delivery !== false,
                isPopular: Boolean(b.is_popular),
                isBestValue: Boolean(b.is_best_value),
                active: b.active !== false,
              }));

            if (mapped.length > 0) {
              setBundles(mapped);
              setSelectedBundle((curr) => {
                const stillExists = mapped.find((b) => b.id === curr.id);
                return stillExists || mapped.find((b) => b.isPopular) || mapped[0];
              });
              try {
                localStorage.setItem("maa_bundle_offers", JSON.stringify(mapped));
              } catch {}
            }
          }
        })
        .catch((err) => console.error("Failed to sync bundles from Supabase:", err));

      const saved = localStorage.getItem("maa_ayurvedic_cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        } catch {
          // ignore corrupted local storage
        }
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
    try {
      localStorage.removeItem("maa_ayurvedic_cart");
    } catch {
      // ignore
    }
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
