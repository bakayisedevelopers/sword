import { useEffect, useRef, useState } from 'react';

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChoiceDropdown({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find((option) => option.id === value);

  return (
    <div ref={rootRef} className="relative block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-sm text-white outline-none transition hover:border-brand-gold/60 focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={selected ? 'text-white' : 'text-slate-500'}>{selected?.label || placeholder}</span>
        <Chevron />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <div className="max-h-72 space-y-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {options.length ? (
              options.map((option) => {
                const active = option.id === value;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      active
                        ? 'bg-brand-gold/15 text-brand-gold'
                        : 'text-slate-200 hover:bg-brand-gold/10 hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    {active ? <span className="text-xs font-semibold uppercase tracking-[0.2em]">Selected</span> : null}
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl px-3 py-2 text-sm text-slate-500">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
