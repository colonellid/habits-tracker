'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  unit?: string
  step?: number
  min?: number
  max?: number
}

export function QuantityInput({
  value,
  onChange,
  unit = '',
  step = 1,
  min = 0,
  max,
}: QuantityInputProps) {
  const hasGoal = max !== undefined
  const pct = hasGoal ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-12 h-12 rounded-full bg-bg-muted text-charcoal hover:bg-bg-muted-strong active:scale-95 transition-all flex items-center justify-center"
          aria-label="Diminuir"
        >
          <Minus size={20} strokeWidth={2} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-display text-[56px] font-bold text-charcoal leading-none">
            {value}
          </p>
          {unit && <p className="text-sm text-subtle-ash mt-1">{unit}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChange(hasGoal ? Math.min(max, value + step) : value + step)}
          className="w-12 h-12 rounded-full bg-action-red text-white hover:bg-cta-hover active:scale-95 transition-all flex items-center justify-center"
          aria-label="Aumentar"
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>

      {hasGoal && (
        <div>
          <div className="h-1.5 rounded-full bg-bg-muted overflow-hidden">
            <div
              className="h-full bg-action-red rounded-full transition-[width] duration-250 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-subtle-ash mt-1.5 text-right">
            {value >= max
              ? `${pct}% — meta atingida!`
              : `${pct}% — ${max - value}${unit ? ` ${unit}` : ''} restante${max - value === 1 ? '' : 's'}`}
          </p>
        </div>
      )}
    </div>
  )
}
