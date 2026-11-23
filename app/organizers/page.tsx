import { Suspense } from "react";
import { OrganizersPage } from "@/components/site/SitePages";

/** PW23 For organizers. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrganizersPage />
    </Suspense>
  );
}
