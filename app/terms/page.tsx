import { Suspense } from "react";
import { LegalPage } from "@/components/site/SitePages";

/** PW21 Legal: Terms. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LegalPage slug="terms" />
    </Suspense>
  );
}
