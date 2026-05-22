'use client'

import { useState, useEffect } from 'react'
import { Modal, Button } from '@/components/ui'
import type { Habit, TrackingValue } from '@/types'
import { getDefaultValue, formatValue } from '@/lib/metrics'
import { BinaryInput } from './inputs/BinaryInput'
import { QuantityInput } from './inputs/QuantityInput'
import { DurationInput } from './inputs/DurationInput'
import { RatingInput } from './inputs/RatingInput'
import { ChecklistInput } from './inputs/ChecklistInput'
import { NoteInput } from './inputs/NoteInput'

interface TrackingModalProps {
  habit: Habit | null
  open: boolean
  onClose: () => void
  onSave: (habitId: string, value: TrackingValue, notes?: string) => Promise<void>
  existingValue?: TrackingValue
  existingNotes?: string
}

export function TrackingModal({ habit, open, onClose, onSave, existingValue, existingNotes }: TrackingModalProps) {
  const [value, setValue] = useState<TrackingValue | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Reset state when habit or open changes
  useEffect(() => {
    if (open && habit) {
      setValue(existingValue ?? getDefaultValue(habit.metric_type))
      setNotes(existingNotes ?? '')
    }
  }, [open, habit, existingValue, existingNotes])

  const currentValue = value ?? (habit ? existingValue ?? getDefaultValue(habit.metric_type) : null)

  async function handleSave() {
    if (!habit || !currentValue) return
    setSaving(true)
    try {
      await onSave(habit.id, currentValue, notes || undefined)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (!habit) return null

  return (
    <Modal open={open} onClose={onClose} title={`Registrar: ${habit.title}`}>
      <div className="flex flex-col gap-4">
        {existingValue && (
          <div className="text-xs text-todoist-gray-500 bg-todoist-green-light rounded-lg px-3 py-2">
            Valor atual: <span className="font-semibold text-todoist-green">{formatValue(existingValue)}</span>
          </div>
        )}

        <div className="py-1">
          {currentValue && renderInput(currentValue, setValue, habit)}
        </div>

        {/* Notes — hidden for 'note' type since it's the main input */}
        {habit.metric_type !== 'note' && (
          <div>
            <label className="block text-sm font-medium text-todoist-charcoal mb-1">
              Notas (opcional)
            </label>
            <textarea
              className="input-field resize-none w-full"
              rows={2}
              placeholder="Adicione uma anotação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="tertiary" onClick={onClose}>Cancelar</Button>
          <Button loading={saving} onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </Modal>
  )
}

function renderInput(
  value: TrackingValue,
  setValue: (v: TrackingValue) => void,
  habit: Habit
): React.ReactNode {
  switch (value.type) {
    case 'binary':
      return (
        <BinaryInput
          value={value.completed}
          onChange={(completed) => setValue({ type: 'binary', completed })}
        />
      )

    case 'quantity': {
      const config = habit.metric_config as { unit?: string; step?: number; min?: number; max?: number }
      return (
        <QuantityInput
          value={value.amount}
          onChange={(amount) => setValue({ ...value, amount })}
          unit={config.unit}
          step={config.step}
          min={config.min}
          max={config.max}
        />
      )
    }

    case 'duration':
      return (
        <DurationInput
          value={value.minutes}
          onChange={(minutes) => setValue({ type: 'duration', minutes })}
        />
      )

    case 'rating': {
      const config = habit.metric_config as { max?: number }
      const max = config.max ?? value.max ?? 5
      return (
        <RatingInput
          value={value.score}
          onChange={(score) => setValue({ type: 'rating', score, max })}
          max={max}
        />
      )
    }

    case 'checklist':
      return (
        <ChecklistInput
          value={value.items}
          onChange={(items) => setValue({ type: 'checklist', items })}
        />
      )

    case 'note':
      return (
        <NoteInput
          value={value.text}
          onChange={(text) => setValue({ type: 'note', text })}
        />
      )
  }
}
