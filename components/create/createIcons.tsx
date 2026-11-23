/** Icons used across the create flow, plus an eye-off glyph the icon set does not have. */
export {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  ImageIcon,
  LiveIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  TicketIcon,
  UploadIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/icons";

export function EyeOffIconFallback({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3L17 17M8.6 8.6A2 2 0 0 0 11.4 11.4M6.2 6.3C4.6 7.3 3.4 8.6 2.5 10c1.6 2.7 4.3 5 7.5 5 1.3 0 2.5-.4 3.6-1M9 5.1c.3 0 .7-.1 1-.1 3.2 0 5.9 2.3 7.5 5-.5.8-1 1.5-1.7 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
