'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { useTrackingRange } from '@/hooks/useTrackingRange'
import { TrackingModal } from '@/components/tracking/TrackingModal'
import { HabitRow } from '@/components/habits/HabitRow'
import { IconButton, ScreenHeader, Toast } from '@/components/ui'
import { isCompleted, formatValue } from '@/lib/metrics'
import { calcStreak } from '@/lib/streak'
import { syncTodoistTask } from '@/lib/todoist-sync'
import type { Habit, TrackingValue } from '@/types'

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
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
  const { data: rangeEntries = [] } = useTrackingRange(30)

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
      groups.push({ id: '__none__', label: 'Sem área', color: '#94928f', habits: noArea })
    }
    return groups
  }, [activeHabits])

  const entryMap = useMemo(() => new Map(entries.map((e) => [e.habit_id, e])), [entries])
  const isLoading = habitsLoading || trackingLoading

  function getStreak(habitId: string) {
    return calcStreak(rangeEntries.filter((e) => e.habit_id === habitId))
  }

  async function handleSave(habitId: string, value: TrackingValue, notes?: string) {
    await track.mutateAsync({
      habit_id: habitId,
      tracked_date: selectedDate,
      value,
      notes: notes ?? null,
    })

    const habit = activeHabits.find((h) => h.id === habitId)
    if (habit?.todoist_sync_enabled && isCompleted(value)) {
      if (!habit.todoist_task_id) {
        setToast({
          message: 'Hábito vinculado ao Todoist mas sem ID. Desvincule e vincule novamente.',
          type: 'error',
        })
      } else {
        syncTodoistTask(habitId, 'complete').catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : 'Erro desconhecido'
          setToast({ message: `Todoist: ${msg}`, type: 'error' })
        })
      }
    }
  }

  const modalEntry = modalHabit ? entryMap.get(modalHabit.id) : undefined
  const completedCount = activeHabits.filter((h) => {
    const e = entryMap.get(h.id)
    return e && isCompleted(e.value)
  }).length
  const pct =
    activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto pb-24">
      <ScreenHeader
        title="Rastreamento"
        actions={
          <>
            <IconButton
              aria-label="Dia anterior"
              variant="muted"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            >
              <ChevronLeft size={18} />
            </IconButton>
            <button
              onClick={() => setSelectedDate(today)}
              className={`px-3 h-10 rounded-default text-sm font-semibold transition-colors ${
                selectedDate === today
                  ? 'bg-action-red text-white'
                  : 'bg-bg-muted text-charcoal hover:bg-bg-muted-strong'
              }`}
            >
              {formatDateLabel(selectedDate)}
            </button>
            <IconButton
              aria-label="Próximo dia"
              variant="muted"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              disabled={selectedDate >= today}
            >
              <ChevronRight size={18} />
            </IconButton>
          </>
        }
      />

      {!isLoading && activeHabits.length > 0 && (
        <div className="bg-peach rounded-[12px] px-4 py-3.5 flex items-center gap-4 mb-5">
          <div className="flex-1">
            <p className="text-sm text-subtle-ash">
              <span className="font-display text-base-2 font-bold text-charcoal">
                {completedCount}
              </span>{' '}
              de{' '}
              <span className="font-display text-base-2 font-bold text-charcoal">
                {activeHabits.length}
              </span>{' '}
              hábitos
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-bg-muted overflow-hidden">
              <div
                className="h-full bg-success-green rounded-full transition-[width] duration-250 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <p className="font-display text-xl font-bold text-charcoal">{pct}%</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-6 w-6 text-action-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      )}

      {!isLoading && activeHabits.length === 0 && (
        <div className="text-center py-12 px-6 border border-dashed border-soft-gray rounded-card">
          <p className="text-sm text-subtle-ash mb-3">Nenhum hábito ativo.</p>
          <a href="/habits" className="text-link-orange text-sm font-medium hover:underline">
            Criar hábitos →
          </a>
        </div>
      )}

      {!isLoading &&
        grouped.map((group) => (
          <section key={group.id} className="mb-6">
            {grouped.length > 1 && (
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash">
                  {group.label}
                </h2>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {group.habits.map((habit) => {
                const entry = entryMap.get(habit.id)
                const done = entry ? isCompleted(entry.value) : false
                return (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    done={done}
                    streak={getStreak(habit.id)}
                    subtitle={entry ? formatValue(entry.value) : undefined}
                    onClick={() => setModalHabit(habit)}
                    onCheck={() => setModalHabit(habit)}
                  />
                )
              })}
            </div>
          </section>
        ))}

      <TrackingModal
        habit={modalHabit}
        open={modalHabit !== null}
        onClose={() => setModalHabit(null)}
        onSave={handleSave}
        existingValue={modalEntry?.value}
        existingNotes={modalEntry?.notes ?? undefined}
        streak={modalHabit ? getStreak(modalHabit.id) : 0}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
