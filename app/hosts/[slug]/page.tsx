import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getHost, getHosts } from "@/data/hosts";
import { HostProfile } from "@/components/event/HostProfile";

export function generateStaticParams() {
  return getHosts().map((h) => ({ slug: h.slug }));
}

/** Organizer profile: AM25 on phones, PW09 from 768 px. `?empty` shows "No upcoming events". */
/** URL params are read inside <Suspense> so navigations stay instant (cacheComponents). */
export default function HostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <HostPageContent params={params} />
    </Suspense>
  );
}

async function HostPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = getHost(slug);
  if (!host) notFound();
  return (
    <Suspense fallback={null}>
      <HostProfile host={host} />
    </Suspense>
  );
}
