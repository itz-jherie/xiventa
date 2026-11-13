import * as React from "react";

export function BriefcaseIcon({
  size = 24,
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M5.5 7H18.5C19.9 7 21 8.1 21 9.5V17.5C21 18.9 19.9 20 18.5 20H5.5C4.1 20 3 18.9 3 17.5V9.5C3 8.1 4.1 7 5.5 7Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M9 7V5.5C9 4.7 9.7 4 10.5 4H13.5C14.3 4 15 4.7 15 5.5V7M3 12.5H21" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
