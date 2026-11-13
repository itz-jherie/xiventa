import * as React from "react";

export function ImageIcon({
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
      <path d="M6.5 5H17.5C18.8807 5 20 6.11929 20 7.5V16.5C20 17.8807 18.8807 19 17.5 19H6.5C5.11929 19 4 17.8807 4 16.5V7.5C4 6.11929 5.11929 5 6.5 5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M10.75 10C10.75 10.9665 9.9665 11.75 9 11.75C8.0335 11.75 7.25 10.9665 7.25 10C7.25 9.0335 8.0335 8.25 9 8.25C9.9665 8.25 10.75 9.0335 10.75 10Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M5 17L9.5 12.5L12.5 15.5L15 13L20 17" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
