import * as React from "react";

export function CarIcon({
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
      <path d="M21 7.99995L19 9.99995L17.5 6.29995C17.3588 5.92192 17.1065 5.59544 16.7763 5.36343C16.4462 5.13141 16.0535 5.0047 15.65 4.99995H8.4C7.99266 4.99144 7.59244 5.10754 7.25289 5.33272C6.91334 5.55789 6.65066 5.8814 6.5 6.25995L5 9.99995L3 7.99995" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M5 10H19C20.1046 10 21 10.8954 21 12V16C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 16V12C3 10.8954 3.89543 10 5 10Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M7 14H7.01M17 14H17.01M5 18V20M19 18V20" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
