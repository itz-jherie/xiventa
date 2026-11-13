import * as React from "react";

export function HangerIcon({
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
      <path d="M10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 8.6 12 9.3V10" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12 10L20.5 16.2C21.1 16.7 20.8 17.7 20 17.7H3.99998C3.19998 17.7 2.89998 16.7 3.49998 16.2L12 10Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
