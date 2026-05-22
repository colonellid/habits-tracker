'use client'

interface RatingInputProps {
  value: number
  onChange: (score: number) => void
  max?: number
}

export function RatingInput({ value, onChange, max = 5 }: RatingInputProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            onClick={() => onChange(star === value ? 0 : star)}
            className="text-3xl transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${star} out of ${max}`}
          >
            <span className={star <= value ? 'text-todoist-orange' : 'text-todoist-gray-300'}>
              ★
            </span>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-todoist-gray-500">
          <span className="font-semibold text-todoist-charcoal">{value}</span>/{max}
        </p>
      )}
    </div>
  )
}
