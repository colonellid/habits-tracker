interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: 'red' | 'green' | 'blue' | 'none'
}

const accentColors = {
  red: 'text-action-red',
  green: 'text-success-green',
  blue: 'text-accent-blue',
  none: 'text-charcoal',
}

export function StatCard({ label, value, sub, accent = 'none' }: StatCardProps) {
  return (
    <div className="bg-paper border border-soft-gray rounded-card p-4 flex flex-col gap-1 flex-1 min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash">
        {label}
      </p>
      <p className={`font-display text-[28px] font-bold leading-none ${accentColors[accent]}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-dusty-sage">{sub}</p>}
    </div>
  )
}
