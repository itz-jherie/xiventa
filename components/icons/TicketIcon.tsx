import * as React from "react";

export function TicketIcon({
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
      <path d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V9.5C19.337 9.5 18.7011 9.76339 18.2322 10.2322C17.7634 10.7011 17.5 11.337 17.5 12C17.5 12.663 17.7634 13.2989 18.2322 13.7678C18.7011 14.2366 19.337 14.5 20 14.5V17C20 17.5304 19.7893 18.0391 19.4142 18.4142C19.0391 18.7893 18.5304 19 18 19H6C5.46957 19 4.96086 18.7893 4.58579 18.4142C4.21071 18.0391 4 17.5304 4 17V14.5C4.66304 14.5 5.29893 14.2366 5.76777 13.7678C6.23661 13.2989 6.5 12.663 6.5 12C6.5 11.337 6.23661 10.7011 5.76777 10.2322C5.29893 9.76339 4.66304 9.5 4 9.5V7Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M14.5 6V7.5M14.5 11.25V12.75M14.5 16.5V18" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
