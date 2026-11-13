import * as React from "react";

export function SparkleIcon({
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
      <path d="M18.5 15.5V17.5M18.5 17.5V19.5M18.5 17.5H16.5M18.5 17.5H20.5M11 4L12.8 9.2L18 11L12.8 12.8L11 18L9.2 12.8L4 11L9.2 9.2L11 4Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
