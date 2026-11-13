import * as React from "react";

export function VideoIcon({
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
      <path d="M5.5 7H12.5C13.9 7 15 8.1 15 9.5V14.5C15 15.9 13.9 17 12.5 17H5.5C4.1 17 3 15.9 3 14.5V9.5C3 8.1 4.1 7 5.5 7Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M15 10.5L21 7.5V16.5L15 13.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
