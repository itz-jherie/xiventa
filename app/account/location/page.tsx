import { Suspense } from "react";
import { LocationPage } from "@/components/account/AccountPages";

/** AM69 Location. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LocationPage />
    </Suspense>
  );
}
