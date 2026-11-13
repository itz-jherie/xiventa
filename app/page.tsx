import Link from "next/link";
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  CalendarIcon,
  TicketIcon,
  BookmarkIcon,
  UserIcon,
  PlusIcon,
  NavigationIcon,
} from "@/components/icons";

export default function HomePage() {
  const categories = [
    { name: "Nightlife", color: "bg-magenta-50 text-magenta-700 border-magenta-200" },
    { name: "Festivals", color: "bg-violet-50 text-violet-700 border-violet-200" },
    { name: "Conferences", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Food & Drinks", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { name: "Wellness", color: "bg-mint-50 text-mint-700 border-mint-200" },
  ];

  const featuredEvents = [
    {
      id: "neon-nights-lagos",
      title: "Neon Nights Rooftop Party",
      category: "Nightlife",
      badgeColor: "bg-magenta-50 text-magenta-700",
      date: "Fri 28 Nov · 10 PM to 4 AM",
      venue: "Skyline Lounge, Victoria Island",
      price: "From ₦15,000",
      attendees: "230 going",
      distance: "1.4 km away",
      description: "A rooftop night with live DJs, city views and the best of Lagos nightlife.",
    },
    {
      id: "afro-fusion-fest",
      title: "Afro Fusion Live 2026",
      category: "Festivals",
      badgeColor: "bg-violet-50 text-violet-700",
      date: "Sat 29 Nov · 4 PM to 12 AM",
      venue: "Eko Atlantic Grounds",
      price: "From ₦25,000",
      attendees: "1,420 going",
      distance: "3.2 km away",
      description: "Sound, fashion, art and culinary popups along the Atlantic shore.",
    },
  ];

  return (
    <main className="flex-1 pb-24 md:pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
      {/* Top Bar / Brand Header */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <span className="text-2xl font-bold tracking-tightest text-brand-500">
            Xiventa
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mt-0.5">
            <MapPinIcon size={14} className="text-slate-400" />
            <span>Lagos, Nigeria</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/events/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <PlusIcon size={14} />
            <span>Create Event</span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold rounded-full bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero / Discovery Prompt */}
      <section className="py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tightest text-slate-900 leading-tight">
          Find your next night out.
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
          Discover verified events, offline-ready tickets, and places worth the trip across the city.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-5 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <SearchIcon
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by event, host or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
          </div>
          <button className="px-3.5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center">
            <FilterIcon size={16} />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-500 text-white whitespace-nowrap shadow-sm">
            All Events
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition hover:opacity-90 ${cat.color}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tighter-sm text-slate-900">
            Featured events near you
          </h2>
          <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
            See all
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredEvents.map((event) => (
            <article
              key={event.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-elevation-2 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-overline px-2.5 py-0.5 rounded-full ${event.badgeColor}`}
                  >
                    {event.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {event.distance} · {event.attendees}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tightest text-slate-900 mb-1">
                  {event.title}
                </h3>

                <p className="text-xs font-semibold text-brand-600 mb-2 flex items-center gap-1.5">
                  <CalendarIcon size={14} />
                  <span>{event.date}</span>
                </p>

                <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
                  <MapPinIcon size={14} className="text-slate-400" />
                  <span>{event.venue}</span>
                </p>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Tickets
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {event.price}
                  </span>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm flex items-center gap-1.5"
                >
                  <TicketIcon size={16} />
                  <span>Get tickets</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Mobile Bottom Navigation Bar (PWA Experience) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex items-center justify-around z-50 shadow-elevation-2">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-brand-500">
          <NavigationIcon size={20} />
          <span className="text-[10px] font-bold">Discover</span>
        </Link>
        <Link
          href="/tickets"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-900"
        >
          <TicketIcon size={20} />
          <span className="text-[10px] font-medium">My Tickets</span>
        </Link>
        <Link
          href="/saved"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-900"
        >
          <BookmarkIcon size={20} />
          <span className="text-[10px] font-medium">Saved</span>
        </Link>
        <Link
          href="/account"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-900"
        >
          <UserIcon size={20} />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>
    </main>
  );
}
