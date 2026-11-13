import * as React from "react";

export function AlertIcon({
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
<path d="M12 7.5V12.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12 17.2C12.6627 17.2 13.2 16.6628 13.2 16C13.2 15.3373 12.6627 14.8 12 14.8C11.3372 14.8 10.8 15.3373 10.8 16C10.8 16.6628 11.3372 17.2 12 17.2Z" fill="#172B3A"/>
    </svg>
  );
}
