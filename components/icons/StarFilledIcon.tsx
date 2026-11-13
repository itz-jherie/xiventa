import * as React from "react";

export function StarFilledIcon({
  size = 24,
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M15.1395 7.87209L17.9655 13.726L24.425 14.5335L19.6813 18.9744L20.8925 25.333L15.1395 22.2042L9.38648 25.333L10.5976 18.9744L5.85393 14.5335L12.3134 13.726L15.1395 7.87209Z" fill="black" strokeWidth="1.76627" strokeLinecap="round" stroke="currentColor"/>
    </svg>
  );
}
