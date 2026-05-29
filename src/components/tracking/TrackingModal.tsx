'use client'

import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'
import { BottomSheet, Button } from '@/components/ui'
import { HabitIcon } from '@/components/habits/HabitIcon'
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
  streak?: number
}

export function TrackingModal({
  habit,
  open,
  onClose,
  onSave,
  existingValue,
  existingNotes,
  streak = 0,
}: TrackingModalProps) {
  const [value, setValue] = useState<TrackingValue | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && habit) {
      setValue(existingValue ?? getDefaultValue(habit.metric_type))
      setNotes(existingNotes ?? '')
    }
  }, [open, habit, existingValue, existingNotes])

  const currentValue =
    value ?? (habit ? existingValue ?? getDefaultValue(habit.metric_type) : null)

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
  const accent = habit.color || '#e34432'

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Registrar"
      footer={
        <Button onClick={handleSave} loading={saving} fullWidth>
          Salvar
        </Button>
      }
    >
      {/* TrackHeader */}
      <div className="bg-peach rounded-[12px] p-3.5 flex items-center gap-3 mb-6">
        <div
          className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}25`, color: accent }}
        >
          <HabitIcon name={habit.icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-charcoal truncate">{habit.title}</p>
          {streak > 0 ? (
            <p className="text-xs text-link-orange flex items-center gap-1 mt-0.5">
              <Flame size={11} strokeWidth={2} /> {streak} dia{streak !== 1 ? 's' : ''} seguido{streak !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-xs text-subtle-ash mt-0.5">Vamos lá!</p>
          )}
        </div>
      </div>

      {existingValue && (
        <div className="text-xs bg-light-green-tint rounded-default px-3 py-2 mb-4">
          Atual:{' '}
          <span className="font-semibold text-badge-green">{formatValue(existingValue)}</span>
        </div>
      )}

      <div className="mb-5">{currentValue && renderInput(currentValue, setValue, habit)}</div>

      {habit.metric_type !== 'note' && (
        <div className="mb-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash mb-1.5">
            Notas (opcional)
          </label>
          <textarea
            className="w-full min-h-[64px] resize-none p-3 bg-paper border border-soft-gray rounded-default text-sm-2 text-charcoal placeholder:text-dusty-sage focus:outline-none focus:border-action-red focus:shadow-[0_0_0_3px_rgba(227,68,50,0.08)]"
            rows={2}
            placeholder="Adicione uma anotação…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      )}
    </BottomSheet>
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
