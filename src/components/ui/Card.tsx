interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'peach' | 'dark'
  as?: 'div' | 'button'
}

const variants = {
  default: 'bg-paper border border-soft-gray',
  peach: 'bg-peach',
  dark: 'bg-charcoal text-paper',
}

export function Card({ children, className = '', onClick, variant = 'default', as = 'div' }: CardProps) {
  const Tag = (onClick ? 'button' : as) as 'div'
  return (
    <Tag
      className={`block w-full text-left rounded-card p-4 transition-all duration-150 ease-out ${
        variants[variant]
      } ${onClick ? 'hover:border-[rgba(37,34,30,0.2)] hover:shadow-subtle cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </Tag>
  )
}
