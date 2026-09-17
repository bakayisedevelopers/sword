import React from 'react';

/**
 * Reusable ChoiceChips component reproducing FlutterFlowChoiceChips:
 * flutter-website/lib/flutter_flow/flutter_flow_choice_chips.dart
 */
export function ChoiceChips({
  options = [],
  selected,
  onChanged,
  multiselect = false,
  chipSpacing = 10,
  rowSpacing = 10,
  className = '',
}) {
  const isSelected = (optLabel) => {
    if (multiselect && Array.isArray(selected)) {
      return selected.includes(optLabel);
    }
    return selected === optLabel;
  };

  const handleSelect = (optLabel) => {
    if (!onChanged) return;
    if (multiselect) {
      const currentList = Array.isArray(selected) ? [...selected] : [];
      if (currentList.includes(optLabel)) {
        onChanged(currentList.filter((item) => item !== optLabel));
      } else {
        onChanged([...currentList, optLabel]);
      }
    } else {
      onChanged(selected === optLabel ? '' : optLabel);
    }
  };

  return (
    <div
      className={`flex flex-wrap ${className}`}
      style={{ gap: `${rowSpacing}px ${chipSpacing}px` }}
    >
      {options.map((opt) => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const icon = typeof opt === 'object' ? opt.icon : null;
        const active = isSelected(label);

        return (
          <button
            key={label}
            type="button"
            onClick={() => handleSelect(label)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-[20px] transition-colors focus:outline-none border ${
              active
                ? 'bg-ff-alternate text-white border-ff-alternate'
                : 'bg-white text-ff-primary-text border-slate-300 hover:border-slate-400'
            }`}
          >
            {icon && <span>{icon}</span>}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ChoiceChips;
