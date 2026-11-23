import { Suspense } from "react";
import { PrivacyPage } from "@/components/account/AccountPages";

/** AM46 Privacy. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PrivacyPage />
    </Suspense>
  );
}
