import * as React from "react";

export function ChevronDownIcon({
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
      <path d="M6 9L12 15L18 9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
