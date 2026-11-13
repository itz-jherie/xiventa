import Link from "next/link";

export function generateStaticParams() {
  return [{ id: "neon-nights-lagos" }, { id: "afro-fusion-fest" }];
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  const event = {
    id,
    title: "Neon Nights Rooftop Party",
    category: "Nightlife",
    badgeColor: "bg-magenta-50 text-magenta-700",
    date: "Friday 28 November · 10 PM to 4 AM",
    venue: "Skyline Lounge",
    address: "Plot 12, Victoria Island, Lagos",
    description:
      "A rooftop night featuring high energy DJ sets, panoramic city views and curated cocktails. Join hundreds of party lovers for an unforgettable night.",
    organizer: {
      name: "Nightlife Lagos",
      verified: true,
      followers: "12.4k followers",
    },
    tiers: [
      {
        id: "reg",
        name: "Standard Entry",
        price: "₦15,000",
        description: "Access to the main rooftop deck and cocktail bars.",
        available: true,
      },
      {
        id: "vip",
        name: "VIP Lounge Pass",
        price: "₦35,000",
        description: "Priority queue, welcome glass of champagne, and elevated lounge access.",
        available: true,
      },
      {
        id: "table",
        name: "Table for 4",
        price: "₦180,000",
        description: "Reserved table, 1 premium bottle, dedicated host service.",
        available: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Top Header */}
      <nav className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition"
        >
          ← Back to Discovery
        </Link>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Event Details
        </span>
      </nav>

      {/* Hero Banner Area */}
      <div className="bg-gradient-to-br from-wine-900 to-slate-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-[10px] uppercase font-bold tracking-overline px-3 py-0.5 rounded-full ${event.badgeColor}`}
            >
              {event.category}
            </span>
            <span className="text-xs text-white/70">Verified Event</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tightest leading-tight">
            {event.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center font-bold text-xs text-white">
              NL
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                {event.organizer.name}
                <span className="text-mint-500 text-xs">✓</span>
              </p>
              <p className="text-[11px] text-white/60">{event.organizer.followers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 gap-6">
        {/* Info Card */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-elevation-1 space-y-4">
          <div>
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Date and Time
            </h2>
            <p className="text-sm font-bold text-slate-900">{event.date}</p>
            <p className="text-xs text-slate-500">Doors open at 10 PM prompt</p>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              Location
            </h2>
            <p className="text-sm font-bold text-slate-900">{event.venue}</p>
            <p className="text-xs text-slate-500">{event.address}</p>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              About This Event
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              {event.description}
            </p>
          </div>
        </section>

        {/* Ticket Tiers Selection */}
        <section className="space-y-3">
          <h2 className="text-base font-bold tracking-tighter-sm text-slate-900">
            Select Your Tickets
          </h2>

          <div className="space-y-3">
            {event.tiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-elevation-1 flex items-center justify-between hover:border-brand-500 transition cursor-pointer"
              >
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{tier.name}</h3>
                    <span className="text-[10px] font-semibold text-status-success-text bg-status-success-bg px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                  <p className="text-sm font-bold text-brand-600 mt-2">{tier.price}</p>
                </div>

                <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition whitespace-nowrap">
                  Add
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Bottom Purchase Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-3.5 flex items-center justify-between z-50 shadow-elevation-2">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Starting from
          </span>
          <span className="text-lg font-bold text-slate-900">₦15,000</span>
        </div>

        <button className="px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm">
          Checkout Now
        </button>
      </footer>
    </div>
  );
}
