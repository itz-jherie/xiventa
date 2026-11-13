import * as React from "react";

export function LaptopIcon({
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
      <path d="M6.5 5H17.5C18.3284 5 19 5.67157 19 6.5V13.5C19 14.3284 18.3284 15 17.5 15H6.5C5.67157 15 5 14.3284 5 13.5V6.5C5 5.67157 5.67157 5 6.5 5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M3 19H21" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
