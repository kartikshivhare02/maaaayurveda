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
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage keys with versioning to prevent stale, corrupted, or legacy auto-added carts
const CART_STORAGE_KEY = "maa_ayurvedic_cart_v2";
const LEGACY_CART_STORAGE_KEY = "maa_ayurvedic_cart";
const BUNDLE_STORAGE_KEY = "maa_bundle_offers";

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

  // Helper to re-synchronize items with latest bundle pricing & active status
  const sanitizeCartItems = (rawItems: any[], activeBundles: BundleOffer[]): CartItem[] => {
    if (!Array.isArray(rawItems) || rawItems.length === 0) return [];
    return rawItems
      .filter((item) => activeBundles.some((b) => b.id === item.bundleId && b.active !== false))
      .map((item) => {
        const bundle = activeBundles.find((b) => b.id === item.bundleId)!;
        const qty = Math.max(1, Number(item.quantity) || 1);
        return {
          id: bundle.id,
          bundleId: bundle.id,
          title: bundle.title,
          packCount: bundle.packCount,
          unitPricePaise: bundle.pricePaise,
          totalPricePaise: bundle.pricePaise * qty,
          mrpPaise: bundle.mrpPaise * qty,
          quantity: qty,
          image: item.image || MAIN_PRODUCT.images[0],
        };
      });
  };

  // Load from localStorage on mount & clean up legacy/stale caches
  useEffect(() => {
    try {
      // 1. Immediately purge legacy unversioned cart that may contain auto-added items
      localStorage.removeItem(LEGACY_CART_STORAGE_KEY);

      let effectiveBundles = defaultBundles;
      const savedBundles = localStorage.getItem(BUNDLE_STORAGE_KEY);
      if (savedBundles) {
        const parsedBundles: BundleOffer[] = JSON.parse(savedBundles);
        if (Array.isArray(parsedBundles) && parsedBundles.length > 0) {
          // Check if cached bundles match current pricing; if prices differ, purge stale cache
          const isStale = parsedBundles.some((pb) => {
            const current = defaultBundles.find((db) => db.id === pb.id);
            return current && current.pricePaise !== pb.pricePaise;
          });

          if (!isStale) {
            setBundles(parsedBundles);
            effectiveBundles = parsedBundles;
            const popular = parsedBundles.find((b) => b.isPopular) || parsedBundles[0];
            setSelectedBundle(popular);
          } else {
            localStorage.removeItem(BUNDLE_STORAGE_KEY);
          }
        }
      }

      // 2. Load explicit user cart from versioned storage key & strictly validate against bundles
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const sanitized = sanitizeCartItems(parsedCart, effectiveBundles);
          if (sanitized.length > 0) {
            setItems(sanitized);
          } else {
            localStorage.removeItem(CART_STORAGE_KEY);
            setItems([]);
          }
        } catch {
          localStorage.removeItem(CART_STORAGE_KEY);
          setItems([]);
        }
      } else {
        // Guarantee cart is completely empty until user explicitly adds an item
        setItems([]);
      }

      // 3. Sync fresh bundle offers from Supabase and re-align cart items to authentic pricing
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
                localStorage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(mapped));
              } catch {}

              // Re-validate and re-price any existing cart items against fresh DB bundles
              setItems((prevItems) => {
                const updated = sanitizeCartItems(prevItems, mapped);
                if (updated.length === 0 && prevItems.length > 0) {
                  try {
                    localStorage.removeItem(CART_STORAGE_KEY);
                  } catch {}
                }
                return updated;
              });
            }
          }
        })
        .catch((err) => console.error("Failed to sync bundles from Supabase:", err));
    } catch {
      // Fallback: keep cart completely empty
      setItems([]);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      try {
        if (items.length === 0) {
          localStorage.removeItem(CART_STORAGE_KEY);
        } else {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
      } catch {
        // ignore
      }
    }
  }, [items, isLoaded]);

  // Sync bundles across windows/events
  useEffect(() => {
    const handleBundleSync = () => {
      try {
        const saved = localStorage.getItem(BUNDLE_STORAGE_KEY);
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
      localStorage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("maa_bundles_updated"));
    } catch {
      // ignore
    }
  };

  const addItem = (bundle: BundleOffer, qty = 1) => {
    // Resolve against active bundles state or fallback to ensure authentic pricing and product data
    const activeBundle =
      bundles.find((b) => b.id === bundle.id) ||
      defaultBundles.find((b) => b.id === bundle.id) ||
      bundle;
    const validQty = Math.max(1, Number(qty) || 1);

    setItems((prev) => {
      const existing = prev.find((item) => item.bundleId === activeBundle.id);
      if (existing) {
        const newQty = existing.quantity + validQty;
        return prev.map((item) =>
          item.bundleId === activeBundle.id
            ? {
                ...item,
                title: activeBundle.title,
                packCount: activeBundle.packCount,
                quantity: newQty,
                unitPricePaise: activeBundle.pricePaise,
                totalPricePaise: newQty * activeBundle.pricePaise,
                mrpPaise: newQty * activeBundle.mrpPaise,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: activeBundle.id,
          bundleId: activeBundle.id,
          title: activeBundle.title,
          packCount: activeBundle.packCount,
          unitPricePaise: activeBundle.pricePaise,
          totalPricePaise: activeBundle.pricePaise * validQty,
          mrpPaise: activeBundle.mrpPaise * validQty,
          quantity: validQty,
          image: MAIN_PRODUCT.images[0],
        },
      ];
    });
  };

  const removeItem = (bundleId: string) => {
    setItems((prev) => prev.filter((item) => item.bundleId !== bundleId));
  };

  const updateQuantity = (bundleId: string, quantity: number) => {
    const validQty = Number(quantity);
    if (!validQty || validQty <= 0) {
      removeItem(bundleId);
      return;
    }

    const bundle =
      bundles.find((b) => b.id === bundleId) ||
      defaultBundles.find((b) => b.id === bundleId);

    setItems((prev) =>
      prev.map((item) => {
        if (item.bundleId === bundleId) {
          const unitPrice = bundle ? bundle.pricePaise : item.unitPricePaise;
          const unitMrp = bundle ? bundle.mrpPaise : item.mrpPaise / item.quantity;
          return {
            ...item,
            quantity: validQty,
            unitPricePaise: unitPrice,
            totalPricePaise: validQty * unitPrice,
            mrpPaise: validQty * unitMrp,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalPaise = items.reduce((acc, item) => acc + item.totalPricePaise, 0);

  // Discount calculation
  let discountPaise = 0;
  if (items.length > 0 && appliedCoupon && subtotalPaise >= appliedCoupon.minOrderPaise) {
    if (appliedCoupon.discountType === "fixed") {
      discountPaise = Math.min(appliedCoupon.discountValue, subtotalPaise);
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
        isLoaded,
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
