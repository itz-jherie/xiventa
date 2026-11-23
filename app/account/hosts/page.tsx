import { Suspense } from "react";
import { HostsFollowPage } from "@/components/account/AccountPages";

/** AM48 Hosts you follow. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <HostsFollowPage />
    </Suspense>
  );
}
