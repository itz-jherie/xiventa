import * as React from "react";

export function FilterIcon({
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
      <path d="M4 7H13M17 7H20M4 17H8M12 17H20" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M17 7C17 8.10457 16.1046 9 15 9C13.8954 9 13 8.10457 13 7C13 5.89543 13.8954 5 15 5C16.1046 5 17 5.89543 17 7Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12 17C12 18.1046 11.1046 19 10 19C8.89543 19 8 18.1046 8 17C8 15.8954 8.89543 15 10 15C11.1046 15 12 15.8954 12 17Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
