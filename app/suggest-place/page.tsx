import { Suspense } from "react";
import { SuggestPlace } from "@/components/place/PlaceFlows";

/** AM80 / PW48 Suggest a place. ?step=sent shows the thank-you state. */
export default function SuggestPlacePage() {
  return (
    <Suspense fallback={null}>
      <SuggestPlace />
    </Suspense>
  );
}
