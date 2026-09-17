import React from 'react';

/**
 * Reusable text input and textarea reproducing FlutterFlow form inputs.
 */
export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  multiline = false,
  rows = 4,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ff-primary-text">
          {label} {required && <span className="text-ff-error">*</span>}
        </label>
      )}

      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          value={value ?? ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 text-sm bg-white text-ff-primary-text border rounded-[20px] focus:outline-none focus:border-ff-alternate transition-colors resize-none disabled:bg-slate-100 ${
            error ? 'border-ff-error' : 'border-slate-300'
          }`}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-11 px-4 text-sm bg-white text-ff-primary-text border rounded-[20px] focus:outline-none focus:border-ff-alternate transition-colors disabled:bg-slate-100 ${
            error ? 'border-ff-error' : 'border-slate-300'
          }`}
          {...props}
        />
      )}

      {error && <p className="text-xs text-ff-error mt-0.5">{error}</p>}
    </div>
  );
}

export default Input;
