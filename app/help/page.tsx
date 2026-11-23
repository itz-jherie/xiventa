import { Suspense } from "react";
import { HelpHome } from "@/components/account/HelpPages";

/** AM50 Help and support. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <HelpHome />
    </Suspense>
  );
}
