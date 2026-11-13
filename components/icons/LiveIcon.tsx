import * as React from "react";

export function LiveIcon({
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
      <path d="M14 12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M8.49998 8.5001C6.59998 10.4001 6.59998 13.6001 8.49998 15.5001M15.5 8.5001C17.4 10.4001 17.4 13.6001 15.5 15.5001M5.59998 5.6001C2.09998 9.1001 2.09998 14.9001 5.59998 18.4001M18.4 5.6001C21.9 9.1001 21.9 14.9001 18.4 18.4001" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
