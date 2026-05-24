'use client'

interface DurationInputProps {
  value: number // total minutes
  onChange: (minutes: number) => void
}

const PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '1h', minutes: 60 },
]

export function DurationInput({ value, onChange }: DurationInputProps) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="flex items-baseline gap-3">
          <input
            type="number"
            min={0}
            max={23}
            value={String(hours).padStart(2, '0')}
            onChange={(e) => {
              const h = Math.max(0, Math.min(23, parseInt(e.target.value || '0', 10)))
              onChange(h * 60 + minutes)
            }}
            className="font-display text-[44px] font-bold text-charcoal bg-transparent w-[80px] text-center focus:outline-none focus:bg-bg-muted rounded-default"
          />
          <span className="font-display text-[44px] font-bold text-dusty-sage">:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={String(minutes).padStart(2, '0')}
            onChange={(e) => {
              const m = Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10)))
              onChange(hours * 60 + m)
            }}
            className="font-display text-[44px] font-bold text-charcoal bg-transparent w-[80px] text-center focus:outline-none focus:bg-bg-muted rounded-default"
          />
        </div>
        <div className="flex gap-[88px] text-xs text-subtle-ash uppercase tracking-[0.06em]">
          <span>horas</span>
          <span>minutos</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.minutes)}
            className={`py-2.5 rounded-default text-sm-2 font-semibold transition-all border ${
              value === p.minutes
                ? 'bg-action-red border-action-red text-white'
                : 'bg-paper border-soft-gray text-charcoal hover:border-charcoal'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
