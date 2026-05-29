'use client'

import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'text' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-action-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary:
    'bg-action-red text-white hover:bg-cta-hover hover:shadow-lg disabled:bg-soft-gray disabled:hover:shadow-none',
  secondary: 'bg-[rgba(37,34,30,0.07)] text-charcoal hover:bg-[rgba(37,34,30,0.12)]',
  tertiary: 'bg-transparent border border-soft-gray text-charcoal hover:bg-[rgba(37,34,30,0.04)]',
  text: 'bg-transparent text-charcoal hover:bg-[rgba(37,34,30,0.07)]',
  ghost: 'bg-transparent text-subtle-ash hover:bg-[rgba(37,34,30,0.07)] hover:text-charcoal',
  destructive: 'bg-action-red text-white hover:bg-cta-hover hover:shadow-lg',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-default',
  md: 'h-12 px-4 text-base-2 rounded-btn',
  lg: 'h-14 px-6 text-lg rounded-btn',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, fullWidth, disabled, children, className = '', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
