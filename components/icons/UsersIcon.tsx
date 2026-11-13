import * as React from "react";

export function UsersIcon({
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
      <path d="M12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M3.5 19C3.5 17.5413 4.07946 16.1424 5.11091 15.1109C6.14236 14.0795 7.54131 13.5 9 13.5C10.4587 13.5 11.8576 14.0795 12.8891 15.1109C13.9205 16.1424 14.5 17.5413 14.5 19M15.5 6.5C16.0353 6.73337 16.4908 7.11787 16.8107 7.60636C17.1306 8.09484 17.301 8.66608 17.301 9.25C17.301 9.83392 17.1306 10.4052 16.8107 10.8936C16.4908 11.3821 16.0353 11.7666 15.5 12M17 19C16.9937 18.1963 16.8114 17.4038 16.4659 16.6781C16.1204 15.9525 15.62 15.3114 15 14.8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
