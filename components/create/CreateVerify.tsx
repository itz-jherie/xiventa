"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hostOf, updateDraft, type Draft } from "@/lib/createDraft";
import { useSession } from "@/lib/session";
import { Field } from "@/components/checkout/CheckoutParts";
import { InfoNotice } from "@/components/tickets/TicketParts";
import { Sheet } from "@/components/shared/Sheet";
import { CheckIcon, ShieldCheckIcon, UsersIcon } from "@/components/create/createIcons";
import { ChoiceCard, CreateShell, Hint, Label, PickerField } from "@/components/create/CreateParts";

const TYPES: [string, string][] = [
  ["Yourself", "Organizers, promoters, artists and creators under their own name"],
  ["Business", "Registered event companies, venues, restaurants, brands"],
  ["Institution", "Schools, churches, mosques, NGOs, associations"],
  ["Corporate", "Companies hosting staff or brand events, like banks and telcos"],
  ["Government", "Federal, state and local agencies, like FRSC"],
  ["Community", "Clubs and groups without registration papers, like book clubs, run clubs and carnival committees"],
];

/** EC10 Host type: who is selling the tickets. */
export function VerifyHostType({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [type, setType] = useState(draft.verify.type ?? "Yourself");
  return (
    <CreateShell
      title="Who is selling the tickets?"
      subtitle={draft.name}
      back="/create/review"
      action="Continue"
      onAction={() => {
        updateDraft((d) => ({ verify: { ...d.verify, type } }));
        router.push(type === "Yourself" ? "/create/verify-bank" : "/create/verify-details");
      }}
    >
      <p className="text-[12px] leading-4 text-[#172B3A]">Pick what fits. It decides what we check.</p>
      <p className="pb-4 pt-1 text-[12px] leading-4 text-[#4D5E70]">You can host as yourself, or as a business or group people know by name.</p>
      <div role="radiogroup" className="flex flex-col gap-3">
        {TYPES.map(([t, s]) => (
          <ChoiceCard key={t} icon={<UsersIcon size={20} />} title={t} sub={s} on={type === t} onClick={() => setType(t)} />
        ))}
      </div>
    </CreateShell>
  );
}

/** EC10b Host details (business, institution, group): name, logo, Instagram. */
export function VerifyDetails({ draft }: { draft: Draft }) {
  const router = useRouter();
  const type = draft.verify.type ?? "Business";
  const [name, setName] = useState(draft.verify.profile ?? (draft.flyer === "read" ? "Ember House" : ""));
  const [ig, setIg] = useState(draft.flyer === "read" ? "@emberhouse.ng" : "");
  const [logo, setLogo] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const from = draft.flyer === "read";
  return (
    <CreateShell
      title={`Your ${type.toLowerCase()}`}
      subtitle={`${type} · Step 1 of 3`}
      back="/create/verify"
      action="Create host profile"
      disabled={name.trim().length < 2}
      onAction={() => {
        updateDraft((d) => ({ verify: { ...d.verify, profile: name.trim() } }));
        router.push("/create/verify-bank");
      }}
    >
      <p className="text-[13px] leading-[18px] text-[#4D5E70]">This is how guests see you.{from ? " We filled it in from your flyer." : ""}</p>
      <div className="pt-4">
        <Field label={`${type} name`} value={name} onChange={setName} hint={from ? "From your flyer" : undefined} />
      </div>
      <Label className="pt-5">Logo</Label>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => setLogo(e.target.files?.[0]?.name ?? null)} />
      <div className="flex h-[150px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#B4BFCA] bg-[#F4F6F8]">
        <span className="text-[14px] text-[#172B3A]">{logo ?? "Add your logo"}</span>
        <span className="text-[12px] text-[#68788A]">Square, JPG or PNG</span>
        <button type="button" onClick={() => input.current?.click()} className="mt-2 flex h-9 items-center rounded-[8px] border border-[#B4BFCA] bg-white px-4 text-[13px] text-[#172B3A]">
          {logo ? "Change" : "Choose image"}
        </button>
      </div>
      <Hint>Optional. You can add it later.</Hint>
      <div className="pt-4">
        <Field label="Instagram" value={ig} onChange={setIg} placeholder="@yourpage" hint={from ? "From your flyer" : undefined} />
      </div>
    </CreateShell>
  );
}

const BANKS = ["GTBank", "Access Bank", "First Bank", "Zenith Bank", "UBA", "Kuda", "Opay", "Moniepoint"];

