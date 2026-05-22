'use client'

import { useState } from 'react'
import { HabitCard } from '@/components/habits/HabitCard'
import { TrackingModal } from '@/components/tracking/TrackingModal'
import type { HabitWithTracking, Habit, TrackingValue } from '@/types'

interface TodayListProps {
  habits: HabitWithTracking[]
  onTrack: (habitId: string, value: TrackingValue, notes?: string) => Promise<void>
  loading?: boolean
}

export function TodayList({ habits, onTrack, loading }: TodayListProps) {
  const [selected, setSelected] = useState<Habit | null>(null)

  const pending = habits.filter((h) => !h.todayEntry)
  const done = habits.filter((h) => !!h.todayEntry)

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse h-16 bg-todoist-gray-100" />
        ))}
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-2xl mb-2">🌱</p>
        <p className="text-sm font-medium text-todoist-charcoal">Nenhum hábito cadastrado</p>
        <p className="text-xs text-todoist-gray-500 mt-1">
          Vá em <strong>Habits</strong> para criar seu primeiro hábito.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {pending.length > 0 && (
          <>
            <p className="text-xs font-semibold text-todoist-gray-500 uppercase tracking-wide px-1">
              Pendentes ({pending.length})
            </p>
            {pending.map((h) => (
              <HabitCard key={h.id} habit={h} onTrack={() => setSelected(h)} />
            ))}
          </>
        )}

        {done.length > 0 && (
          <>
            <p className="text-xs font-semibold text-todoist-gray-500 uppercase tracking-wide px-1 mt-3">
              Concluídos ({done.length})
            </p>
            {done.map((h) => (
              <HabitCard key={h.id} habit={h} onTrack={() => setSelected(h)} />
            ))}
          </>
        )}
      </div>

      <TrackingModal
        habit={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSave={onTrack}
        existingValue={selected ? habits.find((h) => h.id === selected.id)?.todayEntry?.value : undefined}
      />
    </>
  )
}
