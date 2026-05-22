'use client'

import { useState } from 'react'

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
    const updated = value.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    )
    onChange(updated)
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addItem()
  }

  const doneCount = value.filter((i) => i.checked).length

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <p className="text-xs text-todoist-gray-500">
          {doneCount}/{value.length} concluídos
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-todoist-gray-100 group">
            <button
              onClick={() => toggleItem(i)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                item.checked
                  ? 'bg-todoist-green border-todoist-green text-white'
                  : 'border-todoist-gray-400 hover:border-todoist-green'
              }`}
            >
              {item.checked && (
                <svg viewBox="0 0 10 8" className="w-3 h-3 fill-current">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${item.checked ? 'line-through text-todoist-gray-400' : 'text-todoist-charcoal'}`}>
              {item.label}
            </span>
            <button
              onClick={() => removeItem(i)}
              className="opacity-0 group-hover:opacity-100 text-todoist-gray-400 hover:text-todoist-red transition-all text-xs px-1"
              aria-label="Remover item"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Novo item..."
          className="input-field flex-1 text-sm"
        />
        <button
          onClick={addItem}
          disabled={!newLabel.trim()}
          className="btn-primary text-sm px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}
