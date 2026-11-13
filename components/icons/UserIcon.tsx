import * as React from "react";

export function UserIcon({
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
      <path d="M15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5C13.933 5 15.5 6.567 15.5 8.5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M5 20C5 18.1435 5.7375 16.363 7.05025 15.0503C8.36301 13.7375 10.1435 13 12 13C13.8565 13 15.637 13.7375 16.9497 15.0503C18.2625 16.363 19 18.1435 19 20" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
