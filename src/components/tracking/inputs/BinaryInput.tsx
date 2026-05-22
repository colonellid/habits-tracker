'use client'

interface BinaryInputProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function BinaryInput({ value, onChange }: BinaryInputProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
        value
          ? 'bg-todoist-green text-white'
          : 'bg-todoist-gray-200 text-todoist-gray-600 hover:bg-todoist-gray-300'
      }`}
    >
      <span className="text-lg">{value ? '✅' : '⬜'}</span>
      {value ? 'Done' : 'Mark as done'}
    </button>
  )
}
