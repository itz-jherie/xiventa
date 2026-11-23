"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";

/**
 * Figma `Bottom Sheet` (app) / 480 px dialog (web PW28, PW29, PW33-35): white, radius 24
 * (top corners on phones), shadow 0 -12 32 rgba(23,43,58,0.16), 40 x 4 grabber, 20 / 26 bold title,
 * 36 px grey close, content padding 8 / 16 / 16, optional footer with Cancel + primary (52 px).
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-[rgba(23,43,58,0.48)] transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ ["--sheet-w" as string]: `${width}px` }}
        className={`absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[24px] bg-white shadow-[0_-12px_32px_rgba(23,43,58,0.16)] transition duration-300 ease-out md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[var(--sheet-w)] md:max-h-[86vh] md:-translate-x-1/2 md:rounded-[24px] md:shadow-[0_12px_32px_rgba(23,43,58,0.16)] ${
          open ? "translate-y-0 md:-translate-y-1/2 md:opacity-100" : "translate-y-full md:-translate-y-[46%] md:opacity-0"
        }`}
      >
        <div className="flex h-4 shrink-0 justify-center pt-2 md:h-2 md:pt-0">
          <span className="h-1 w-10 rounded-full bg-[#B4BFCA] md:hidden" />
        </div>
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-1 md:px-6 md:pt-3">
          <h2 className="truncate text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2 md:px-6">{children}</div>
        {footer && <div className="flex shrink-0 gap-3 border-t border-[#E9EDF1] px-4 pt-3 md:px-6 md:pb-6">{footer}</div>}
        <div className="h-[max(24px,env(safe-area-inset-bottom))] shrink-0 md:hidden" />
      </div>
    </div>
  );
}

export const sheetPrimary = "flex h-[52px] flex-1 items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:bg-[#F5A3BF]";
export const sheetSecondary = "flex h-[52px] items-center justify-center rounded-[12px] border border-[#B4BFCA] bg-white px-5 text-[16px] leading-5 tracking-[-0.01em] text-[#172B3A]";

/**
 * Figma `Toast` (AM21 / AM24 Saved, Removed): 358 x 48 navy pill, radius 12, green check, white
 * 14 / 20 message and a 13 / 16 action. Sits above the bottom bar and fades out after 3 s.
 */
export function useToast() {
  const [toast, setToast] = useState<{ message: string; action?: string; onAction?: () => void; id: number } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);
  const show = (message: string, action?: string, onAction?: () => void) => setToast({ message, action, onAction, id: Date.now() });
  const node = toast ? (
    <div
      key={toast.id}
      role="status"
      className="fixed bottom-[108px] left-1/2 z-[95] flex h-12 w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 animate-[toast-in_240ms_ease-out] items-center gap-3 rounded-[12px] bg-[#172B3A] px-4 shadow-[0_12px_32px_rgba(23,43,58,0.16)] md:bottom-8"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#067647] text-white">
        <CheckIcon size={16} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] leading-5 text-white">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            setToast(null);
          }}
          className="shrink-0 text-[13px] leading-4 text-white underline-offset-2 hover:underline"
        >
          {toast.action}
        </button>
      )}
    </div>
  ) : null;
  return { show, node };
}
