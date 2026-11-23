import { Suspense } from "react";
import { LegalPage } from "@/components/site/SitePages";

/** PW21 Legal: Content rules. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LegalPage slug="content-rules" />
    </Suspense>
  );
}
