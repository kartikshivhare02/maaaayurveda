"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CheckCircle2, X } from "lucide-react";

interface AdminToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const AdminToastContext = createContext<AdminToastContextType>({
  showSuccess: () => {},
  showError: () => {},
});

export const useAdminToast = () => useContext(AdminToastContext);

// Global helper that can be called anywhere in admin code
export function triggerAdminSuccess(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("admin-toast-message", {
      detail: { type: "success", message },
    }));
  }
}

export function triggerAdminError(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("admin-toast-message", {
      detail: { type: "error", message },
    }));
  }
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showSuccess = useCallback((message: string) => {
    setToast({ type: "success", message });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ type: "error", message });
  }, []);

  // Listen to custom events
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: "success" | "error"; message: string }>;
      if (customEvent.detail?.message) {
        setToast({
          type: customEvent.detail.type || "success",
          message: customEvent.detail.message,
        });
      }
    };

    window.addEventListener("admin-toast-message", handleEvent);
    return () => window.removeEventListener("admin-toast-message", handleEvent);
  }, []);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <AdminToastContext.Provider value={{ showSuccess, showError }}>
      {children}

      {/* Floating Success Notification Bar */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92vw] sm:w-auto animate-bounce-in"
        >
          <div
            className={`flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-900/95 text-white border-emerald-500/80 shadow-emerald-950/50"
                : "bg-red-900/95 text-white border-red-500/80 shadow-red-950/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-wide">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-2"
              aria-label="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </AdminToastContext.Provider>
  );
}
