import * as React from "react";

export function SearchIcon({
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
      <path d="M17.5 11C17.5 14.5899 14.5899 17.5 11 17.5C7.41015 17.5 4.5 14.5899 4.5 11C4.5 7.41015 7.41015 4.5 11 4.5C14.5899 4.5 17.5 7.41015 17.5 11Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M16 16L20 20" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
