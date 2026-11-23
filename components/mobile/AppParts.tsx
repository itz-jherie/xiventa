import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

/* 20 px stroke icons exported from the Figma rows (EC00 sheet, AM37 ticket). */
export const TicketLineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3.333 5.833C3.333 5.391 3.509 4.967 3.821 4.655C4.134 4.342 4.558 4.167 5 4.167H15C15.442 4.167 15.866 4.342 16.178 4.655C16.491 4.967 16.666 5.391 16.666 5.833V7.917C16.114 7.917 15.584 8.136 15.193 8.527C14.803 8.918 14.583 9.447 14.583 10C14.583 10.553 14.803 11.082 15.193 11.473C15.584 11.864 16.114 12.083 16.666 12.083V14.167C16.666 14.609 16.491 15.033 16.178 15.345C15.866 15.658 15.442 15.833 15 15.833H5C4.558 15.833 4.134 15.658 3.821 15.345C3.509 15.033 3.333 14.609 3.333 14.167V12.083C3.886 12.083 4.415 11.864 4.806 11.473C5.197 11.082 5.416 10.553 5.416 10C5.416 9.447 5.197 8.918 4.806 8.527C4.415 8.136 3.886 7.917 3.333 7.917V5.833Z" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.083 5V6.25M12.083 9.375V10.625M12.083 13.75V15" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const StoreLineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3.333 7.5L4.583 3.333H15.416L16.666 7.5H3.333Z" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.167 7.5V16.667H8.334M8.334 16.667H11.667M8.334 16.667V12.5H11.667V16.667M11.667 16.667H15.834V7.5" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const BuildingLineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2.5 7.5L10 3.333L17.5 7.5H2.5Z" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8.75V14.167M5 14.167H3.333M5 14.167H8.333M8.333 8.75V14.167M8.333 14.167H11.667M11.667 8.75V14.167M11.667 14.167H15M15 8.75V14.167M15 14.167H16.667M2.5 16.667H17.5" stroke="#172B3A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Figma `Row` (EC00, AM37, PW17): 66 high, 12 px vertical padding, gap 12, 36 px grey icon circle,
 * 16 / 24 title, 12 / 16 #68788A subtitle, 20 px chevron.
 */
export function ActionRow({
  icon,
  title,
  subtitle,
  href,
  onClick,
  trailing,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F8] text-[#172B3A]">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="truncate text-[16px] leading-6 tracking-[-0.01em] text-[#172B3A]">{title}</span>
        {subtitle && <span className="truncate text-[12px] leading-4 text-[#68788A]">{subtitle}</span>}
      </span>
      {trailing ?? <ChevronRightIcon size={20} className="shrink-0 text-[#4D5E70]" />}
    </>
  );
  const cls = "flex min-h-[66px] w-full items-center gap-3 py-3";
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
  return <div className={cls}>{inner}</div>;
}

/**
 * Figma `Segmented Control`: #E9EDF1 pill, 4 px padding, 36 px items, selected item white with
 * 0 1 2 / 0 2 8 rgba(23,43,58,0.06) shadows. `itemWidth` fixes item width (PW16 / PW22 use 104).
 */
