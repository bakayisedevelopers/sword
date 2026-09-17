import React from 'react';

/**
 * Reusable page container providing FlutterFlow's standard 90% width container behavior:
 * width: MediaQuery.sizeOf(context).width * 0.9
 */
export function PageContainer({
  children,
  className = '',
  maxWidth = 'max-w-[1440px]',
  width = 'w-[90%]',
  ...props
}) {
  return (
    <div
      className={`${width} ${maxWidth} mx-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default PageContainer;
