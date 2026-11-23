interface PaginationProps {
  /** e.g. "Showing 1 to 12 of 248" */
  summary: string;
  current?: number;
  pages?: (number | "…")[];
}

/** Figma `Pagination`: 56 high, summary left, page buttons right (32 squares, radius 8, gap 8). */
export function Pagination({ summary, current = 1, pages = [1, 2, 3, "…", 8] }: PaginationProps) {
  const ghost = "inline-flex h-8 items-center justify-center rounded-[8px] border border-[#B4BFCA] bg-white px-3 text-[13px] leading-4 text-[#172B3A] hover:border-[#68788A]";
  return (
    <nav aria-label="Pagination" className="flex h-14 items-center justify-between py-3">
      <p className="text-[13px] leading-[18px] text-[#4D5E70]">{summary}</p>
      <div className="flex items-center gap-2">
        <button type="button" className={ghost}>Previous</button>
        {pages.map((p, i) => (
          <button
            key={i}
            type="button"
            aria-current={p === current ? "page" : undefined}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[13px] leading-4 ${
              p === current ? "bg-[#E22765] text-white" : "text-[#172B3A] hover:bg-[#F4F6F8]"
            }`}
          >
            {p}
          </button>
        ))}
        <button type="button" className={ghost}>Next</button>
      </div>
    </nav>
  );
}
