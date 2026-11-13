import * as React from "react";

export function HeartFilledIcon({
  size = 24,
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 19.4999C12 19.4999 5 15.1999 5 9.6999C5.00919 8.89131 5.26324 8.1045 5.72864 7.44321C6.19405 6.78192 6.84895 6.27722 7.607 5.99566C8.36504 5.7141 9.19062 5.66891 9.97486 5.86604C10.7591 6.06317 11.4652 6.49337 12 7.0999C12.5348 6.49337 13.2409 6.06317 14.0251 5.86604C14.8094 5.66891 15.635 5.7141 16.393 5.99566C17.151 6.27722 17.806 6.78192 18.2714 7.44321C18.7368 8.1045 18.9908 8.89131 19 9.6999C19 15.1999 12 19.4999 12 19.4999Z" fill="currentColor" strokeWidth="1.75" strokeLinejoin="round" stroke="currentColor"/>
    </svg>
  );
}
