import { Suspense } from "react";
import { CasePage } from "@/components/account/AccountPages";

/** AM51 Your case. ?state=accepted | review. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <CasePage />
    </Suspense>
  );
}
