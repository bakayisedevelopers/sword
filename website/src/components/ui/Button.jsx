import React from 'react';
import { LoadingSpinner } from './LoadingSpinner.jsx';

/**
 * Reusable Button component reproducing FlutterFlow's FFButtonWidget:
 * flutter-website/lib/flutter_flow/flutter_flow_widgets.dart
 */
export function Button({
  text,
  icon,
  iconAlignment = 'start',
  onClick,
  loading = false,
  disabled = false,
  color,
  textColor,
  borderColor,
  borderRadius = '50px',
  width,
  height = '40px',
  elevation = 0,
  showLoadingIndicator = true,
  className = '',
  style = {},
  children,
  type = 'button',
  ...props
}) {
  const content = text || children;

  const dynamicStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    backgroundColor: color || undefined,
    color: textColor || undefined,
    borderColor: borderColor || undefined,
    boxShadow: elevation ? `0 ${elevation * 2}px ${elevation * 4}px rgba(0,0,0,0.15)` : undefined,
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={dynamicStyle}
      className={`inline-flex items-center justify-center px-4 font-bold text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border ${className}`}
      {...props}
    >
      {loading && showLoadingIndicator ? (
        <LoadingSpinner size={20} color={textColor || 'currentColor'} />
      ) : (
        <span className="inline-flex items-center gap-2">
          {icon && iconAlignment === 'start' && <span className="inline-flex">{icon}</span>}
          {content && <span>{content}</span>}
          {icon && iconAlignment === 'end' && <span className="inline-flex">{icon}</span>}
        </span>
      )}
    </button>
  );
}

export default Button;
