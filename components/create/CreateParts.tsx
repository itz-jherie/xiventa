"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CloseIcon } from "@/components/icons";
import { Toggle } from "@/components/checkout/CheckoutParts";

/**
 * Create flow frame (EC01 to EC27). Phones get the full screen; on desktop the same screens sit in
 * a 430 px column, since the desktop create page is OW04 in the organizer dashboard.
 */
export function CreateShell({
  title,
  subtitle,
  onChangeHost,
  step,
  back,
  close = false,
  action,
  onAction,
  disabled,
  secondary,
  children,
  bare = false,
}: {
  title?: string;
  subtitle?: string;
  onChangeHost?: () => void;
  step?: { label: string; n: number; of: number };
  back?: string;
  close?: boolean;
  action?: string;
  onAction?: () => void;
  disabled?: boolean;
  secondary?: React.ReactNode;
  children: React.ReactNode;
  bare?: boolean;
}) {
  const router = useRouter();
  const goBack = () => (back ? router.push(back) : window.history.length > 1 ? router.back() : router.push("/m"));
  return (
    <div className="min-h-screen bg-white md:bg-[#F4F6F8] md:py-10">
      <div className={`relative mx-auto min-h-screen w-full max-w-[430px] bg-white pt-[env(safe-area-inset-top)] md:min-h-[844px] md:overflow-hidden md:rounded-[24px] md:shadow-[0_12px_32px_rgba(23,43,58,0.08)] ${action ? "pb-[120px]" : "pb-10"}`}>
        {!bare && (
          <div className="flex h-14 items-center gap-3 px-4">
            <button type="button" aria-label={close ? "Close" : "Back"} onClick={goBack} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
              {close ? <CloseIcon size={20} /> : <ArrowLeftIcon size={20} />}
            </button>
            <div className="flex min-w-0 flex-col">
              <h1 className="truncate text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{title}</h1>
              {subtitle && (
                <p className="truncate text-[12px] leading-4 text-[#68788A]">
                  {subtitle}
                  {onChangeHost && (
                    <>
                      {" · "}
                      <button type="button" onClick={onChangeHost} className="text-[#68788A] underline-offset-2 hover:underline">
                        Change
                      </button>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        )}
        {step && (
          <div className="flex flex-col gap-2 px-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-5 text-[#172B3A]">{step.label}</span>
              <span className="text-[12px] leading-4 text-[#68788A]">
                Step {step.n} of {step.of}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: step.of }, (_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i < step.n ? "bg-[#E22765]" : "bg-[#E9EDF1]"}`} />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col px-4 pt-4">{children}</div>
        {action && onAction && (
          <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 flex-col gap-1 border-t border-[#E9EDF1] bg-white px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              disabled={disabled}
              onClick={onAction}
              className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#E22765] px-5 text-[16px] leading-5 tracking-[-0.01em] text-white hover:bg-[#C81E57] disabled:bg-[#E9EDF1] disabled:text-[#8C99A7]"
            >
              {action}
            </button>
            {secondary}
          </div>
        )}
      </div>
    </div>
  );
}

/** EC01 option card: icon tile, title, hint and a radio. Selected: pink tint and border. */
export function ChoiceCard({ icon, title, sub, on, onClick }: { icon: React.ReactNode; title: string; sub: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left ${on ? "border-[#E22765] bg-[#FDEEF3]" : "border-[#E9EDF1] bg-white"}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${on ? "bg-white text-[#172B3A]" : "bg-[#F4F6F8] text-[#172B3A]"}`}>{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[12px] leading-4 text-[#172B3A]">{title}</span>
        <span className="text-[12px] leading-4 text-[#4D5E70]">{sub}</span>
      </span>
      <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
    </button>
  );
}

/** Pink pill chips (attend mode, categories, names, ages). */
export function Chips<T extends string>({ options, value, onChange, icons, after }: { options: readonly T[]; value: T[]; onChange: (v: T) => void; icons?: Partial<Record<T, React.ReactNode>>; after?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={`flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] leading-4 ${on ? "bg-[#E22765] text-white" : "border border-[#B4BFCA] bg-white text-[#4D5E70] hover:border-[#68788A]"}`}
          >
            {icons?.[o]}
            {o}
          </button>
        );
      })}
      {after}
    </div>
  );
}

/** A field that opens a picker: icon + value in the 48 px input style (Date, Starts, Venue). */
export function PickerField({ label, icon, value, placeholder, hint, onClick }: { label: string; icon: React.ReactNode; value?: string; placeholder?: string; hint?: string; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] leading-4 text-[#172B3A]">{label}</span>
      <button type="button" onClick={onClick} className="flex h-12 items-center gap-3 rounded-[12px] border border-[#D5DCE3] bg-white px-4 text-left hover:border-[#B4BFCA]">
        <span className="text-[#4D5E70]">{icon}</span>
        <span className={`truncate text-[14px] ${value ? "text-[#172B3A]" : "text-[#68788A]"}`}>{value || placeholder}</span>
      </button>
      {hint && <span className="text-[12px] leading-4 text-[#68788A]">{hint}</span>}
    </div>
  );
}

/** Row with an icon, title, hint and a switch (Hide the exact address, Free tickets, Limit spots). */
export function SwitchRow({ icon, title, sub, on, onChange }: { icon?: React.ReactNode; title: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex min-h-[66px] items-center gap-3 py-2">
      {icon && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{title}</span>
        {sub && <span className="text-[12px] leading-4 text-[#68788A]">{sub}</span>}
      </span>
      <Toggle on={on} onChange={onChange} label={title} />
    </div>
  );
}

export const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <span className={`pb-2 text-[13px] leading-4 text-[#172B3A] ${className}`}>{children}</span>;
export const Hint = ({ children, tone = "grey" }: { children: React.ReactNode; tone?: "grey" | "body" | "red" }) => (
  <span className={`pt-2 text-[12px] leading-4 ${tone === "red" ? "text-[#C0231A]" : tone === "body" ? "text-[#4D5E70]" : "text-[#68788A]"}`}>{children}</span>
);
