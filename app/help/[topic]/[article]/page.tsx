import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getHelpTopic } from "@/data/account";
import { HelpArticlePage } from "@/components/account/HelpPages";

/** AM72 Help article. */
export default function Page({ params }: { params: Promise<{ topic: string; article: string }> }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ topic: string; article: string }> }) {
  const p = await params;
  const topic = getHelpTopic(p.topic);
  const article = topic?.articles.find((a) => a.slug === p.article);
  if (!topic || !article) notFound();
  return <HelpArticlePage topic={topic} article={article} />;
}
