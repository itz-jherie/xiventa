import * as React from "react";

export function WifiOffIcon({
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
      <path d="M12 20H12.01" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M8.5 16.43C9.43464 15.5139 10.6912 15.0007 12 15.0007C13.3088 15.0007 14.5654 15.5139 15.5 16.43" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M2 8.81992C3.23397 7.71216 4.64308 6.81669 6.17 6.16992" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M10.66 4.99997C14.67 4.63997 18.8 5.89997 22 8.75997" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M16.85 11.25C17.6647 11.7037 18.412 12.2692 19.07 12.93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M5 12.8599C6.41803 11.4698 8.21781 10.5334 10.17 10.1699" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
<path d="M2 2L22 22" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
