import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CheckIcon,
  ShieldCheckIcon,
  TicketIcon,
  BookmarkIcon,
  ShareIcon,
} from "@/components/icons";
import { getAllEvents, getEventBySlug } from "@/data";
import { TopNav } from "@/components/web/TopNav";
import { WebFooter } from "@/components/web/WebFooter";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";

export function generateStaticParams() {
  const events = getAllEvents();
  return events.map((e) => ({ id: e.slug }));
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * PW06 Event Detail Screen
 * 1:1 match with Figma screen `PW06 Event` (Node `313:18709`)
 */
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = getEventBySlug(id) || getAllEvents()[0];

  if (!event) {
    notFound();
  }

  const tiers = [
    {
      id: "reg",
      name: "Early Bird Admission",
      price: event.isFree ? "Free" : event.displayPrice,
      description: "Full access to venue, stage performances and main event grounds.",
      available: !event.isSoldOut,
    },
    {
      id: "vip",
      name: "VIP Guest Pass",
      price: event.isFree ? "Free (RSVP)" : `₦${(event.priceValue * 2.5).toLocaleString()}`,
      description: "Priority expedited entry, exclusive elevated lounge and welcome refreshment.",
      available: true,
    },
    {
      id: "table",
      name: "Reserved Table (4 Guests)",
      price: event.isFree ? "Free (Reservation)" : `₦${(event.priceValue * 8).toLocaleString()}`,
      description: "Dedicated reserved seating, bottle service package and dedicated host.",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172b3a]">
      <TopNav />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 pb-24 md:pb-16">
        {/* Back Link */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4d5e70] hover:text-brand-600 transition"
          >
            <ArrowLeftIcon size={16} />
            <span>Back to events</span>
          </Link>
        </div>

        {/* Hero Banner Grid (Image + Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Banner & Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-brand-600 shadow-sm backdrop-blur-xs">
                  {event.category}
                </span>
                {event.isFree && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                    Free Entry
                  </span>
                )}
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-brand-300 uppercase tracking-wider">
                  {event.dateLabel}
                </p>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Event Highlights & Host Card */}
            <div className="p-6 rounded-2xl bg-[#fdfff0] border border-stone-200/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-500/20">
                    {event.hostName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#172b3a]">
                      <span>{event.hostName}</span>
                      <ShieldCheckIcon size={16} className="text-brand-500" />
                    </div>
                    <p className="text-xs text-[#4d5e70]">Verified Host · Lagos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Save event"
                    className="p-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-[#172b3a] transition"
                  >
                    <BookmarkIcon size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Share event"
                    className="p-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-[#172b3a] transition"
                  >
                    <ShareIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#172b3a]">About this event</h2>
                <p className="text-sm sm:text-base text-[#4d5e70] leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Location & Time info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarIcon size={18} className="text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#172b3a]">Date and Time</p>
                    <p className="text-xs text-[#4d5e70]">{event.dateLabel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon size={18} className="text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#172b3a]">Location</p>
                    <p className="text-xs text-[#4d5e70]">{event.venueName}, {event.neighborhood}, {event.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Checkout Box */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <span className="text-xs text-[#68788a] font-medium uppercase tracking-wider">Tickets</span>
                <span className="text-2xl font-extrabold text-[#172b3a]">{event.displayPrice}</span>
              </div>

              {/* Tiers List */}
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/20 transition cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-[#172b3a]">
                      <span>{tier.name}</span>
                      <span className="text-brand-600">{tier.price}</span>
                    </div>
                    <p className="text-xs text-[#4d5e70] leading-snug">{tier.description}</p>
                  </div>
                ))}
              </div>

              {/* Purchase Action Button */}
              <button
                type="button"
                className="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-98"
              >
                <TicketIcon size={18} />
                <span>{event.isFree ? "RSVP for Free" : "Buy Tickets"}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#68788a]">
                <CheckIcon size={14} className="text-emerald-500" />
                <span>Instant QR code ticket delivered to your phone</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebFooter />
      <MobileTabBar />
    </div>
  );
}
