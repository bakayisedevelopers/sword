import React from 'react';

/**
 * Reusable Select dropdown reproducing FlutterFlowDropDown:
 * flutter-website/lib/flutter_flow/flutter_flow_drop_down.dart
 */
export function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  style = {},
  id,
  name,
  ...props
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  return (
    <div className={`relative inline-block w-full ${className}`}>
      <select
        id={id}
        name={name}
        disabled={disabled}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={style}
        className="w-full h-11 px-4 pr-10 text-sm bg-white text-ff-primary-text border border-slate-300 rounded-[20px] appearance-none focus:outline-none focus:border-ff-alternate transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Down chevron icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default Select;
