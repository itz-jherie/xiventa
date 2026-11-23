import { Suspense } from "react";
import { NotificationsPage } from "@/components/account/AccountPages";

/** AM42 Notifications. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <NotificationsPage />
    </Suspense>
  );
}
