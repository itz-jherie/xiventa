import { Suspense } from "react";
import { AddLocationPage } from "@/components/account/AccountPages";

/** AM69 Add a place. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <AddLocationPage />
    </Suspense>
  );
}
