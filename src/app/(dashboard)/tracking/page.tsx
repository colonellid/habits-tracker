'use client'

import { useState, useMemo } from 'react'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { TrackingModal } from '@/components/tracking/TrackingModal'
import { Toast } from '@/components/ui'
import { isCompleted, formatValue } from '@/lib/metrics'
import { syncTodoistTask } from '@/lib/todoist-sync'
import type { Habit, TrackingValue } from '@/types'

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return toDateString(d)
}

function formatDateLabel(dateStr: string): string {
  const today = toDateString(new Date())
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)

  if (dateStr === today) return 'Hoje'
  if (dateStr === yesterday) return 'Ontem'
  if (dateStr === tomorrow) return 'Amanhã'

  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function TrackingPage() {
  const today = toDateString(new Date())
  const [selectedDate, setSelectedDate] = useState(today)
  const [modalHabit, setModalHabit] = useState<Habit | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: habits = [], isLoading: habitsLoading } = useHabits()
  const { data: entries = [], isLoading: trackingLoading, track } = useTracking(selectedDate)

  const activeHabits = useMemo(() => habits.filter((h) => h.is_active), [habits])

  const grouped = useMemo(() => {
    const withArea: Map<string, { areaName: string; areaColor: string; habits: Habit[] }> = new Map()
    const noArea: Habit[] = []

    for (const habit of activeHabits) {
      if (habit.area) {
        const key = habit.area.id
        if (!withArea.has(key)) {
          withArea.set(key, { areaName: habit.area.name, areaColor: habit.area.color, habits: [] })
        }
        withArea.get(key)!.habits.push(habit)
      } else {
        noArea.push(habit)
      }
    }

    const groups: { id: string; label: string; color: string; habits: Habit[] }[] = []
    withArea.forEach((group, id) => {
      groups.push({ id, label: group.areaName, color: group.areaColor, habits: group.habits })
    })
    if (noArea.length > 0) {
      groups.push({ id: '__none__', label: 'Sem área', color: '#8a837a', habits: noArea })
    }
    return groups
  }, [activeHabits])

  const entryMap = useMemo(() => {
    return new Map(entries.map((e) => [e.habit_id, e]))
  }, [entries])

  const isLoading = habitsLoading || trackingLoading

  async function handleSave(habitId: string, value: TrackingValue, notes?: string) {
    await track.mutateAsync({
      habit_id: habitId,
      tracked_date: selectedDate,
      value,
      notes: notes ?? null,
    })

    // Sync with Todoist if habit has sync enabled and value is completed
    const habit = activeHabits.find((h) => h.id === habitId)
    if (habit?.todoist_sync_enabled && habit?.todoist_task_id && isCompleted(value)) {
      syncTodoistTask(habitId, 'complete').catch(() => {
        // fire-and-forget: Todoist errors don't block the UI
      })
    }
  }

  const modalEntry = modalHabit ? entryMap.get(modalHabit.id) : undefined
  const completedCount = activeHabits.filter((h) => {
    const e = entryMap.get(h.id)
    return e && isCompleted(e.value)
  }).length

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Date Selector */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold text-todoist-charcoal">Rastreamento</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            className="w-8 h-8 rounded-full bg-todoist-gray-200 text-todoist-charcoal hover:bg-todoist-gray-300 transition-colors flex items-center justify-center text-sm font-bold"
            aria-label="Dia anterior"
          >
            ‹
          </button>
          <button
            onClick={() => setSelectedDate(today)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedDate === today
                ? 'bg-todoist-red text-white'
                : 'bg-todoist-gray-200 text-todoist-charcoal hover:bg-todoist-gray-300'
            }`}
          >
            {formatDateLabel(selectedDate)}
          </button>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            disabled={selectedDate >= today}
            className="w-8 h-8 rounded-full bg-todoist-gray-200 text-todoist-charcoal hover:bg-todoist-gray-300 transition-colors flex items-center justify-center text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Próximo dia"
          >
            ›
          </button>
        </div>
      </div>

      {/* Progress summary */}
      {!isLoading && activeHabits.length > 0 && (
        <div className="card mb-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-todoist-gray-500">
              <span className="font-semibold text-todoist-charcoal">{completedCount}</span>
              {' '}de{' '}
              <span className="font-semibold text-todoist-charcoal">{activeHabits.length}</span>
              {' '}hábitos concluídos
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-todoist-gray-200 overflow-hidden">
              <div
                className="h-full bg-todoist-green rounded-full transition-all"
                style={{ width: activeHabits.length > 0 ? `${(completedCount / activeHabits.length) * 100}%` : '0%' }}
              />
            </div>
          </div>
          {completedCount === activeHabits.length && activeHabits.length > 0 && (
            <span className="text-2xl">🎉</span>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-6 w-6 text-todoist-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      )}

      {!isLoading && activeHabits.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-todoist-gray-500 text-sm">Nenhum hábito ativo.</p>
          <a href="/habits" className="text-todoist-red text-sm hover:underline mt-2 inline-block">
            Criar hábitos
          </a>
        </div>
      )}

      {/* Habit groups */}
      {!isLoading && grouped.map((group) => (
        <div key={group.id} className="mb-5">
          {grouped.length > 1 && (
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: group.color }}
              />
              <h2 className="text-xs font-semibold text-todoist-gray-600 uppercase tracking-wide">
                {group.label}
              </h2>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {group.habits.map((habit) => {
              const entry = entryMap.get(habit.id)
              const done = entry ? isCompleted(entry.value) : false
              return (
                <button
                  key={habit.id}
                  onClick={() => setModalHabit(habit)}
                  className="card flex items-center gap-3 text-left hover:shadow-lg transition-shadow w-full"
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      done
                        ? 'bg-todoist-green border-todoist-green'
                        : 'border-todoist-gray-400'
                    }`}
                  >
                    {done && (
                      <svg viewBox="0 0 10 8" className="w-3 h-3 fill-none stroke-white">
                        <path d="M1 4l3 3 5-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${done ? 'text-todoist-gray-400 line-through' : 'text-todoist-charcoal'}`}>
                      {habit.title}
                    </p>
                    {entry && (
                      <p className="text-xs text-todoist-gray-500 mt-0.5 truncate">
                        {formatValue(entry.value)}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {habit.todoist_sync_enabled && (
                      <span
                        className="text-[9px] font-bold px-1 py-0.5 rounded bg-todoist-red text-white"
                        title="Sincronizado com Todoist"
                      >
                        T
                      </span>
                    )}
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-todoist-gray-400 text-xs">›</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <TrackingModal
        habit={modalHabit}
        open={modalHabit !== null}
        onClose={() => setModalHabit(null)}
        onSave={handleSave}
        existingValue={modalEntry?.value}
        existingNotes={modalEntry?.notes ?? undefined}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
