import Link from "next/link";

export default function OrganizerDashboard() {
  const stats = [
    { label: "Total Ticket Revenue", value: "₦4,850,000", change: "+18% this month" },
    { label: "Tickets Sold", value: "342", change: "Across 2 events" },
    { label: "Check-in Rate", value: "94.2%", change: "Fast scanner active" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tightest text-brand-500">
            Xiventa Host
          </Link>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Organizer Portal
          </span>
        </div>

        <Link
          href="/events/new"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm"
        >
          Create New Event
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-2xl font-bold tracking-tightest text-slate-900 mb-6">
          Organizer Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-elevation-1"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
              <p className="text-xs font-semibold text-status-success-text mt-1">
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
