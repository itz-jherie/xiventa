import * as React from "react";

export function DiceIcon({
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
      <path d="M7 4H17C18.66 4 20 5.34 20 7V17C20 18.66 18.66 20 17 20H7C5.34 20 4 18.66 4 17V7C4 5.34 5.34 4 7 4Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M9 8.5C9 8.78 8.78 9 8.5 9C8.22 9 8 8.78 8 8.5C8 8.22 8.22 8 8.5 8C8.78 8 9 8.22 9 8.5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M12.5 12C12.5 12.28 12.28 12.5 12 12.5C11.72 12.5 11.5 12.28 11.5 12C11.5 11.72 11.72 11.5 12 11.5C12.28 11.5 12.5 11.72 12.5 12Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M16 15.5C16 15.78 15.78 16 15.5 16C15.22 16 15 15.78 15 15.5C15 15.22 15.22 15 15.5 15C15.78 15 16 15.22 16 15.5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
