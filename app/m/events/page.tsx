import { getAllEvents } from "@/data";
import { defaultState } from "@/lib/eventState";
import { HubShell, HubSection } from "@/components/mobile/HubShell";
import { HubChips } from "@/components/mobile/HubChips";
import { ListEventCard } from "@/components/mobile/AppEventCards";
import { categoryTone } from "@/lib/categoryTone";

/** AM12 Events hub (263:7525): chips, This weekend, Next week. Desktops go to PW02 /events. */
export default function EventsHub() {
  const live = getAllEvents().filter((e) => !["ended", "cancelled"].includes(defaultState(e)));
  const weekend = live.filter((e) => e.isWeekend).slice(0, 6);
  const next = live.filter((e) => !e.isWeekend).slice(0, 8);
  return (
    <HubShell title="Events" subtitle="Lagos" webHref="/events">
      <HubChips kind="events" quick={["Today", "This weekend", "Free", "Online"]} count={live.length} />
      <HubSection title="This weekend" />
      <div className="flex flex-col items-center gap-3 px-4">
        {weekend.map((e) => (
          <ListEventCard key={e.slug} event={e} categoryTag={categoryTone(e.categoryLabel)} />
        ))}
      </div>
      <HubSection title="Next week" />
      <div className="flex flex-col items-center gap-3 px-4">
        {next.map((e) => (
          <ListEventCard key={e.slug} event={e} categoryTag={categoryTone(e.categoryLabel)} />
        ))}
      </div>
    </HubShell>
  );
}
