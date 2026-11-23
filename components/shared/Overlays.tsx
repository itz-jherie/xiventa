"use client";

import { useState } from "react";
import { ActionRow, TicketLineIcon } from "@/components/mobile/AppParts";
import { Sheet, sheetPrimary, sheetSecondary } from "@/components/shared/Sheet";
import { AlertIcon, GridIcon, MapIcon, MapPinIcon, PhoneIcon, QrCodeIcon, ShareIcon } from "@/components/icons";

type Toast = (message: string, action?: string, onAction?: () => void) => void;

/** AM23 Share sheet / PW28 Share (event, host, category, place, invite). */
export function ShareSheet({
  open,
  onClose,
  title = "Share event",
  subtitle,
  path,
  toast,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle: string;
  path: string;
  toast: Toast;
}) {
  const url = `xiventa.com${path}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
    } catch {}
    onClose();
    toast("Link copied");
  };
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <p className="pb-3 text-[13px] leading-[18px] text-[#4D5E70]">{subtitle}</p>
      <div className="flex flex-col gap-3">
        <ActionRow icon={<PhoneIcon size={20} />} title="Send on WhatsApp" subtitle="Opens WhatsApp with the link" href={`https://wa.me/?text=${encodeURIComponent(`${subtitle} https://${url}`)}`} />
        <ActionRow icon={<ShareIcon size={20} />} title="Share to your story" subtitle="Poster with a link sticker" onClick={() => { onClose(); toast("Poster saved to your photos"); }} />
        <ActionRow icon={<QrCodeIcon size={20} />} title="Show QR code" subtitle="Let friends scan it from your screen" onClick={() => { onClose(); toast("QR code ready"); }} />
        <ActionRow icon={<TicketLineIcon />} title="Copy link" subtitle={url} onClick={copy} />
        <ActionRow
          icon={<GridIcon size={20} />}
          title="More options"
          onClick={() => {
            if (navigator.share) navigator.share({ title: subtitle, url: `https://${url}` }).catch(() => {});
            else copy();
          }}
        />
      </div>
    </Sheet>
  );
}

const REASONS: [string, string?][] = [
  ["Fake or scam", "The event does not exist or is not run by this host"],
  ["Misleading details", "Wrong venue, date, price or line up"],
  ["Unsafe", "No safety measures or no age limit where needed"],
  ["Hate or harassment"],
  ["Sexual or adult content"],
  ["Pretending to be someone else"],
  ["Spam"],
  ["Something else"],
];

/** AM26 Report / PW29 Report (event, host, place) with the PW29 "Report sent" confirmation. */
export function ReportSheet({ open, onClose, what = "event", toast }: { open: boolean; onClose: () => void; what?: "event" | "host" | "place"; toast: Toast }) {
  const [reason, setReason] = useState<string | null>(null);
  const close = () => {
    onClose();
    setReason(null);
  };
  return (
    <Sheet
      open={open}
      onClose={close}
      title={`Report this ${what}`}
      footer={
        <>
          <button type="button" onClick={close} className={`${sheetSecondary} w-[92px]`}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason}
            onClick={() => {
              close();
              toast("Report sent. Thanks for telling us");
            }}
            className={sheetPrimary}
          >
            Send report
          </button>
        </>
      }
    >
      <div role="radiogroup" className="flex flex-col">
        {REASONS.map(([label, hint]) => {
          const on = reason === label;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setReason(label)}
              className={`flex items-center gap-3 px-1 py-3 text-left ${hint ? "min-h-14" : "min-h-11"}`}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[12px] text-[#172B3A]">{label}</span>
                {hint && <span className="text-[12px] text-[#4D5E70]">{hint}</span>}
              </span>
              <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

/** AM35 Directions. */
export function DirectionsSheet({ open, onClose, name, address, toast }: { open: boolean; onClose: () => void; name: string; address: string; toast: Toast }) {
  const q = encodeURIComponent(`${name}, ${address}, Lagos`);
  return (
    <Sheet open={open} onClose={onClose} title="Get directions">
      <ActionRow icon={<MapIcon size={20} />} title="Open in your maps app" subtitle={`${name}, ${address.split(",")[0]}`} href={`https://maps.google.com/?q=${q}`} />
      <ActionRow
        icon={<MapPinIcon size={20} />}
        title="Copy address"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${name}, ${address}`);
          } catch {}
          onClose();
          toast("Address copied");
        }}
      />
      <p className="text-[12px] leading-4 text-[#68788A]">Opens outside Xiventa.</p>
    </Sheet>
  );
}

/** Figma `Notice Banner`: radius 16, 12 / 16 padding, 20 px icon, 13 / 16 title and 12 / 16 body. */
export function Notice({
  tone,
  title,
  body,
  action,
  onAction,
}: {
  tone: "red" | "blue";
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  const red = tone === "red";
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${red ? "bg-[#FFECEB]" : "bg-[#E6F1FF]"}`}>
      <AlertIcon size={20} className={`shrink-0 ${red ? "text-[#C0231A]" : "text-[#0059BE]"}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[13px] leading-4 text-[#172B3A]">{title}</p>
        <p className="text-[12px] leading-4 text-[#4D5E70]">{body}</p>
      </div>
      {action && (
        <button type="button" onClick={onAction} className={`shrink-0 rounded-[8px] px-3 py-2 text-[13px] leading-4 ${red ? "text-[#C0231A]" : "text-[#0059BE]"} hover:bg-white/60`}>
          {action}
        </button>
      )}
    </div>
  );
}

/** AM21 Leaving Xiventa: "Opening Instagram" before handing off to a host's Instagram. */
export function LeavingSheet({ open, onClose, handle = "southcircle" }: { open: boolean; onClose: () => void; handle?: string }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Opening Instagram"
      footer={
        <>
          <button type="button" onClick={onClose} className={`${sheetSecondary} w-[92px]`}>
            Cancel
          </button>
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={sheetPrimary}>
            Open Instagram
          </a>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-[14px] leading-5 text-[#4D5E70]">Tickets for this event are sold by the host on their Instagram.</p>
        <Notice tone="red" title="Never pay by transfer to a personal account" body="Xiventa cannot help with this payment. Refunds and entry are handled by the host." />
      </div>
    </Sheet>
  );
}
