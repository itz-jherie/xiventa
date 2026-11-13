import * as React from "react";

export function BalloonIcon({
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
      <path d="M17 9C17 12.3 14.8 15 12 15C9.2 15 7 12.3 7 9C7 5.7 9.2 4 12 4C14.8 4 17 5.7 17 9Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M11 15L12 16.5L13 15" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12 16.5C12 18 10.5 18.5 11 20.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
