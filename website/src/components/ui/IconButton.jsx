import React from 'react';
import { LoadingSpinner } from './LoadingSpinner.jsx';

/**
 * Reusable IconButton component reproducing FlutterFlowIconButton:
 * flutter-website/lib/flutter_flow/flutter_flow_icon_button.dart
 */
export function IconButton({
  icon,
  buttonSize = 50,
  borderRadius = 50,
  borderWidth = 1,
  borderColor = 'transparent',
  fillColor = 'transparent',
  hoverColor,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) {
  const size = typeof buttonSize === 'number' ? `${buttonSize}px` : buttonSize;
  const radius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: `${borderWidth}px`,
        borderColor: borderColor,
        backgroundColor: fillColor,
        ...style,
      }}
      className={`inline-flex items-center justify-center p-0 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? <LoadingSpinner size={20} /> : icon}
    </button>
  );
}

export default IconButton;
