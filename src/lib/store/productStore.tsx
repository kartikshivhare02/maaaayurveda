"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductImageItem } from "@/types";
import { MAIN_PRODUCT, DEFAULT_PRODUCT_IMAGES } from "@/lib/data/mockData";

interface ProductContextType {
  product: Product;
  images: ProductImageItem[];
  primaryImage: ProductImageItem;
  secondaryImages: ProductImageItem[];
  slidingImages: ProductImageItem[];
  updateProduct: (updated: Partial<Product>) => void;
  updateImages: (images: ProductImageItem[]) => void;
  setPrimaryImage: (id: string) => void;
  addImage: (item: Omit<ProductImageItem, "id">) => void;
  removeImage: (id: string) => void;
  moveImage: (index: number, direction: "up" | "down") => void;
  resetToDefault: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCT_STORAGE_KEY = "maa_admin_product_data";
const IMAGES_STORAGE_KEY = "maa_admin_product_images";

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<Product>(MAIN_PRODUCT);
  const [images, setImages] = useState<ProductImageItem[]>(DEFAULT_PRODUCT_IMAGES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount, and sync with Supabase
  useEffect(() => {
    // 1. Instant local render
    try {
      const savedProduct = localStorage.getItem(PRODUCT_STORAGE_KEY);
      if (savedProduct) {
        const parsed = JSON.parse(savedProduct);
        setProduct((prev) => ({
          ...prev,
          ...parsed,
          manufacturer: parsed.manufacturer?.name === "DAISY HERBAL" ? parsed.manufacturer : MAIN_PRODUCT.manufacturer,
          marketer: parsed.marketer?.name === "M/S MAA MEDICAL STORE" ? parsed.marketer : MAIN_PRODUCT.marketer,
          batchInfo: parsed.batchInfo?.batchNumber === "01" ? parsed.batchInfo : MAIN_PRODUCT.batchInfo,
        }));
      }

      const savedImages = localStorage.getItem(IMAGES_STORAGE_KEY);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setImages(parsedImages);
        }
      }
    } catch {
      // Fallback to default
    }
    setIsLoaded(true);

    // 2. Fresh sync from Supabase
    async function syncFromSupabase() {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const json = await res.json();
          if (json.product) {
            const p = json.product;
            setProduct((prev) => {
              const updated: Product = {
                ...prev,
                name: p.name || prev.name,
                hindiTitle: p.hindi_title || prev.hindiTitle,
                subtitle: p.subtitle ?? prev.subtitle,
                tagline: p.tagline ?? prev.tagline,
                description: p.description || prev.description,
                pricePaise: Number(p.price_paise) || prev.pricePaise,
                mrpPaise: Number(p.mrp_paise) || prev.mrpPaise,
                netQty: p.net_qty || prev.netQty,
                stockCount: typeof p.stock_count === "number" ? p.stock_count : prev.stockCount,
                inStock: typeof p.in_stock === "boolean" ? p.in_stock : prev.inStock,
                images: Array.isArray(p.images) && p.images.length > 0 ? p.images : prev.images,
                ingredients: Array.isArray(p.ingredients) && p.ingredients.length > 0 ? p.ingredients : prev.ingredients,
                manufacturer: p.manufacturer || prev.manufacturer,
                marketer: p.marketer || prev.marketer,
                batchInfo: p.batch_info || prev.batchInfo,
              };
              localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updated));
              return updated;
            });
          }
        }
      } catch (err) {
        console.error("Failed to sync product from Supabase:", err);
      }
    }

    syncFromSupabase();
  }, []);

  // Listen for storage / custom events from admin
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedProduct = localStorage.getItem(PRODUCT_STORAGE_KEY);
        if (savedProduct) {
          setProduct((prev) => ({ ...prev, ...JSON.parse(savedProduct) }));
        }
        const savedImages = localStorage.getItem(IMAGES_STORAGE_KEY);
        if (savedImages) {
          setImages(JSON.parse(savedImages));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("maa_product_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("maa_product_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const saveProductData = (updated: Product) => {
    setProduct(updated);
    try {
      localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("maa_product_updated"));
    } catch {
      // ignore
    }
  };

  const saveImagesData = (updatedImages: ProductImageItem[]) => {
    setImages(updatedImages);
    try {
      localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(updatedImages));
      // Also update product.images string array for backwards compatibility
      const urlList = updatedImages.map((img) => img.url);
      setProduct((prev) => {
        const nextProd = { ...prev, images: urlList };
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(nextProd));
        return nextProd;
      });
      window.dispatchEvent(new Event("maa_product_updated"));
    } catch {
      // ignore
    }
  };

  const updateProduct = (updated: Partial<Product>) => {
    const nextProduct = { ...product, ...updated };
    saveProductData(nextProduct);
  };

  const updateImages = (updatedImages: ProductImageItem[]) => {
    saveImagesData(updatedImages);
  };

  const setPrimaryImage = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
      type: (img.id === id ? "primary" : "secondary") as "primary" | "secondary",
    }));
    // Move primary image to the front of sliding list
    const primary = updated.find((img) => img.isPrimary);
    const secondaries = updated.filter((img) => !img.isPrimary);
    const sorted = primary ? [primary, ...secondaries] : updated;
    saveImagesData(sorted);
  };

  const addImage = (item: Omit<ProductImageItem, "id">) => {
    const newImage: ProductImageItem = {
      ...item,
      id: `img-${Date.now()}`,
    };
    let nextImages = [...images, newImage];
    if (newImage.isPrimary) {
      nextImages = nextImages.map((img) => ({
        ...img,
        isPrimary: img.id === newImage.id,
        type: img.id === newImage.id ? "primary" : "secondary",
      }));
    }
    saveImagesData(nextImages);
  };

  const removeImage = (id: string) => {
    if (images.length <= 1) {
      alert("कम से कम एक उत्पाद फोटो का होना आवश्यक है।");
      return;
    }
    const filtered = images.filter((img) => img.id !== id);
    // If the removed image was primary, make the first one primary
    if (!filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
      filtered[0].type = "primary";
    }
    saveImagesData(filtered);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    saveImagesData(reordered);
  };

  const resetToDefault = () => {
    localStorage.removeItem(PRODUCT_STORAGE_KEY);
    localStorage.removeItem(IMAGES_STORAGE_KEY);
    setProduct(MAIN_PRODUCT);
    setImages(DEFAULT_PRODUCT_IMAGES);
    window.dispatchEvent(new Event("maa_product_updated"));
  };

  const primaryImage = images.find((img) => img.isPrimary) || images[0] || DEFAULT_PRODUCT_IMAGES[0];
  const secondaryImages = images.filter((img) => img.id !== primaryImage?.id);
  // Sliding images: primary first, followed by secondaries
  const slidingImages = [primaryImage, ...secondaryImages].filter(Boolean);

  return (
    <ProductContext.Provider
      value={{
        product,
        images,
        primaryImage,
        secondaryImages,
        slidingImages,
        updateProduct,
        updateImages,
        setPrimaryImage,
        addImage,
        removeImage,
        moveImage,
        resetToDefault,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductStore = () => {
  const context = useContext(ProductContext);
  if (!context) {
    // Return graceful fallback if used outside provider
    return {
      product: MAIN_PRODUCT,
      images: DEFAULT_PRODUCT_IMAGES,
      primaryImage: DEFAULT_PRODUCT_IMAGES[0],
      secondaryImages: DEFAULT_PRODUCT_IMAGES.slice(1),
      slidingImages: DEFAULT_PRODUCT_IMAGES,
      updateProduct: () => {},
      updateImages: () => {},
      setPrimaryImage: () => {},
      addImage: () => {},
      removeImage: () => {},
      moveImage: () => {},
      resetToDefault: () => {},
    };
  }
  return context;
};