/** EC11 Verify to host / Bank account (Step 1 of 2). The account name fills in once 10 digits are typed. */
export function VerifyBank({ draft }: { draft: Draft }) {
  const router = useRouter();
  const session = useSession();
  const [bank, setBank] = useState(draft.verify.bank ?? "GTBank");
  const [acct, setAcct] = useState(draft.verify.account ?? "");
  const [agree, setAgree] = useState(false);
  const [picking, setPicking] = useState(false);
  const ready = acct.replace(/\D/g, "").length === 10;
  const owner = (draft.verify.type && draft.verify.type !== "Yourself" ? draft.verify.profile : session?.name) || "Ada Okafor";
  return (
    <CreateShell
      title="Verify to host"
      subtitle="Step 1 of 2"
      back={draft.verify.type && draft.verify.type !== "Yourself" ? "/create/verify-details" : "/create/verify"}
      action="Send code"
      disabled={!ready || !agree}
      onAction={() => {
        updateDraft((d) => ({ verify: { ...d.verify, bank, account: acct } }));
        router.push("/create/verify-code");
      }}
    >
      <p className="text-[13px] leading-[18px] text-[#4D5E70]">Add the bank account you want to be paid into. We use it to confirm it is really you.</p>
      <div className="pt-4">
        <PickerField label="Bank" icon={<ShieldCheckIcon size={20} />} value={bank} onClick={() => setPicking(true)} />
      </div>
      <div className="pt-4">
        <Field label="Account number" value={acct} onChange={(v) => setAcct(v.replace(/\D/g, "").slice(0, 10))} inputMode="tel" placeholder="0123456789" />
      </div>
      <div className="flex flex-col gap-2 pt-4 opacity-100">
        <span className={`text-[13px] leading-4 ${ready ? "text-[#172B3A]" : "text-[#8C99A7]"}`}>Account name</span>
        <span className={`flex h-12 items-center rounded-[12px] border px-4 text-[14px] ${ready ? "border-[#D5DCE3] text-[#172B3A]" : "border-[#E9EDF1] bg-[#F4F6F8] text-[#8C99A7]"}`}>{ready ? owner.toUpperCase() : "Filled in by your bank"}</span>
        <Hint>Filled in by your bank.</Hint>
      </div>
      <button type="button" role="checkbox" aria-checked={agree} onClick={() => setAgree(!agree)} className="flex items-start gap-3 pt-4 text-left">
        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ${agree ? "bg-[#E22765] text-white" : "border-[1.5px] border-[#B4BFCA]"}`}>{agree && <CheckIcon size={14} />}</span>
        <span className="text-[13px] leading-[18px] text-[#172B3A]">I agree to Xiventa checking this account and its BVN record with my bank to confirm it’s me.</span>
      </button>
      <div className="pt-4">
        <InfoNotice title="Why we ask" body="It keeps every host on Xiventa real, and you will be ready to sell tickets any time. No new PIN needed." />
      </div>
      <Sheet open={picking} onClose={() => setPicking(false)} title="Bank">
        <div className="flex flex-col">
          {BANKS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBank(b);
                setPicking(false);
              }}
              className="flex min-h-[52px] items-center justify-between text-[16px] text-[#172B3A]"
            >
              {b}
              {bank === b && <CheckIcon size={18} className="text-[#E22765]" />}
            </button>
          ))}
        </div>
      </Sheet>
    </CreateShell>
  );
}

/** EC11 Verify to host / Enter code (Step 2 of 2). Any 6 digits verify; 000000 fails. */
export function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(42);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <CreateShell
      title="Enter the code"
      subtitle="Step 2 of 2"
      back="/create/verify-bank"
      action="Verify"
      disabled={code.length !== 6}
      onAction={() => {
        if (code === "000000") return setError(true);
        updateDraft((d) => ({ verify: { ...d.verify, status: "verified" } }));
        router.push("/create/verified");
      }}
    >
      <p className="text-[13px] leading-[18px] text-[#4D5E70]">We sent a code to the phone number linked to this account’s BVN, 0803 *** 4417.</p>
      <div className="pt-4">
        <Field
          label="6 digit code"
          value={code.split("").join(" ")}
          onChange={(v) => {
            setError(false);
            setCode(v.replace(/\D/g, "").slice(0, 6));
          }}
          inputMode="tel"
          placeholder="Enter the code"
          error={error ? "That code is not right. Check the latest message and try again." : undefined}
          hint={left > 0 ? `Resend code in 0:${String(left).padStart(2, "0")}` : undefined}
        />
      </div>
      {left <= 0 && (
        <button type="button" onClick={() => setLeft(42)} className="w-fit pt-2 text-[13px] text-[#C81E57]">
          Resend code
        </button>
      )}
      <button type="button" onClick={() => router.push("/create/selfie")} className="pt-8 text-[16px] tracking-[-0.01em] text-[#C81E57]">
        I can’t get this code
      </button>
    </CreateShell>
  );
}

/** Full screen result (EC12 Verified / In review / Group check pending). */
function Result({ title, body, rows, action, onAction, pill }: { title: string; body: string; rows: [string, string][]; action: string; onAction: () => void; pill?: string }) {
  return (
    <CreateShell bare action={action} onAction={onAction}>
      <div className="flex min-h-[70vh] flex-col justify-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E3F8EF] text-[#067647]">
          <ShieldCheckIcon size={28} />
        </span>
        <h1 className="pt-2 text-[24px] font-bold leading-[30px] tracking-[-0.02em] text-[#172B3A]">{title}</h1>
        <p className="text-[14px] leading-5 text-[#4D5E70]">{body}</p>
        {pill && <span className="w-fit rounded-full bg-[#FFF6DD] px-2 py-1 text-[12px] text-[#8F5200]">{pill}</span>}
        <div className="flex flex-col gap-4 pt-6">
          {rows.map(([t, s]) => (
            <div key={t} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">
                <CheckIcon size={18} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold leading-5 text-[#172B3A]">{t}</span>
                <span className="text-[13px] leading-4 text-[#4D5E70]">{s}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </CreateShell>
  );
}

/** EC12 Verify to host / Verified, wallet ready. */
export function Verified({ draft }: { draft: Draft }) {
  const router = useRouter();
  const host = hostOf(draft);
  return (
    <Result
      title="You’re verified"
      body="Your wallet is ready. You can post events now and sell tickets any time."
      rows={[
        ["Your wallet", `Payouts go to ${draft.verify.bank ?? "GTBank"} ·· ${(draft.verify.account ?? "6789").slice(-4)}`],
        [host.name, "Verified host"],
      ]}
      action="Continue"
      onAction={() => router.push("/create/review")}
    />
  );
}

/** EC11 Selfie check / Start, then EC12 Selfie check / In review (static: the check always goes to review). */
export function Selfie() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  return (
    <CreateShell title="Quick selfie" subtitle="Instead of the code" back="/create/verify-code" action="Take selfie" onAction={() => input.current?.click()}>
      <input ref={input} type="file" accept="image/*" capture="user" hidden onChange={(e) => e.target.files?.length && router.push("/create/selfie-review")} />
      <div className="mx-auto mt-4 flex h-[160px] w-[160px] items-center justify-center rounded-full bg-[#F4F6F8] text-[#68788A]">
        <UsersIcon size={56} />
      </div>
      <h2 className="pt-8 text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">Match your face to your bank record</h2>
      <p className="pt-2 text-[14px] leading-5 text-[#4D5E70]">Takes about a minute. We compare your selfie with the photo on your BVN.</p>
      <div className="flex flex-col gap-4 pt-5">
        {["Face a light. Keep windows behind the phone, not you.", "Take off glasses, caps or face coverings.", "Hold your phone at eye level."].map((t) => (
          <span key={t} className="flex items-center gap-3 text-[14px] leading-5 text-[#172B3A]">
            <CheckIcon size={18} className="shrink-0 text-[#067647]" />
            {t}
          </span>
        ))}
      </div>
      <div className="pt-5">
        <InfoNotice title="Only used to confirm it’s you" body="Your selfie is never shown on your profile or to guests." />
      </div>
    </CreateShell>
  );
}

export function SelfieReview() {
  const router = useRouter();
  return (
    <Result
      title="We’re checking your details"
      body="Your selfie did not match after 3 tries, so our team will check it by hand. This usually takes up to 24 hours."
      rows={[
        ["Your event is saved", "It stays as a draft until you are verified."],
        ["We will let you know", "You get a notification as soon as we are done."],
      ]}
      action="Back to Hosting"
      onAction={() => router.push("/host")}
    />
  );
}

/** EC11 Group check: a verified owner shows the group's social page is theirs. */
export function GroupCheck({ draft }: { draft: Draft }) {
  const router = useRouter();
  const host = hostOf(draft);
  const [page, setPage] = useState(host.id === "grace" ? "@graceassemblylekki" : "@lagosoutdoorclub");
  return (
    <CreateShell
      title={`Verify ${host.name}`}
      subtitle={`${host.kind} · Show it’s yours`}
      back="/create/review"
      action="Submit for review"
      disabled={page.length < 3}
      onAction={() => {
        updateDraft({ groupCheck: "pending" });
        router.push("/create/group-pending");
      }}
    >
      <p className="text-[13px] leading-[18px] text-[#4D5E70]">You are already verified as the owner. Now show us the group’s social page so your events can carry the Verified badge.</p>
      <div className="flex min-h-[66px] items-center gap-3 pt-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E3F8EF] text-[#067647]">
          <ShieldCheckIcon size={20} />
        </span>
        <span className="flex-1 text-[16px] text-[#172B3A]">{host.role ?? "Owner"}</span>
        <span className="text-[14px] text-[#4D5E70]">Ada Okafor · Verified</span>
      </div>
      <div className="pt-2">
        <Field label="Group's Instagram or other social page" value={page} onChange={setPage} />
      </div>
      <div className="pt-4">
        <InfoNotice title="Prove the page is yours" body="Add the code XV 4821 to the page's bio or a story for 24 hours. You can remove it once you are verified." />
      </div>
    </CreateShell>
  );
}

export function GroupPending({ draft }: { draft: Draft }) {
  const router = useRouter();
  const host = hostOf(draft);
  return (
    <CreateShell title="Verification" subtitle={host.name} back="/create/review" action="Back to my event" onAction={() => router.push("/create/review")}>
      <div className="flex min-h-[55vh] flex-col items-start justify-center gap-3">
        <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">We&apos;re checking your details</h2>
        <p className="text-[14px] leading-5 text-[#4D5E70]">We&apos;ll let you know as soon as it&apos;s done. Until then your events go live under your name, then switch to {host.name}.</p>
        <span className="mt-2 rounded-full bg-[#FFF6DD] px-2 py-1 text-[12px] text-[#8F5200]">In review</span>
      </div>
    </CreateShell>
  );
}
