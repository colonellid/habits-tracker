'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  'aria-label'?: string
  id?: string
}

export function Toggle({ checked, onChange, disabled, size = 'md', id, ...rest }: ToggleProps) {
  const sm = size === 'sm'
  const width = sm ? 28 : 40
  const height = sm ? 16 : 24
  const knob = sm ? 12 : 20
  const padding = 2
  const translate = width - knob - padding * 2

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={rest['aria-label']}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 rounded-full transition-colors duration-200 ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-action-red focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-action-red' : 'bg-soft-gray'
      }`}
      style={{ width, height }}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-smooth"
        style={{
          width: knob,
          height: knob,
          left: padding,
          transform: `translateY(-50%) translateX(${checked ? translate : 0}px)`,
        }}
      />
    </button>
  )
}
