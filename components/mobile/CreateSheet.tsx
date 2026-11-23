"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon } from "@/components/icons";
import { useSession } from "@/lib/session";
import { ActionRow, BuildingLineIcon, StoreLineIcon, TicketLineIcon } from "@/components/mobile/AppParts";

type Step = "pick" | "your-place";

/**
 * EC00 "What do you want to add?" bottom sheet (Figma 963:62292 / 963:62344 / 963:62409).
 * White sheet, top radius 24, shadow 0 -12 32 rgba(23,43,58,0.16), 40 x 4 grabber, 20 / 26 bold
 * title, 36 px grey close, rows with 4 px gap, 24 px bottom padding plus the home indicator space.
 *
 * Variants: guests see the same rows but each leads to sign in; a place owner gets "Update <place>"
 * first. Rule 18: Add a place asks "Is this your place?" before going on.
 */
export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const session = useSession();
  const guest = !session || session.status !== "signed-in";
  const ownedPlace = session?.status === "signed-in" ? session.ownsPlace : undefined;
  const [step, setStep] = useState<Step>("pick");

  const close = useCallback(() => {
    onClose();
    setStep("pick");
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);
  const go = (href: string) => {
    close();
    router.push(guest ? "/welcome" : href);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={open ? 0 : -1}
        onClick={close}
        className={`absolute inset-0 bg-[rgba(23,43,58,0.48)] transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="What do you want to add?"
        className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-[480px] rounded-t-[24px] bg-white pb-[calc(24px+max(24px,env(safe-area-inset-bottom)))] shadow-[0_-12px_32px_rgba(23,43,58,0.16)] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex h-4 justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-[#B4BFCA]" />
        </div>
        <div className="flex h-12 items-center justify-between px-4 pb-2 pt-1">
          <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">
            {step === "pick" ? "What do you want to add?" : "Is this your place?"}
          </h2>
          <button
            type="button"
            onClick={close}
            tabIndex={open ? 0 : -1}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
          {step === "pick" ? (
            <>
              {ownedPlace && (
                <ActionRow icon={<BuildingLineIcon />} title={`Update ${ownedPlace}`} subtitle="Hours, photos, reviews and events" onClick={() => go("/host/place")} />
              )}
              <ActionRow icon={<TicketLineIcon />} title="Post an event" subtitle="Start with your flyer" onClick={() => go(guest ? "/welcome" : "/create")} />
              <ActionRow
                icon={<StoreLineIcon />}
                title="Add a place"
                subtitle="A spot you run, or a great one you found"
                onClick={() => (guest ? go("/welcome") : setStep("your-place"))}
              />
            </>
          ) : (
            <>
              <ActionRow icon={<BuildingLineIcon />} title="I own or run it" subtitle="Add or claim it. We check it is yours." onClick={() => go("/dashboard")} />
              <ActionRow icon={<StoreLineIcon />} title="I found it" subtitle="Suggest it, with photos if you like" onClick={() => go("/suggest-place")} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
