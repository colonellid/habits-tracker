'use client'

import { useState } from 'react'
import { Modal, Button } from '@/components/ui'
import type { Habit, TrackingValue } from '@/types'
import { getDefaultValue } from '@/lib/metrics'

interface TrackingModalProps {
  habit: Habit | null
  open: boolean
  onClose: () => void
  onSave: (habitId: string, value: TrackingValue, notes?: string) => Promise<void>
  existingValue?: TrackingValue
}

export function TrackingModal({ habit, open, onClose, onSave, existingValue }: TrackingModalProps) {
  const [value, setValue] = useState<TrackingValue | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

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
    <Modal open={open} onClose={onClose} title={`Track: ${habit.title}`}>
      <div className="flex flex-col gap-4">
        {/* Metric input rendered by type — Phase 4 will expand this */}
        <div className="p-3 bg-todoist-gray-100 rounded-lg text-sm text-todoist-gray-600">
          Metric type: <strong>{habit.metric_type}</strong>
          <br />
          Full input components coming in Phase 4.
        </div>
        <div>
          <label className="block text-sm font-medium text-todoist-charcoal mb-1">Notes (optional)</label>
          <textarea
            className="input-field resize-none"
            rows={2}
            placeholder="Add a note…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}
