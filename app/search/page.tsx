import { Suspense } from "react";
import { SearchPage } from "@/components/search/SearchPage";

/** Search: AM17 / AM18 on phones, PW05 from 768 px. `?q=` holds the query. */
export default function Search() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
