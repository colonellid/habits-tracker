interface DailyProgressProps {
  done: number
  total: number
  label?: string
}

export function DailyProgress({ done, total, label = 'HOJE' }: DailyProgressProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="bg-peach rounded-[12px] px-4 py-3 flex items-center gap-4 mb-4">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-1">
          {label}
        </p>
        <p className="font-display text-[22px] font-bold text-charcoal leading-none">
          {pct}%
        </p>
        <p className="text-sm text-subtle-ash mt-1">
          <span className="font-semibold text-charcoal">{done}</span> de{' '}
          <span className="font-semibold text-charcoal">{total}</span> hábitos
        </p>
      </div>
      <div className="shrink-0 w-20 h-1.5 rounded-full bg-bg-muted overflow-hidden">
        <div
          className="h-full bg-action-red rounded-full transition-[width] duration-250 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
