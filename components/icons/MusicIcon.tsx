import * as React from "react";

export function MusicIcon({
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
      <path d="M9 18V6L19 4V16" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M9 18C9 19.3807 7.88071 20.5 6.5 20.5C5.11929 20.5 4 19.3807 4 18C4 16.6193 5.11929 15.5 6.5 15.5C7.88071 15.5 9 16.6193 9 18Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M19 16C19 17.3807 17.8807 18.5 16.5 18.5C15.1193 18.5 14 17.3807 14 16C14 14.6193 15.1193 13.5 16.5 13.5C17.8807 13.5 19 14.6193 19 16Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
