import * as React from "react";

export function AccessibilityIcon({
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
      <path d="M17 4C17 4.55228 16.5523 5 16 5C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3C16.5523 3 17 3.44772 17 4Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M18 19L19 12L13 13" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M5 8L8 5L13.5 8L11.14 11.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M4.23999 14.5C3.95782 15.4231 3.94887 16.4081 4.2142 17.3361C4.47953 18.2641 5.00781 19.0955 5.73526 19.73C6.46271 20.3644 7.35824 20.7746 8.31375 20.9113C9.26925 21.0479 10.2439 20.9051 11.12 20.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M13.76 17.5C14.0422 16.5769 14.0511 15.5919 13.7858 14.6639C13.5205 13.7358 12.9922 12.9044 12.2647 12.27C11.5373 11.6356 10.6417 11.2253 9.68624 11.0887C8.73074 10.952 7.75611 11.0949 6.88 11.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
