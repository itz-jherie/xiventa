import { Suspense } from "react";
import { NotificationSettingsPage } from "@/components/account/AccountPages";

/** AM45 Notification settings. ?state=off previews Off on phone. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <NotificationSettingsPage />
    </Suspense>
  );
}
