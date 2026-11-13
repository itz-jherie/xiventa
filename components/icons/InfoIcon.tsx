import * as React from "react";

export function InfoIcon({
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
      <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12 11V16" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12 9.20005C12.6627 9.20005 13.2 8.66279 13.2 8.00005C13.2 7.33731 12.6627 6.80005 12 6.80005C11.3372 6.80005 10.8 7.33731 10.8 8.00005C10.8 8.66279 11.3372 9.20005 12 9.20005Z" fill="#172B3A"/>
    </svg>
  );
}
