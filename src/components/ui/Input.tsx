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
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-todoist-charcoal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${error ? 'border-todoist-red focus:ring-todoist-red' : ''} ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-xs text-todoist-gray-500">{hint}</p>}
        {error && <p className="text-xs text-todoist-red">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
