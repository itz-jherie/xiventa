import { Suspense } from "react";
import { getEventBySlug, INVITE_CODES } from "@/data";
import { PrivateInvite } from "@/components/event/PrivateInvite";

export function generateStaticParams() {
  return [...Object.keys(INVITE_CODES), "expired"].map((code) => ({ code }));
}

/** Invite link: /i/garden24 (AM22 / PW07). Unknown codes show Link expired. */
/** URL params are read inside <Suspense> so navigations stay instant (cacheComponents). */
export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={null}>
      <InvitePageContent params={params} />
    </Suspense>
  );
}

async function InvitePageContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const slug = INVITE_CODES[code.toLowerCase()];
  return <PrivateInvite event={slug ? getEventBySlug(slug) : undefined} code={slug ? code : ""} codes={INVITE_CODES} />;
}
