import * as React from "react";

export function StarIcon({
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
      <path d="M12 4L14.35 8.9L19.75 9.6L15.8 13.3L16.8 18.6L12 16L7.2 18.6L8.2 13.3L4.25 9.6L9.65 8.9L12 4Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
