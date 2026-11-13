import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-bold tracking-tightest text-brand-500">
            Xiventa
          </span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tightest text-slate-900">
          Welcome to Xiventa
        </h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Enter your phone number or email to access your tickets and events.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Phone or Email
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="+234 800 000 0000 or you@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-xs hover:bg-brand-600 transition shadow-sm"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed">
          By signing in, you agree to Xiventa Terms of Service and Privacy Policy. Tickets are stored securely for offline verification at venues.
        </p>
      </div>
    </div>
  );
}
