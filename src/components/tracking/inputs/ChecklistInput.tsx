'use client'

import { useState } from 'react'
import { Check, X, Plus } from 'lucide-react'

interface ChecklistItem {
  label: string
  checked: boolean
}

interface ChecklistInputProps {
  value: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
}

export function ChecklistInput({ value, onChange }: ChecklistInputProps) {
  const [newLabel, setNewLabel] = useState('')

  function toggleItem(index: number) {
    onChange(value.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)))
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function addItem() {
    const trimmed = newLabel.trim()
    if (!trimmed) return
    onChange([...value, { label: trimmed, checked: false }])
    setNewLabel('')
  }

  const doneCount = value.filter((i) => i.checked).length
  const allDone = value.length > 0 && doneCount === value.length

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle-ash">
          Progresso: {doneCount} de {value.length}
        </p>
      )}

      <ul
        className={`flex flex-col gap-1.5 rounded-card p-1 transition-colors ${
          allDone ? 'bg-light-green-tint border border-success-green' : ''
        }`}
      >
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-3 p-2 rounded-default group">
            <button
              type="button"
              onClick={() => toggleItem(i)}
              className={`shrink-0 w-[22px] h-[22px] rounded border-2 flex items-center justify-center transition-colors ${
                item.checked
                  ? 'bg-success-green border-success-green text-white'
                  : 'border-soft-gray hover:border-charcoal'
              }`}
              aria-label={item.checked ? 'Desmarcar' : 'Marcar'}
            >
              {item.checked && <Check size={14} strokeWidth={3} />}
            </button>
            <span
              className={`flex-1 text-sm-2 ${
                item.checked ? 'line-through text-dusty-sage' : 'text-charcoal'
              }`}
            >
              {item.label}
            </span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="opacity-0 group-hover:opacity-100 text-dusty-sage hover:text-action-red transition-all"
              aria-label="Remover"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addItem()
            }
          }}
          placeholder="Novo item…"
          className="flex-1 h-10 px-3 bg-paper border border-soft-gray rounded-default text-sm-2 text-charcoal placeholder:text-dusty-sage focus:outline-none focus:border-action-red focus:shadow-[0_0_0_3px_rgba(227,68,50,0.08)]"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!newLabel.trim()}
          className="px-3 h-10 rounded-default bg-action-red text-white hover:bg-cta-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 text-sm-2 font-semibold"
        >
          <Plus size={14} strokeWidth={2.5} />
          Adicionar
        </button>
      </div>
    </div>
  )
}
