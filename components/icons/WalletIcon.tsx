import * as React from "react";

export function WalletIcon({
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
      <path d="M4 7.5C4 6.83696 4.26339 6.20107 4.73223 5.73223C5.20107 5.26339 5.83696 5 6.5 5H18V8M4 7.5V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H19C19.2652 19 19.5196 18.8946 19.7071 18.7071C19.8946 18.5196 20 18.2652 20 18V9C20 8.73478 19.8946 8.48043 19.7071 8.29289C19.5196 8.10536 19.2652 8 19 8H18M4 7.5C4.33352 7.79996 4.74161 8.00466 5.18147 8.09263C5.62133 8.18061 6.07676 8.14861 6.5 8H18" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M16 14.7C16.6627 14.7 17.2 14.1628 17.2 13.5C17.2 12.8373 16.6627 12.3 16 12.3C15.3372 12.3 14.8 12.8373 14.8 13.5C14.8 14.1628 15.3372 14.7 16 14.7Z" fill="#172B3A"/>
    </svg>
  );
}
