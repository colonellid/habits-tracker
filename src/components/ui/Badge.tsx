type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-todoist-gray-200 text-todoist-gray-700',
  success: 'bg-todoist-green-light text-todoist-green',
  warning: 'bg-todoist-orange-light text-todoist-orange',
  error: 'bg-todoist-red-light text-todoist-red',
  info: 'bg-todoist-blue-light text-todoist-blue',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>{children}</span>
  )
}
