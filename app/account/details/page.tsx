import { Suspense } from "react";
import { AccountDetailsPage } from "@/components/account/AccountPages";

/** AM44 Account settings. Desktop uses PW15 at /account. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <AccountDetailsPage />
    </Suspense>
  );
}
