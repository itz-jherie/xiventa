import { Suspense } from "react";
import { ProfilePage } from "@/components/account/AccountPages";

/** AM43 Profile (phone) / PW15 Account (web). */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}
