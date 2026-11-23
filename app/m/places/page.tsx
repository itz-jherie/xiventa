import { getAllPlaces } from "@/data";
import { HubShell, HubSection } from "@/components/mobile/HubShell";
import { HubChips } from "@/components/mobile/HubChips";
import { AppPlaceRow } from "@/components/mobile/AppPlaceRow";

/** AM13 Places hub (263:7881): Open now near you, Weekend escapes. Desktops go to PW03 /places. */
export default function PlacesHub() {
  const all = getAllPlaces();
  const open = all.filter((p) => p.isOpenNow).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  const escapes = all.filter((p) => ["BEACHES", "HOTELS & POOLS", "OUTDOORS"].includes(p.categoryLabel) && !open.includes(p)).slice(0, 4);
  return (
    <HubShell title="Places" subtitle="Lagos" webHref="/places">
      <HubChips kind="places" lead="Open now" quick={["Near me", "Restaurants", "Bars & Lounges", "Beaches", "Fun & Games"]} count={all.length} />
      <HubSection title="Open now near you" />
      <div className="flex flex-col items-center gap-3 px-4">
        {open.map((p) => (
          <AppPlaceRow key={p.slug} place={p} />
        ))}
      </div>
      <HubSection title="Weekend escapes" href="/category/outdoors" />
      <div className="flex flex-col items-center gap-3 px-4">
        {escapes.map((p) => (
          <AppPlaceRow key={p.slug} place={p} />
        ))}
      </div>
    </HubShell>
  );
}
