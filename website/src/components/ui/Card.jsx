import React from 'react';

/**
 * Reusable Card component reproducing FlutterFlow's standard rounded-30px card container.
 */
export function Card({
  children,
  variant = 'dark', // 'dark' (#192431) or 'light' (#FFFFFF)
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const baseClasses =
    variant === 'dark'
      ? 'bg-ff-secondary text-white border border-ff-secondary'
      : 'bg-white text-ff-primary-text border border-slate-200';

  return (
    <div
      onClick={onClick}
      style={style}
      className={`rounded-[30px] p-5 md:p-6 transition-all ${baseClasses} ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
