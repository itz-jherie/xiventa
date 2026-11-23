"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FOLLOWED_HOSTS, NOTIFICATIONS, type NoticeIcon } from "@/data/account";
import { initialsOf, updateSession, useSession } from "@/lib/session";
import { DEFAULT_SETTINGS, updateSettings, useSettings, type Settings } from "@/lib/account";
import { useAfterTicket } from "@/lib/afterTicket";
import { ActionRow, TicketLineIcon } from "@/components/mobile/AppParts";
import { Field, Toggle } from "@/components/checkout/CheckoutParts";
import { AccountShell } from "@/components/web/AccountShell";
import { CityPicker } from "@/components/shared/CityPicker";
import { useToast } from "@/components/shared/Sheet";
import { isDesktop } from "@/components/auth/WebAuth";
import {
  AlertIcon,
  BellIcon,
  BookmarkIcon,
  CameraIcon,
  ChevronRightIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  RepeatIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StoreIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/icons";
import { AlertNotice, InterestsSheet, SectionLabel, SettingRow, SettingsPage, interestSummary } from "@/components/account/AccountParts";

const valueText = (v: string) => (
  <span className="flex items-center gap-2 whitespace-nowrap text-[14px] leading-5 text-[#4D5E70]">
    {v}
    <ChevronRightIcon size={20} />
  </span>
);

/* ------------------------------------------------------------------ AM43 Profile / PW15 Account */

export function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  const settings = useSettings();
  const [interests, setInterests] = useState(false);
  const [city, setCity] = useState(false);
  const { show: toast, node: toastNode } = useToast();
  const name = session?.name || "Ada Okafor";
  const phone = session?.phone ?? (session?.contact && /\d/.test(session.contact) ? session.contact : "0803 000 0000");
  const email = session?.email ?? "ada@example.com";
  const area = `${session?.side === "Island" ? "Victoria Island, Island" : "Yaba, Mainland"}`;
  const homeWork = settings.places.map((p) => `${p.label}: ${p.area.split(",")[0]}`).join(" · ");
  const following = FOLLOWED_HOSTS.filter((h) => !settings.unfollowed.includes(h.slug)).length;

  // PW15 form
  const [draft, setDraft] = useState<{ name?: string; phone?: string; email?: string }>({});
  const v = { name: draft.name ?? name, phone: draft.phone ?? phone, email: draft.email ?? email };

  useEffect(() => {
    if (session === null || session?.status === "guest") router.replace("/welcome");
  }, [session, router]);

  return (
    <>
      {/* ---------- App (AM43) ---------- */}
      <div className="min-h-screen bg-white pb-10 pt-[env(safe-area-inset-top)] md:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <button type="button" aria-label="Back" onClick={() => router.push("/m")} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">Profile</h1>
        </div>
        <div className="flex items-center gap-4 px-4 pt-2">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[20px] font-bold text-[#5B3FD6]">{initialsOf(name)}</span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{name}</span>
            <span className="truncate text-[12px] leading-4 text-[#4D5E70]">
              {phone} · {area}
            </span>
          </span>
        </div>
        <div className="flex flex-col px-4 pt-4">
          <SectionLabel first>Yours</SectionLabel>
          <ActionRow icon={<BookmarkIcon size={20} />} title="Saved" subtitle="4 events and 2 places" href="/my-events?tab=saved" />
          <ActionRow icon={<UsersIcon size={20} />} title="Hosts you follow" subtitle={`${following} host${following === 1 ? "" : "s"}`} href="/account/hosts" />
          <ActionRow icon={<ClockIcon size={20} />} title="Past events" subtitle="Events you went to" href="/my-events?tab=past" />
          <ActionRow icon={<StoreIcon size={20} />} title="Hosting" subtitle="Skyline Lounge and 1 more" href="/host" />
          <ActionRow icon={<MapPinIcon size={20} />} title="Suggest a place" subtitle="Found somewhere good? Tell us" href="/suggest-place" />
          <SectionLabel>Settings</SectionLabel>
          <ActionRow icon={<SparkleIcon size={20} />} title="Interests" subtitle={interestSummary(session?.interests)} onClick={() => setInterests(true)} />
          <ActionRow icon={<NavigationIcon size={20} />} title="Locations" subtitle={homeWork} href="/account/location" />
          <ActionRow icon={<BellIcon size={20} />} title="Notifications" subtitle="Reminders and ticket updates" href="/account/notifications" />
          <ActionRow icon={<UserIcon size={20} />} title="Account" subtitle="Name, phone and email" href="/account/details" />
          <ActionRow icon={<ShieldCheckIcon size={20} />} title="Privacy" subtitle="Download your data or delete your account" href="/account/privacy" />
          <SectionLabel>Help</SectionLabel>
          <ActionRow icon={<InfoIcon size={20} />} title="Help and support" subtitle="Questions, orders and reports" href="/help" />
          <Link href="/signout" className="flex h-[52px] items-center justify-center pt-6 text-[16px] tracking-[-0.01em] text-[#C81E57]">
            Sign out
          </Link>
        </div>
      </div>

      {/* ---------- Web (PW15) ---------- */}
      <div className="hidden md:block">
        <AccountShell>
          <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-[#172B3A]">Account</h1>
          <div className="flex w-full max-w-[872px] flex-col gap-4 rounded-2xl border border-[#E9EDF1] p-6">
            <Field label="Your name" value={v.name} onChange={(x) => setDraft({ ...draft, name: x })} hint="Shows on your tickets." />
            <Field label="Phone number" value={v.phone} onChange={(x) => setDraft({ ...draft, phone: x })} inputMode="tel" hint="We send a code to confirm a new number." />
            <Field label="Email" value={v.email} onChange={(x) => setDraft({ ...draft, email: x })} inputMode="email" hint="For receipts and getting back into your account." />
          </div>
          <div className="flex w-full max-w-[872px] flex-col rounded-2xl border border-[#E9EDF1] px-6 pb-3 pt-6">
            <h2 className="pb-2 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Preferences</h2>
            <SettingRow title="City" sub={`Lagos, ${session?.side === "Mainland" ? "Yaba" : "Victoria Island"}`} right={<ChevronRightIcon size={20} className="text-[#4D5E70]" />} onClick={() => setCity(true)} />
            <SettingRow title="Interests" sub={interestSummary(session?.interests)} right={<ChevronRightIcon size={20} className="text-[#4D5E70]" />} onClick={() => setInterests(true)} />
            <SettingRow title="Email updates" sub="Weekend roundup on Thursdays" right={<Toggle on={settings.emailUpdates} onChange={(x) => updateSettings({ emailUpdates: x })} label="Email updates" />} />
          </div>
          <button
            type="button"
            onClick={() => {
              updateSession({ name: v.name.trim() || name, phone: v.phone, email: v.email });
              setDraft({});
              toast("Changes saved");
            }}
            className="flex h-11 w-fit items-center rounded-[12px] bg-[#E22765] px-4 text-[14px] text-white hover:bg-[#C81E57]"
          >
            Save changes
          </button>
        </AccountShell>
      </div>
      <InterestsSheet open={interests} onClose={() => setInterests(false)} onSaved={(n) => toast(`${n} interests saved. Home will follow them`)} />
      <CityPicker open={city} onClose={() => setCity(false)} toast={toast} />
      {toastNode}
    </>
  );
}

/* ------------------------------------------------------------------ AM42 Notifications */

const NOTICE_ICONS: Record<NoticeIcon, React.ReactNode> = {
  video: <VideoIcon size={20} />,
  ticket: <TicketLineIcon />,
  pin: <MapPinIcon size={20} />,
  camera: <CameraIcon size={20} />,
  bell: <BellIcon size={20} />,
  alert: <AlertIcon size={20} />,
  repeat: <RepeatIcon size={20} />,
  shield: <ShieldCheckIcon size={20} />,
};

export function NotificationsPage() {
  const settings = useSettings();
  useEffect(() => {
    if (settings.ready && !settings.notificationsSeen) updateSettings({ notificationsSeen: true });
  }, [settings.ready, settings.notificationsSeen]);
  return (
    <SettingsPage title="Notifications" back="/m">
      {(["Today", "Earlier"] as const).map((g, i) => (
        <div key={g} className="flex flex-col">
          <SectionLabel first={i === 0}>{g}</SectionLabel>
          {NOTIFICATIONS.filter((n) => n.group === g).map((n) => (
            <ActionRow key={n.title} icon={NOTICE_ICONS[n.icon]} title={n.title} subtitle={n.body} href={n.href} />
          ))}
        </div>
      ))}
      <Link href="/account/notifications" className="w-fit pt-4 text-[14px] text-[#C81E57]">
        Notification settings
      </Link>
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM44 Account settings */

export function AccountDetailsPage() {
  const router = useRouter();
  const session = useSession();
  const { show: toast, node: toastNode } = useToast();
  useEffect(() => {
    if (isDesktop()) router.replace("/account");
  }, [router]);
  const [draft, setDraft] = useState<{ name?: string; phone?: string; email?: string }>({});
  const v = {
    name: draft.name ?? (session?.name || "Ada Okafor"),
    phone: draft.phone ?? session?.phone ?? "0803 000 0000",
    email: draft.email ?? session?.email ?? "ada@example.com",
  };
  const google = session?.contact === "Google";
  const apple = session?.contact === "Apple";
  return (
    <SettingsPage
      title="Account"
      action="Save changes"
      onAction={() => {
        updateSession({ name: v.name.trim() || "Ada Okafor", phone: v.phone, email: v.email });
        setDraft({});
        toast(draft.phone ? "Saved. We sent a code to confirm the new number" : "Changes saved");
      }}
    >
      <div className="flex flex-col gap-4">
        <Field label="Your name" value={v.name} onChange={(x) => setDraft({ ...draft, name: x })} hint="Shows on your tickets." />
        <Field label="Phone number" value={v.phone} onChange={(x) => setDraft({ ...draft, phone: x })} inputMode="tel" hint="We send a code to confirm a new number." />
        <Field label="Email" value={v.email} onChange={(x) => setDraft({ ...draft, email: x })} inputMode="email" hint="For receipts and getting back into your account." />
      </div>
      <span className="pb-1 pt-6 text-[12px] font-bold uppercase leading-4 text-[#68788A]">Sign in with</span>
      <ActionRow icon={<PhoneIcon size={20} />} title="Phone" trailing={valueText(v.phone)} onClick={() => toast("Change the number above, then save")} />
      <SettingRow title="Google" right={valueText(google ? "Connected" : "Connect")} onClick={() => toast(google ? "Google stays connected" : "Opening Google")} />
      <SettingRow title="Apple" sub={apple ? undefined : "Sign in with your Apple account too"} right={valueText(apple ? "Connected" : "")} onClick={() => toast(apple ? "Apple stays connected" : "Opening Apple")} />
      <p className="pt-3 text-[13px] leading-4 text-[#68788A]">Keep at least one way to sign in. Hosts verify with their bank separately.</p>
      {toastNode}
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM45 Notification settings */

const CHOICES: [keyof Settings["notify"], string, string][] = [
  ["reminders", "Reminders", "Before events you have tickets for"],
  ["waitlist", "Waitlist offers", "When tickets free up for you"],
  ["picks", "Picks for your interests", "New events you might like"],
  ["roundup", "Weekend roundup", "Thursdays, once a week"],
  ["hosts", "Hosts you follow", "When they announce something"],
];

export function NotificationSettingsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const settings = useSettings();
  const [draft, setDraft] = useState<Settings["notify"] | null>(null);
  const notify = draft ?? settings.notify;
  // ?state=off previews AM45 "Off on phone". On a real phone this reads the browser permission.
  const off = params.get("state") === "off";
  const { show: toast, node: toastNode } = useToast();
  return (
    <SettingsPage
      title="Notification settings"
      action="Save"
      onAction={() => {
        updateSettings({ notify });
        setDraft(null);
        toast("Notification settings saved");
      }}
    >
      {off && (
        <div className="pb-2">
          <AlertNotice
            title="Notifications are off on this phone"
            body="You will miss ticket updates and waitlist offers. Turn them on in your phone settings."
            action="Turn on"
            onAction={() => {
              if (typeof Notification !== "undefined") Notification.requestPermission().catch(() => {});
              router.replace("/account/notifications");
            }}
          />
        </div>
      )}
      <SectionLabel first={!off}>Always on</SectionLabel>
      {["Tickets and orders", "Event changes", "Account security"].map((t) => (
        <SettingRow key={t} title={t} right={<span className="text-[14px] text-[#4D5E70]">On</span>} />
      ))}
      <SectionLabel>Your choice</SectionLabel>
      {CHOICES.map(([k, t, s]) => (
        <SettingRow key={k} title={t} sub={s} right={<Toggle on={notify[k]} onChange={(x) => setDraft({ ...notify, [k]: x })} label={t} />} />
      ))}
      <div className="pt-4">
        <SettingRow
          title="Quiet hours"
          sub={settings.quiet.on ? `${settings.quiet.from} to ${settings.quiet.to}` : "Off"}
          right={<ChevronRightIcon size={20} className="text-[#4D5E70]" />}
          onClick={() => router.push("/account/quiet-hours")}
        />
      </div>
      {toastNode}
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM46 Privacy */

export function PrivacyPage() {
  const router = useRouter();
  const settings = useSettings();
  const { show: toast, node: toastNode } = useToast();
  const signals = settings.signals.saves || settings.signals.going;
  return (
    <SettingsPage title="Privacy">
      <ActionRow icon={<BellIcon size={20} />} title="Event picks and offers" subtitle="Optional emails and messages" trailing={<Toggle on={settings.offers} onChange={(x) => updateSettings({ offers: x })} label="Event picks and offers" />} />
      <ActionRow icon={<MapPinIcon size={20} />} title="Location" trailing={valueText(settings.locationAccess === "While using the app" ? "While using" : settings.locationAccess === "Only when I ask" ? "When I ask" : "Never")} onClick={() => router.push("/account/location")} />
      <ActionRow icon={<BellIcon size={20} />} title="Notification settings" trailing={valueText(Object.values(settings.notify).filter(Boolean).length + " on")} onClick={() => router.push("/account/notifications")} />
      <ActionRow icon={<SparkleIcon size={20} />} title="Personalisation" trailing={valueText(signals ? "On" : "Off")} onClick={() => router.push("/account/personalisation")} />
      <ActionRow
        icon={<UploadIcon size={20} />}
        title="Download my data"
        subtitle={settings.dataRequested ? "Requested. We email it within a few days" : "We email you a copy of your account data"}
        onClick={() => {
          updateSettings({ dataRequested: true });
          toast("Requested. We email your data within a few days");
        }}
      />
      <ActionRow icon={<AlertIcon size={20} />} title="Delete account" subtitle="Remove your account and personal data" href="/account/delete" />
      <p className="pt-4 text-[12px] leading-4 text-[#4D5E70]">
        Read the{" "}
        <Link href="/privacy" className="text-[#C81E57]">
          Privacy policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-[#C81E57]">
          Terms
        </Link>
        . Hosts only see the name on your ticket, never your phone number.
      </p>
      {toastNode}
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM48 Hosts you follow */

export function HostsFollowPage() {
  const settings = useSettings();
  const { show: toast, node: toastNode } = useToast();
  const toggle = (slug: string, name: string) => {
    const off = settings.unfollowed.includes(slug);
    updateSettings({ unfollowed: off ? settings.unfollowed.filter((s) => s !== slug) : [...settings.unfollowed, slug] });
    toast(off ? `Following ${name} again` : `Unfollowed ${name}`);
  };
  return (
    <SettingsPage title="Hosts you follow">
      {FOLLOWED_HOSTS.map((h) => {
        const following = !settings.unfollowed.includes(h.slug);
        return (
          <div key={h.slug} className="flex min-h-[84px] items-center gap-3 py-3">
            <Link href={h.href} className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEFF] text-[13px] text-[#5B3FD6]">{h.initials}</span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[12px] leading-4 text-[#172B3A]">{h.name}</span>
                  {h.verified && (
                    <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-[#E3F8EF] px-1.5 text-[12px] leading-4 text-[#067647]">
                      <ShieldCheckIcon size={12} />
                      Verified place
                    </span>
                  )}
                </span>
                <span className="truncate text-[12px] leading-4 text-[#4D5E70]">{h.meta}</span>
              </span>
            </Link>
            <button
              type="button"
              aria-pressed={following}
              onClick={() => toggle(h.slug, h.name)}
              className={`flex h-9 w-[84px] shrink-0 items-center justify-center rounded-[8px] text-[13px] ${following ? "border border-[#B4BFCA] bg-white text-[#172B3A]" : "bg-[#E22765] text-white"}`}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>
        );
      })}
      {toastNode}
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM56 Personalisation */

export function PersonalisationPage() {
  const session = useSession();
  const settings = useSettings();
  const [interests, setInterests] = useState(false);
  const { show: toast, node: toastNode } = useToast();
  return (
    <SettingsPage title="Personalisation" back="/account/privacy">
      <p className="text-[14px] leading-5 text-[#4D5E70]">Home and picks use a few simple signals. They stay on your account and are never sold or shared with hosts.</p>
      <SectionLabel>What we use</SectionLabel>
      <SettingRow title="Your interests" sub={interestSummary(session?.interests)} right={<ChevronRightIcon size={20} className="text-[#4D5E70]" />} onClick={() => setInterests(true)} />
      <SettingRow title="Events you save" right={<Toggle on={settings.signals.saves} onChange={(x) => updateSettings({ signals: { ...settings.signals, saves: x } })} label="Events you save" />} />
      <SettingRow title="Events you go to" right={<Toggle on={settings.signals.going} onChange={(x) => updateSettings({ signals: { ...settings.signals, going: x } })} label="Events you go to" />} />
      <SettingRow title="Your area" sub={session?.side === "Mainland" ? "Yaba" : "Victoria Island"} />
      <button
        type="button"
        onClick={() => {
          updateSettings({ signals: DEFAULT_SETTINGS.signals });
          toast("Recommendations reset");
        }}
        className="mt-6 flex h-[52px] items-center justify-center rounded-[12px] border border-[#B4BFCA] text-[16px] tracking-[-0.01em] text-[#172B3A]"
      >
        Reset recommendations
      </button>
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">Home goes back to city wide picks until you save or go to something new.</p>
      <InterestsSheet open={interests} onClose={() => setInterests(false)} onSaved={(n) => toast(`${n} interests saved`)} />
      {toastNode}
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM57 Quiet hours and your data */

const HOURS = ["8 PM", "9 PM", "10 PM", "11 PM", "12 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM"];

export function QuietHoursPage() {
  const router = useRouter();
  const settings = useSettings();
  const [draft, setDraft] = useState<Settings["quiet"] | null>(null);
  const q = draft ?? settings.quiet;
  const cycle = (v: string, list: string[]) => list[(list.indexOf(v) + 1) % list.length];
  const { show: toast, node: toastNode } = useToast();
  return (
    <SettingsPage
      title="Quiet hours and data"
      back="/account/notifications"
      action="Save"
      onAction={() => {
        updateSettings({ quiet: q });
        setDraft(null);
        toast("Saved");
      }}
    >
      <SectionLabel first>Quiet hours</SectionLabel>
      <SettingRow title="Quiet hours" right={<Toggle on={q.on} onChange={(x) => setDraft({ ...q, on: x })} label="Quiet hours" />} />
      {q.on && (
        <>
          <SettingRow title="From" right={valueText(q.from)} onClick={() => setDraft({ ...q, from: cycle(q.from, HOURS.slice(0, 5)) })} />
          <SettingRow title="To" right={valueText(q.to)} onClick={() => setDraft({ ...q, to: cycle(q.to, HOURS.slice(5)) })} />
        </>
      )}
      <p className="pt-2 text-[12px] leading-4 text-[#4D5E70]">Ticket and event change messages still come through.</p>
      <SectionLabel>Your data</SectionLabel>
      <SettingRow
        title="Download my data"
        right={<span className="text-[14px] text-[#4D5E70]">{settings.dataRequested ? "Pending" : "Request"}</span>}
        onClick={() => {
          if (settings.dataRequested) return;
          updateSettings({ dataRequested: true });
          toast("Requested. We email your data within a few days");
        }}
      />
      <SettingRow title="Delete my account" right={<ChevronRightIcon size={20} className="text-[#4D5E70]" />} onClick={() => router.push("/account/delete")} />
      {toastNode}
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM64 Delete account */

export function DeleteAccountPage() {
  const router = useRouter();
  const session = useSession();
  const [code, setCode] = useState("");
  const phone = session?.phone ?? "0803 000 0000";
  return (
    <SettingsPage
      title="Delete account"
      back="/account/privacy"
      action="Delete my account"
      actionDisabled={code.replace(/\D/g, "").length !== 6}
      onAction={() => {
        try {
          ["xiventa_orders", "xiventa_after_ticket", "xiventa_visits", "xiventa_settings"].forEach((k) => localStorage.removeItem(k));
        } catch {}
        router.replace("/signout");
      }}
    >
      <div className="flex flex-col gap-3">
        <AlertNotice title="You have 2 upcoming tickets" body="Deleting your account removes them from this phone. Forward or download them first if you still want to go." action="Go to My events" onAction={() => router.push("/my-events")} />
        <AlertNotice title="You own a host profile" body="Move Skyline Lounge to another owner or close it before you delete your account." action="Manage host profile" onAction={() => router.push("/host/profile")} />
      </div>
      <div className="pt-5">
        <Field label={`Code sent to ${phone}`} value={code} onChange={(x) => setCode(x.replace(/\D/g, "").slice(0, 6))} placeholder="Enter the 6 digit code" inputMode="tel" hint="This confirms it is really you." />
      </div>
      <p className="pt-3 text-[12px] leading-4 text-[#4D5E70]">We keep only what the law requires for past orders. Everything else is removed.</p>
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM69 Location / Add a place */

const ACCESS: [Settings["locationAccess"], string][] = [
  ["While using the app", "Shows what is near you and how far it is"],
  ["Only when I ask", "We ask each time you tap Near me"],
  ["Never", "You pick your area by hand"],
];

export function LocationPage() {
  const router = useRouter();
  const settings = useSettings();
  return (
    <SettingsPage title="Location">
      <SectionLabel first>Location access</SectionLabel>
      <div role="radiogroup" className="flex flex-col">
        {ACCESS.map(([label, hint]) => {
          const on = settings.locationAccess === label;
          return (
            <button key={label} type="button" role="radio" aria-checked={on} onClick={() => updateSettings({ locationAccess: label })} className="flex min-h-16 items-center gap-3 px-1 py-3 text-left">
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[12px] leading-4 text-[#172B3A]">{label}</span>
                <span className="text-[12px] leading-4 text-[#4D5E70]">{hint}</span>
              </span>
              <span className={`h-5 w-5 shrink-0 rounded-full ${on ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
            </button>
          );
        })}
      </div>
      <SectionLabel>Your places</SectionLabel>
      {settings.places.map((p) => (
        <SettingRow key={p.label} title={p.label} right={valueText(p.area)} />
      ))}
      <SettingRow title="Add a place" sub="Switch between them from the area at the top of Home" right={<ChevronRightIcon size={20} className="text-[#4D5E70]" />} onClick={() => router.push("/account/location/add")} />
      <div className="pt-4">
        <ActionRow icon={<NavigationIcon size={20} />} title="Ask when I’m somewhere new" subtitle="We check when you open the app. Never in the background." trailing={<Toggle on={settings.askWhenNew} onChange={(x) => updateSettings({ askWhenNew: x })} label="Ask when I'm somewhere new" />} />
      </div>
      <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[#E6F1FF] px-4 py-3">
        <ShieldCheckIcon size={20} className="shrink-0 text-[#0059BE]" />
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] leading-4 text-[#172B3A]">Your exact location stays with you</p>
          <p className="text-[12px] leading-4 text-[#4D5E70]">Hosts never see where you are. We only use it to sort what is close.</p>
        </div>
      </div>
    </SettingsPage>
  );
}

const LABELS = ["Home", "Work", "Family", "Gym", "Other"];
const AREAS: [string, string][] = [
  ["Lekki", "Island"],
  ["Victoria Island", "Island"],
  ["Ikoyi", "Island"],
  ["Ikeja", "Mainland"],
  ["Yaba", "Mainland"],
  ["Surulere", "Mainland"],
  ["Ajah", "Island"],
];

export function AddLocationPage() {
  const router = useRouter();
  const settings = useSettings();
  const taken = settings.places.map((p) => p.label);
  const [label, setLabel] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const pickLabel = label ?? LABELS.find((l) => !taken.includes(l)) ?? "Other";
  const shown = AREAS.filter(([a]) => a.toLowerCase().includes(q.toLowerCase()));
  return (
    <SettingsPage
      title="Add a place"
      back="/account/location"
      action="Save place"
      actionDisabled={!area}
      onAction={() => {
        const side = AREAS.find(([a]) => a === area)?.[1] ?? "Island";
        updateSettings({ places: [...settings.places.filter((p) => p.label !== pickLabel || pickLabel === "Other"), { label: pickLabel, area: `${area}, ${side}` }] });
        router.push("/account/location");
      }}
    >
      <span className="pb-3 text-[14px] font-bold leading-5 text-[#172B3A]">Name it</span>
      <div className="flex flex-wrap gap-2">
        {LABELS.map((l) => {
          const used = taken.includes(l) && l !== "Other";
          const on = pickLabel === l;
          return (
            <button
              key={l}
              type="button"
              disabled={used}
              onClick={() => setLabel(l)}
              className={`flex h-8 items-center rounded-full px-4 text-[13px] ${on ? "bg-[#E22765] text-white" : used ? "border border-[#E9EDF1] text-[#8C99A7]" : "border border-[#B4BFCA] text-[#4D5E70]"}`}
            >
              {l}
            </button>
          );
        })}
      </div>
      <label className="mt-5 flex h-12 items-center gap-2 rounded-full bg-[#F4F6F8] px-4">
        <SearchIcon size={20} className="text-[#68788A]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search an area or address" className="h-full flex-1 bg-transparent text-[14px] text-[#172B3A] placeholder:text-[#68788A] focus:outline-none" />
      </label>
      <ActionRow icon={<NavigationIcon size={20} />} title="Use where I am now" subtitle="Lekki, Island" onClick={() => setArea("Lekki")} />
      <h2 className="pt-3 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Area</h2>
      <div role="radiogroup" className="flex flex-col">
        {shown.map(([a]) => (
          <button key={a} type="button" role="radio" aria-checked={area === a} onClick={() => setArea(a)} className="flex min-h-14 items-center gap-3 px-1 text-left">
            <span className="flex-1 text-[12px] leading-4 text-[#172B3A]">{a}</span>
            <span className={`h-5 w-5 rounded-full ${area === a ? "border-[6px] border-[#E22765]" : "border-[1.5px] border-[#B4BFCA]"}`} />
          </button>
        ))}
      </div>
    </SettingsPage>
  );
}

/* ------------------------------------------------------------------ AM51 Case */

/**
 * AM51 Your case. The sample case (Not let in, The Abnormal Nightout) is in Figma; a case opened
 * from an order on this device (flow 3) takes its reason. ?state=accepted | review shows the outcomes.
 */
export function CasePage() {
  const router = useRouter();
  const params = useSearchParams();
  const after = useAfterTicket("abnormal-nightout");
  const [outcome, setOutcome] = useState<string | null>(params.get("state"));
  const reason = after.case?.reason === "Not let in" || !after.case ? "Not let in with a valid ticket" : after.case.reason;
  const steps = [
    { t: "Case opened", s: "Mon 6 Oct, 9:14 AM", st: "done" },
    { t: "Host replied", s: "“We had a scanner issue. Sorry about that.”", st: "done" },
    { t: outcome === "accepted" ? "You accepted" : outcome === "review" ? "Sent to Xiventa" : "Waiting for you", s: outcome === "accepted" ? "Refund of ₦31,500 accepted" : outcome === "review" ? "You asked Xiventa to review" : "Accept the host's offer or ask Xiventa to review", st: outcome ? "done" : "current" },
    { t: "Xiventa reviews", s: "We decide within the review time shown in your email", st: outcome === "review" ? "current" : outcome === "accepted" ? "skip" : "todo" },
    { t: "Resolved", s: "Any refund goes back to how you paid", st: outcome === "accepted" ? "current" : "todo" },
  ].filter((x) => x.st !== "skip");
  const { show: toast, node: toastNode } = useToast();
  return (
    <SettingsPage title="Your case" subtitle={reason} back="/help" action="Send a message" onAction={() => toast("Message box comes with the backend. We reply here and by email")}>
      <p className="text-[12px] leading-4 text-[#172B3A]">{reason}</p>
      <p className="pb-4 pt-1 text-[12px] leading-4 text-[#4D5E70]">
        The Abnormal Nightout ·{" "}
        <Link href="/my-events/abnormal-nightout/order" className="text-[#C81E57]">
          Order XV 7TGT
        </Link>
      </p>
      <div className="flex flex-col">
        {steps.map((x, i) => (
          <div key={x.t} className="flex gap-3">
            <div className="flex w-5 shrink-0 flex-col items-center">
              {x.st === "done" ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E22765] text-white">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : x.st === "current" ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-[#E22765]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E22765]" />
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border-[1.5px] border-[#D5DCE3]" />
              )}
              {i < steps.length - 1 && <span className={`min-h-6 w-0.5 flex-1 ${x.st === "done" ? "bg-[#E22765]" : "bg-[#D5DCE3]"}`} />}
            </div>
            <div className="flex flex-col gap-0.5 pb-5">
              <span className={`text-[12px] leading-4 ${x.st === "todo" ? "text-[#68788A]" : "text-[#172B3A]"}`}>{x.t}</span>
              <span className="text-[12px] leading-4 text-[#4D5E70]">{x.s}</span>
            </div>
          </div>
        ))}
      </div>
      {!outcome && (
        <div className="flex flex-col gap-3 pt-2">
          <button type="button" onClick={() => setOutcome("accepted")} className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#E22765] text-[16px] tracking-[-0.01em] text-white hover:bg-[#C81E57]">
            Accept refund of ₦31,500
          </button>
          <button type="button" onClick={() => setOutcome("review")} className="flex h-[52px] items-center justify-center rounded-[12px] bg-[#172B3A] text-[16px] tracking-[-0.01em] text-white">
            Ask Xiventa to review
          </button>
        </div>
      )}
      <button type="button" onClick={() => router.push("/my-events/abnormal-nightout/order")} className="hidden w-fit pt-4 text-[14px] text-[#C81E57] md:block">
        See the order
      </button>
      {toastNode}
    </SettingsPage>
  );
}
