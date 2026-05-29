'use client'

import { Flame } from 'lucide-react'

interface BigStatProps {
  eyebrow: string
  value: string | number
  unit?: string
  footer?: string
  icon?: React.ReactNode
}

export function BigStat({ eyebrow, value, unit, footer, icon }: BigStatProps) {
  return (
    <div className="bg-charcoal text-paper rounded-card p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-paper/70 mb-3">
        {eyebrow}
      </p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display text-[56px] font-bold leading-none">{value}</span>
        {unit && <span className="text-lg text-paper/70">{unit}</span>}
      </div>
      {footer && (
        <p className="text-sm-2 text-paper/70 mt-3 flex items-center gap-2">
          {icon ?? <Flame size={14} strokeWidth={2} />}
          {footer}
        </p>
      )}
    </div>
  )
}
