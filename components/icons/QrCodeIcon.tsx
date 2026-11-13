import * as React from "react";

export function QrCodeIcon({
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
      <path d="M5 4H9C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9V5C4 4.44772 4.44772 4 5 4Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M15 4H19C19.5523 4 20 4.44772 20 5V9C20 9.55228 19.5523 10 19 10H15C14.4477 10 14 9.55228 14 9V5C14 4.44772 14.4477 4 15 4Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M5 14H9C9.55228 14 10 14.4477 10 15V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V15C4 14.4477 4.44772 14 5 14Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M14 20H15M20 14V15M14 14H16.5V16.5H14V14ZM17.5 17.5H20V20H17.5V17.5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
