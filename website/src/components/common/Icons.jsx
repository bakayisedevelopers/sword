import React from 'react';

/**
 * ChevronRight icon: represents forward navigation ">" as an SVG icon without a shaft.
 */
export function ChevronRight({ className = 'w-4 h-4', strokeWidth = 2.5 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

/**
 * ChevronLeft icon: represents backward navigation "<" as an SVG icon without a shaft.
 */
export function ChevronLeft({ className = 'w-4 h-4', strokeWidth = 2.5 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

export default ChevronRight;
