import { XiventaWordmark } from "@/components/icons/XiventaWordmark";
import { ShieldCheckIcon } from "@/components/icons";
import type { MyTicket } from "@/data/mine";

/* 25 x 25 module grid read from the Figma `QR` instance on AM37 (static sample). */
const QR = "1111111010000011001111111,1000001110001010001000001,1011101110010011001011101,1011101100100100011011101,1011101010010110001011101,1000001000111000011000001,1111111000010011111111111,1111000001101001001011001,1000011101000001000000000,0100010000001010111000100,0001001110011011011001111,1110011101100110001101001,0010000101011010001100000,0000101100000011010001001,1101100001110000111101011,1001100111110000111010010,0000000110000000101100000,0100001110011111100101001,1111111101100000001110000,1000001000000010011010010,1011101100100001101001000,1011101001000010101101110,1011101001110010111010000,1000001000110010110100011,1111111100001000110000001".split(",");

function QrCode({ size = 168 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 25 25" shapeRendering="crispEdges" role="img" aria-label="Ticket QR code">
      <rect width="25" height="25" fill="#fff" />
      {QR.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#172B3A" /> : null)))}
    </svg>
  );
}

const BADGE = {
  green: "bg-[#E3F8EF] text-[#067647]",
  blue: "bg-[#E6F1FF] text-[#0059BE]",
  grey: "bg-[#F4F6F8] text-[#4D5E70]",
  amber: "bg-[#FFF6DD] text-[#8F5200]",
};

/** Status pill on the pass: Valid (#E3F8EF / #067647), Checked in (blue), Refunded (grey). */
export function ValidBadge({ label = "Valid", tone = "green" }: { label?: string; tone?: keyof typeof BADGE }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] leading-4 ${BADGE[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

/** Badge for a ticket's state. */
export function ticketBadge(t: MyTicket): { label: string; tone: keyof typeof BADGE } {
  if (t.status === "checked-in") return { label: "Checked in", tone: "blue" };
  if (t.status === "refunded") return { label: "Refunded", tone: "grey" };
  return { label: "Valid", tone: "green" };
}

/**
 * Figma `Ticket Pass` (AM37 / PW17): 342 wide white card, radius 24, shadow 0 4 16 rgba(23,43,58,0.10).
 * Pink header (padding 20, gap 12), three detail fields, dashed perforation with side notches,
 * 168 px QR, code, hint and the offline note. `web` uses PW17's "Regular × 2 / PAID" fields.
 */
export function TicketPass({ ticket, holder, web = false }: { ticket: MyTicket; holder: string; web?: boolean }) {
  const badge = ticketBadge(ticket);
  const fields = ticket.table
    ? [
        ["HOLDER", holder],
        ["TICKET", ticket.tier],
        ["TABLE", `For ${ticket.table.seats}`],
      ]
    : web
    ? [
        ["HOLDER", holder],
        ["TICKET", ticket.count > 1 && !ticket.tier.includes("+") ? `${ticket.tier} × ${ticket.count}` : ticket.tier],
        ["PAID", ticket.paid],
      ]
    : [
        ["HOLDER", holder],
        ["TICKET", ticket.tier],
        ["PRICE", ticket.unitPrice],
      ];
  return (
    <div className="relative w-full max-w-[342px] overflow-hidden rounded-[24px] bg-white shadow-[0_4px_16px_rgba(23,43,58,0.10)]">
      <div className="flex flex-col gap-3 bg-[#E22765] p-5">
        <div className="flex h-6 items-center justify-between">
          <XiventaWordmark width={87} height={20} wordColor="#FFFFFF" emblemColor="#FFFFFF" />
          <ValidBadge {...badge} />
        </div>
        <h2 className="text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-white">{ticket.event.title}</h2>
        <div className="flex flex-col gap-0.5 text-[14px] leading-5 text-white">
          <span className="whitespace-pre">{ticket.when}</span>
          <span className="opacity-90">{ticket.where}</span>
        </div>
      </div>
      <div className="flex gap-4 p-5">
        {fields.map(([k, v]) => (
          <div key={k} className={`flex flex-col gap-1 ${k === "TICKET" && ticket.table ? "w-[120px]" : "w-[90px]"}`}>
            <span className="text-[10px] uppercase leading-3 tracking-[0.04em] text-[#68788A]">{k}</span>
            <span className="whitespace-nowrap text-[14px] leading-[18px] text-[#172B3A]">{v}</span>
          </div>
        ))}
      </div>
      {ticket.online ? (
        web ? (
          <div className="flex flex-col items-center gap-2 border-t border-[#E9EDF1] px-6 py-5">
            <p className="text-[12px] leading-4 text-[#68788A]">No QR needed. Join from this page.</p>
            <p className="text-[12px] leading-4 text-[#067647]">Opens in the {ticket.online.platform} app.</p>
          </div>
        ) : null
      ) : (
        <>
      <div className="relative h-px">
        <div className="mx-5 border-t border-dashed border-[#B4BFCA]" />
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#F4F6F8]" />
        <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-[#F4F6F8]" />
      </div>
      <div className="flex flex-col items-center gap-2 p-6">
        <QrCode />
        <p className="mt-2 text-[14px] leading-[18px] text-[#172B3A]">{ticket.code}</p>
        <p className="text-[12px] leading-4 text-[#68788A]">
          {ticket.checkedIn ? `Checked in at ${ticket.checkedIn}. Enjoy the night.` : `Show this at the ${ticket.entry ?? "door"}. Brightness up helps.`}
        </p>
        <p className="flex items-center gap-1.5 text-[12px] leading-4 text-[#067647]">
          <ShieldCheckIcon size={14} />
          Saved on this phone. Works without data.
        </p>
      </div>
        </>
      )}
    </div>
  );
}
