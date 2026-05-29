'use client'

import { Check, X } from 'lucide-react'

interface BinaryInputProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function BinaryInput({ value, onChange }: BinaryInputProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex flex-col items-center justify-center gap-2 py-5 rounded-[12px] text-sm font-semibold transition-all duration-150 border ${
          value
            ? 'bg-light-green-tint border-success-green text-badge-green'
            : 'bg-paper border-soft-gray text-charcoal hover:border-charcoal'
        }`}
      >
        <Check size={22} strokeWidth={value ? 2.5 : 1.75} />
        Concluído
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex flex-col items-center justify-center gap-2 py-5 rounded-[12px] text-sm font-semibold transition-all duration-150 border ${
          value === false
            ? 'bg-bg-muted border-subtle-ash text-charcoal'
            : 'bg-paper border-soft-gray text-subtle-ash hover:border-charcoal'
        }`}
      >
        <X size={22} strokeWidth={value === false ? 2.5 : 1.75} />
        Pular
      </button>
    </div>
  )
}
