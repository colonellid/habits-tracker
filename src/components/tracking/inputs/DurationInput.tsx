'use client'

interface DurationInputProps {
  value: number // total minutes
  onChange: (minutes: number) => void
}

export function DurationInput({ value, onChange }: DurationInputProps) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60

  function setHours(h: number) {
    const clamped = Math.max(0, Math.min(23, h))
    onChange(clamped * 60 + minutes)
  }

  function setMinutes(m: number) {
    const clamped = Math.max(0, Math.min(59, m))
    onChange(hours * 60 + clamped)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-6">
        {/* Hours */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setHours(hours + 1)}
            className="w-9 h-9 rounded-full bg-todoist-gray-200 text-todoist-charcoal font-bold text-lg hover:bg-todoist-gray-300 transition-colors"
          >
            +
          </button>
          <div className="text-center">
            <span className="text-3xl font-bold text-todoist-charcoal w-16 inline-block text-center">
              {String(hours).padStart(2, '0')}
            </span>
            <p className="text-xs text-todoist-gray-500 mt-0.5">horas</p>
          </div>
          <button
            onClick={() => setHours(hours - 1)}
            className="w-9 h-9 rounded-full bg-todoist-gray-200 text-todoist-charcoal font-bold text-lg hover:bg-todoist-gray-300 transition-colors"
          >
            −
          </button>
        </div>

        <span className="text-3xl font-bold text-todoist-gray-400 mb-4">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setMinutes(minutes + 1)}
            className="w-9 h-9 rounded-full bg-todoist-gray-200 text-todoist-charcoal font-bold text-lg hover:bg-todoist-gray-300 transition-colors"
          >
            +
          </button>
          <div className="text-center">
            <span className="text-3xl font-bold text-todoist-charcoal w-16 inline-block text-center">
              {String(minutes).padStart(2, '0')}
            </span>
            <p className="text-xs text-todoist-gray-500 mt-0.5">minutos</p>
          </div>
          <button
            onClick={() => setMinutes(minutes - 1)}
            className="w-9 h-9 rounded-full bg-todoist-gray-200 text-todoist-charcoal font-bold text-lg hover:bg-todoist-gray-300 transition-colors"
          >
            −
          </button>
        </div>
      </div>

      {value > 0 && (
        <p className="text-center text-sm text-todoist-gray-500">
          Total:{' '}
          <span className="font-semibold text-todoist-charcoal">
            {hours > 0 ? `${hours}h ` : ''}
            {minutes > 0 ? `${minutes}m` : hours === 0 ? '0m' : ''}
          </span>
        </p>
      )}
    </div>
  )
}
