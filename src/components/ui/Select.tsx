'use client'

import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`appearance-none w-full h-12 pl-4 pr-10 bg-paper border rounded-default text-base text-charcoal transition-all duration-150 ease-out focus:outline-none focus:border-action-red focus:shadow-[0_0_0_3px_rgba(227,68,50,0.08)] disabled:bg-[rgba(37,34,30,0.04)] disabled:cursor-not-allowed ${
              error ? 'border-action-red' : 'border-soft-gray'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-ash pointer-events-none"
          />
        </div>
        {hint && !error && <p className="text-xs text-subtle-ash">{hint}</p>}
        {error && <p className="text-xs text-action-red">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
