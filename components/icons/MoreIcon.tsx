import * as React from "react";

export function MoreIcon({
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
      <path d="M5.99999 13.2C6.66273 13.2 7.19999 12.6628 7.19999 12C7.19999 11.3373 6.66273 10.8 5.99999 10.8C5.33725 10.8 4.79999 11.3373 4.79999 12C4.79999 12.6628 5.33725 13.2 5.99999 13.2Z" fill="#172B3A"/>
<path d="M12 13.2C12.6627 13.2 13.2 12.6628 13.2 12C13.2 11.3373 12.6627 10.8 12 10.8C11.3372 10.8 10.8 11.3373 10.8 12C10.8 12.6628 11.3372 13.2 12 13.2Z" fill="#172B3A"/>
<path d="M18 13.2C18.6627 13.2 19.2 12.6628 19.2 12C19.2 11.3373 18.6627 10.8 18 10.8C17.3372 10.8 16.8 11.3373 16.8 12C16.8 12.6628 17.3372 13.2 18 13.2Z" fill="#172B3A"/>
    </svg>
  );
}
