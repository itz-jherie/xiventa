import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getHelpTopic } from "@/data/account";
import { HelpTopicPage } from "@/components/account/HelpPages";

/** AM70 / AM71 help topic (tickets, payments, hosting, account; /help/host is hosting). */
export default function Page({ params }: { params: Promise<{ topic: string }> }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ topic: string }> }) {
  const topic = getHelpTopic((await params).topic);
  if (!topic) notFound();
  return <HelpTopicPage topic={topic} />;
}
