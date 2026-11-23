"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDraft } from "@/lib/createDraft";
import { useSession } from "@/lib/session";
import { CreateBasics, CreateClaim, CreateFlyer, CreateHost, CreateInstagram, CreateLocation, CreatePromoterSent, CreateRepeat, CreateStart, CreateVenue } from "@/components/create/CreateSteps";
import { CreateTicketEditor, CreateTickets } from "@/components/create/CreateTickets";
import { GroupCheck, GroupPending, Selfie, SelfieReview, Verified, VerifyBank, VerifyCode, VerifyDetails, VerifyHostType } from "@/components/create/CreateVerify";
import { CreateClip, CreateDetails, CreatePreview, CreatePublished, CreateReview } from "@/components/create/CreateFinish";

/**
 * Post an event (flow 6, EC00 to EC27). One route, one step per path segment:
 * /create (EC01) → host (EC20) → flyer (EC24) or instagram (EC23, listings) → basics (EC03)
 * → location (EC04 / EC19) → tickets (EC08, paid) → review (EC14) → published (EC16).
 * Side steps: repeat (EC21), venue (EC05), ticket (EC09 / EC25), verify… (EC10 to EC12), group-check,
 * details (EC22), clip (EC18), preview (EC15), claim / promoter-sent (EC24 duplicates).
 * Previews: /create?host=new (no verified host), /create/flyer?state=duplicate | mine,
 * /create/instagram?state=in-use.
 */
const STEPS = ["", "host", "flyer", "instagram", "basics", "repeat", "location", "venue", "tickets", "ticket", "review", "verify", "verify-details", "verify-bank", "verify-code", "verified", "selfie", "selfie-review", "group-check", "group-pending", "details", "clip", "preview", "published", "claim", "promoter-sent"];

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <Create />
    </Suspense>
  );
}

function Create() {
  const { step } = useParams<{ step?: string[] }>();
  const s = step?.[0] ?? "";
  const router = useRouter();
  const draft = useDraft();
  const session = useSession();
  const guest = session !== undefined && session?.status !== "signed-in";
  // Steps after the first need a draft; a fresh visit (or a reload after the tab closed) starts over.
  const lost = draft !== null && s !== "" && s !== "promoter-sent" && !draft.name && !["host", "flyer", "instagram", "basics", "verify", "verify-details", "verify-bank", "verify-code", "selfie", "selfie-review", "claim"].includes(s);

  const unknown = !STEPS.includes(s);

  useEffect(() => {
    if (guest) router.replace("/welcome");
    else if (lost || unknown) router.replace("/create");
  }, [guest, lost, unknown, router]);

  if (s === "") return <CreateStart />;
  if (s === "promoter-sent") return <CreatePromoterSent />;
  if (s === "claim") return <CreateClaim />;
  if (s === "venue") return <CreateVenue />;
  if (s === "clip") return <CreateClip />;
  if (s === "verify-code") return <VerifyCode />;
  if (s === "selfie") return <Selfie />;
  if (s === "selfie-review") return <SelfieReview />;
  if (!draft || lost) return null;

  switch (s) {
    case "host":
      return <CreateHost draft={draft} />;
    case "flyer":
      return <CreateFlyer draft={draft} />;
    case "instagram":
      return <CreateInstagram draft={draft} />;
    case "basics":
      return <CreateBasics draft={draft} />;
    case "repeat":
      return <CreateRepeat draft={draft} />;
    case "location":
      return <CreateLocation draft={draft} />;
    case "tickets":
      return <CreateTickets draft={draft} />;
    case "ticket":
      return <CreateTicketEditor draft={draft} />;
    case "review":
      return <CreateReview draft={draft} />;
    case "verify":
      return <VerifyHostType draft={draft} />;
    case "verify-details":
      return <VerifyDetails draft={draft} />;
    case "verify-bank":
      return <VerifyBank draft={draft} />;
    case "verified":
      return <Verified draft={draft} />;
    case "group-check":
      return <GroupCheck draft={draft} />;
    case "group-pending":
      return <GroupPending draft={draft} />;
    case "details":
      return <CreateDetails draft={draft} />;
    case "preview":
      return <CreatePreview draft={draft} />;
    case "published":
      return <CreatePublished draft={draft} />;
    default:
      return null;
  }
}
