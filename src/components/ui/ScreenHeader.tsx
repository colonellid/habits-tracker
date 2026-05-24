'use client'

interface ScreenHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function ScreenHeader({ eyebrow, title, subtitle, actions, className = '' }: ScreenHeaderProps) {
  return (
    <header className={`flex items-start justify-between gap-4 mb-5 ${className}`}>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="text-sm text-subtle-ash mb-1">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl font-bold text-charcoal tracking-[-0.005em]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm-2 text-subtle-ash mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}
