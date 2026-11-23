"use client";

import { Suspense } from "react";
import { AdminHome } from "@/components/admin/AdminPeople";

/** AW02 Admin dashboard. Other admin pages live in [...path]. */
export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminHome />
    </Suspense>
  );
}
