'use client'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

const PRESET_COLORS = [
  '#e34432',
  '#246fe0',
  '#058527',
  '#e57f1e',
  '#7c3aed',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f59e0b',
  '#6b7280',
  '#25221e',
  '#b91c1c',
]

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-sm font-medium text-todoist-charcoal">{label}</span>
      )}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-7 h-7 rounded-full transition-all flex items-center justify-center"
            style={{
              backgroundColor: color,
              outline: value === color ? '2px solid #e34432' : '2px solid transparent',
              outlineOffset: '2px',
            }}
            aria-label={color}
            title={color}
          >
            {value === color && (
              <svg className="w-3.5 h-3.5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
