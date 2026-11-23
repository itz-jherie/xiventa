import { Suspense } from "react";
import { PersonalisationPage } from "@/components/account/AccountPages";

/** AM56 Personalisation. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PersonalisationPage />
    </Suspense>
  );
}
