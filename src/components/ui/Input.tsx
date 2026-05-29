'use client'

import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-12 px-4 bg-paper border rounded-default text-base text-charcoal placeholder:text-dusty-sage transition-all duration-150 ease-out focus:outline-none focus:border-action-red focus:shadow-[0_0_0_3px_rgba(227,68,50,0.08)] disabled:bg-[rgba(37,34,30,0.04)] disabled:cursor-not-allowed ${
            error ? 'border-action-red' : 'border-soft-gray'
          } ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-xs text-subtle-ash">{hint}</p>}
        {error && <p className="text-xs text-action-red">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