export function Segmented<T extends string>({
  items,
  value,
  onChange,
  itemWidth,
  className = "",
}: {
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  itemWidth?: number;
  className?: string;
}) {
  return (
    <div role="tablist" className={`flex h-11 items-center rounded-full bg-[#E9EDF1] p-1 ${className}`}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.value)}
            style={itemWidth ? { width: itemWidth } : undefined}
            className={`flex h-9 items-center justify-center whitespace-nowrap rounded-full px-2 text-[14px] leading-[18px] transition ${itemWidth ? "" : "flex-1"} ${
              on ? "bg-white text-[#172B3A] shadow-[0_1px_2px_rgba(23,43,58,0.06),0_2px_8px_rgba(23,43,58,0.06)]" : "text-[#4D5E70]"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/** `Illustration / Tickets` from AM36 / AM77 Guest (112 x 90). */
export const TicketsIllustration = () => (
  <svg width="112" height="90" viewBox="0 0 112 90" fill="none" aria-hidden="true">
    <path fill="#977BFF" d="M12.9994 31.0398L89.6861 14.7395C91.1389 14.4307 92.6548 14.7117 93.9004 15.5206C95.146 16.3295 96.0193 17.6001 96.3281 19.0528L98.2686 28.1822C96.3316 28.5939 94.6374 29.7583 93.5589 31.4191C92.4804 33.0799 92.1057 35.1011 92.5175 37.0381C92.9292 38.9751 94.0935 40.6693 95.7543 41.7478C97.4151 42.8263 99.4364 43.2009 101.373 42.7892L103.314 51.9186C103.623 53.3714 103.342 54.8873 102.533 56.1329C101.724 57.3785 100.453 58.2517 99.0006 58.5605L22.3138 74.8608C20.861 75.1696 19.3451 74.8886 18.0995 74.0797C16.8539 73.2708 15.9807 72.0002 15.6719 70.5475L13.7314 61.4181C15.6684 61.0064 17.3625 59.8421 18.441 58.1812C19.5196 56.5204 19.8942 54.4992 19.4825 52.5622C19.0707 50.6252 17.9064 48.9311 16.2456 47.8525C14.5848 46.774 12.5636 46.3994 10.6265 46.8111L8.68603 37.6817C8.37724 36.229 8.6582 34.713 9.46711 33.4674C10.276 32.2218 11.5466 31.3486 12.9994 31.0398Z" />
    <path fill="#E22765" d="M23.4592 15.1024L94.004 22.517C95.481 22.6722 96.836 23.4079 97.7706 24.5621C98.7053 25.7164 99.1432 27.1946 98.9879 28.6717L98.0123 37.9539C96.0429 37.7469 94.0719 38.3307 92.5329 39.577C90.994 40.8232 90.0131 42.6297 89.8061 44.5992C89.5991 46.5686 90.1829 48.5396 91.4292 50.0786C92.6754 51.6175 94.4819 52.5984 96.4514 52.8054L95.4758 62.0876C95.3205 63.5647 94.5849 64.9196 93.4306 65.8543C92.2764 66.7889 90.7982 67.2268 89.3211 67.0716L18.7763 59.657C17.2993 59.5018 15.9444 58.7661 15.0097 57.6119C14.075 56.4577 13.6371 54.9794 13.7924 53.5023L14.768 44.2201C16.7374 44.4271 18.7084 43.8433 20.2474 42.5971C21.7864 41.3508 22.7672 39.5443 22.9742 37.5749C23.1812 35.6054 22.5974 33.6344 21.3511 32.0955C20.1049 30.5565 18.2984 29.5756 16.3289 29.3686L17.3045 20.0864C17.4598 18.6093 18.1954 17.2544 19.3497 16.3198C20.5039 15.3851 21.9821 14.9472 23.4592 15.1024Z" />
    <path fill="#F3FDB8" d="M42.4194 49.0034C47.5458 49.5422 52.1384 45.8232 52.6772 40.6968C53.216 35.5704 49.497 30.9778 44.3706 30.439C39.2442 29.9002 34.6516 33.6192 34.1128 38.7456C33.574 43.872 37.293 48.4646 42.4194 49.0034Z" />
    <path fill="#FDCFBC" d="M72.6076 29.6529C72.7154 28.6276 71.9716 27.7091 70.9463 27.6014C69.921 27.4936 69.0025 28.2374 68.8947 29.2627L68.5045 32.9756C68.3967 34.0009 69.1405 34.9194 70.1658 35.0271C71.1911 35.1349 72.1096 34.3911 72.2174 33.3658L72.6076 29.6529Z" />
    <path fill="#FDCFBC" d="M71.4367 40.7916C71.5445 39.7663 70.8007 38.8478 69.7754 38.74C68.7501 38.6323 67.8316 39.3761 67.7238 40.4014L67.3336 44.1142C67.2258 45.1395 67.9696 46.058 68.9949 46.1658C70.0202 46.2736 70.9387 45.5298 71.0465 44.5045L71.4367 40.7916Z" />
    <path fill="#FDCFBC" d="M70.2661 51.9303C70.3738 50.905 69.63 49.9865 68.6047 49.8787C67.5794 49.771 66.6609 50.5148 66.5532 51.54L66.1629 55.2529C66.0552 56.2782 66.799 57.1967 67.8243 57.3045C68.8495 57.4122 69.7681 56.6684 69.8758 55.6432L70.2661 51.9303Z" />
  </svg>
);

/**
 * Figma `Empty State` (AM36 / AM77 Guest): 60 px above, 24 px padding, gap 12, 144 x 120 pink art
 * tile (radius 24), 20 / 26 bold title, 14 / 20 body, 44 px outline button (radius 12, #B4BFCA).
 */
export function EmptyState({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 pb-6 pt-[84px] text-center">
      <div className="flex h-[120px] w-[144px] items-center justify-center rounded-[24px] bg-[#FDEEF3]">
        <TicketsIllustration />
      </div>
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#172B3A]">{title}</h2>
      <p className="max-w-[358px] text-[14px] leading-5 text-[#4D5E70]">{body}</p>
      {action && href && (
        <Link
          href={href}
          className="flex h-11 items-center rounded-[12px] border border-[#B4BFCA] bg-white px-4 text-[14px] leading-[18px] text-[#172B3A]"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

/** Figma `Top Bar` title row on app tab screens: 56 high, 16 px sides, 17 / 22 bold. */
export function AppTitleBar({ title }: { title: string }) {
  return (
    <div className="flex h-14 items-center px-4">
      <h1 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[#172B3A]">{title}</h1>
    </div>
  );
}
