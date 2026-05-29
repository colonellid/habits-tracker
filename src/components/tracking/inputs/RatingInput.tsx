'use client'

import { Star } from 'lucide-react'

interface RatingInputProps {
  value: number
  onChange: (score: number) => void
  max?: number
}

const LABELS_5 = ['Muito ruim', 'Ruim', 'Normal', 'Ótimo', 'Excelente']
const LABELS_10 = [
  'Terrível',
  'Muito ruim',
  'Ruim',
  'Abaixo',
  'Mediano',
  'Razoável',
  'Bom',
  'Muito bom',
  'Ótimo',
  'Excelente',
]

export function RatingInput({ value, onChange, max = 5 }: RatingInputProps) {
  const labels = max === 5 ? LABELS_5 : LABELS_10
  const label = value > 0 ? labels[value - 1] : 'Selecione uma nota'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 justify-center flex-wrap">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const active = n <= value
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n === value ? 0 : n)}
              aria-label={`${n} de ${max}`}
              className={`w-[52px] h-[52px] rounded-[12px] flex items-center justify-center transition-all duration-150 ${
                active
                  ? 'bg-tint-orange text-link-orange'
                  : 'bg-bg-muted text-dusty-sage hover:bg-bg-muted-strong'
              }`}
            >
              <Star
                size={22}
                strokeWidth={1.75}
                fill={active ? 'currentColor' : 'none'}
              />
            </button>
          )
        })}
      </div>
      <p className="text-sm text-subtle-ash">{label}</p>
    </div>
  )
}
