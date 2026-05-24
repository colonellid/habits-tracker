type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(37,34,30,0.07)] text-charcoal',
  success: 'bg-light-green-tint text-badge-green',
  warning: 'bg-tint-orange text-link-orange',
  error: 'bg-tint-red text-action-red',
  info: 'bg-tint-blue text-accent-blue',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-badge text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
