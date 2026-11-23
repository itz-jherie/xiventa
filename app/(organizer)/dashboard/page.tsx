"use client";

import { Suspense } from "react";
import { Overview } from "@/components/dashboard/DashHome";

/** OW02 Overview (`?state=new` shows OW02 New host). Other dashboard pages live in [...path]. */
export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Overview />
    </Suspense>
  );
}
