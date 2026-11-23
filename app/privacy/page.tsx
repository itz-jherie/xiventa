import { Suspense } from "react";
import { LegalPage } from "@/components/site/SitePages";

/** PW21 Legal: Privacy. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LegalPage slug="privacy" />
    </Suspense>
  );
}
