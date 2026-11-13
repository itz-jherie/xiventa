import * as React from "react";

export function CameraIcon({
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
      <path d="M4 8.5C4 8.10218 4.15804 7.72064 4.43934 7.43934C4.72064 7.15804 5.10218 7 5.5 7H7.5L9 5H15L16.5 7H18.5C18.8978 7 19.2794 7.15804 19.5607 7.43934C19.842 7.72064 20 8.10218 20 8.5V17.5C20 17.8978 19.842 18.2794 19.5607 18.5607C19.2794 18.842 18.8978 19 18.5 19H5.5C5.10218 19 4.72064 18.842 4.43934 18.5607C4.15804 18.2794 4 17.8978 4 17.5V8.5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M15.25 12.5C15.25 14.2949 13.7949 15.75 12 15.75C10.2051 15.75 8.75 14.2949 8.75 12.5C8.75 10.7051 10.2051 9.25 12 9.25C13.7949 9.25 15.25 10.7051 15.25 12.5Z" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
