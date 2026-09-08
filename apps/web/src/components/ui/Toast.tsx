"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type ToastTone = "neutral" | "success" | "error";
interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, string> = {
  neutral: "border-stone-200 bg-stone-25",
  success: "border-sage-100 bg-sage-50",
  error: "border-brick-100 bg-brick-50",
};

/**
 * Wrap the app (or apps/web/src/app/layout.tsx) in this provider once.
 * Then call useToast().showToast({...}) from any Client Component — used for
 * non-field form errors (login), failed mutations (mood save, vote, post), etc.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  const dismiss = (id: string) => setToasts((current) => current.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className={cn(
              "rounded-md border p-4 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out",
              toneStyles[toast.tone]
            )}
            duration={5000}
            onOpenChange={(open) => !open && dismiss(toast.id)}
          >
            <ToastPrimitive.Title className="text-sm font-medium text-stone-900">
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description && (
              <ToastPrimitive.Description className="mt-1 text-sm text-stone-700">
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
