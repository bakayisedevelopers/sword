import React from 'react';

/**
 * Loading spinner reproducing Flutter's CircularProgressIndicator.
 * Default size: 23px (from flutter_flow_widgets.dart).
 */
export function LoadingSpinner({
  size = 23,
  color = 'currentColor',
  strokeWidth = 2.5,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center justify-center animate-spin ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
}

export default LoadingSpinner;
