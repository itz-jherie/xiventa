import { Suspense } from "react";
import { QuietHoursPage } from "@/components/account/AccountPages";

/** AM57 Quiet hours and your data. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuietHoursPage />
    </Suspense>
  );
}
