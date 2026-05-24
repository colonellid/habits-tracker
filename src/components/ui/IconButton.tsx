'use client'

import { forwardRef } from 'react'

type Variant = 'muted' | 'ghost' | 'solid'
type Size = 'sm' | 'md' | 'lg'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  'aria-label': string
}

const sizes: Record<Size, string> = {
  sm: 'w-9 h-9',
  md: 'w-10 h-10',
  lg: 'w-11 h-11',
}

const variants: Record<Variant, string> = {
  muted: 'bg-[rgba(37,34,30,0.07)] text-charcoal hover:bg-[rgba(37,34,30,0.12)]',
  ghost: 'bg-transparent text-charcoal hover:bg-[rgba(37,34,30,0.07)]',
  solid: 'bg-charcoal text-paper hover:bg-[#1a1814]',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'muted', size = 'md', children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-default transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-action-red focus-visible:ring-offset-2 disabled:opacity-50 active:scale-[0.95] ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
