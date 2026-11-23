import { Suspense } from "react";
import { LegalPage } from "@/components/site/SitePages";

/** PW21 Legal: Cookies. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LegalPage slug="cookies" />
    </Suspense>
  );
}
