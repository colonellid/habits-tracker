'use client'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  unit?: string
  step?: number
  min?: number
  max?: number
}

export function QuantityInput({ value, onChange, unit = '', step = 1, min = 0, max }: QuantityInputProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-10 h-10 rounded-full bg-todoist-gray-200 text-todoist-charcoal font-bold text-xl hover:bg-todoist-gray-300 transition-colors"
      >
        −
      </button>
      <div className="flex-1 text-center">
        <span className="text-3xl font-bold text-todoist-charcoal">{value}</span>
        {unit && <span className="text-sm text-todoist-gray-500 ml-1">{unit}</span>}
      </div>
      <button
        onClick={() => onChange(max !== undefined ? Math.min(max, value + step) : value + step)}
        className="w-10 h-10 rounded-full bg-todoist-red text-white font-bold text-xl hover:bg-todoist-red-dark transition-colors"
      >
        +
      </button>
    </div>
  )
}
