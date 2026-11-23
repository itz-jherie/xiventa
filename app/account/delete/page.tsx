import { Suspense } from "react";
import { DeleteAccountPage } from "@/components/account/AccountPages";

/** AM64 Delete account. Any 6 digit code works. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <DeleteAccountPage />
    </Suspense>
  );
}
