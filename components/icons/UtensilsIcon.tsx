import * as React from "react";

export function UtensilsIcon({
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
      <path d="M7 3.5V10.5C7 11.0304 7.21071 11.5391 7.58579 11.9142C7.96086 12.2893 8.46957 12.5 9 12.5M9 12.5C9.53043 12.5 10.0391 12.2893 10.4142 11.9142C10.7893 11.5391 11 11.0304 11 10.5V3.5M9 12.5V20.5M17 20.5V13M17 13V3.5C15 4.5 14 7 14 10V13H17Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
