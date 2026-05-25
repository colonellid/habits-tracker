'use client'

import { useMemo, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { useTrackingRange } from '@/hooks/useTrackingRange'
import { useAuth } from '@/hooks/useAuth'
import { IconButton, FAB } from '@/components/ui'
import { WeekStrip } from '@/components/dashboard/WeekStrip'
import { DailyProgress } from '@/components/dashboard/DailyProgress'
import { HabitRow } from '@/components/habits/HabitRow'
import { TrackingModal } from '@/components/tracking/TrackingModal'
import { isCompleted, formatValue } from '@/lib/metrics'
import { calcStreak } from '@/lib/streak'
import type { Habit, TrackingValue } from '@/types'

function toDateString(d: Date) {
  return d.toISOString().slice(0, 10)
}

const MONTH_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const WEEKDAY_PT = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

function formatEyebrow(dateStr: string) {
  const today = toDateString(new Date())
  const d = new Date(dateStr + 'T00:00:00')
  const isToday = dateStr === today
  return `${isToday ? 'Hoje' : WEEKDAY_PT[d.getDay()]}, ${d.getDate()} ${MONTH_PT[d.getMonth()]}`
}

export default function DashboardPage() {
  const { displayName } = useAuth()
  const router = useRouter()
  const todayStr = toDateString(new Date())
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [modalHabit, setModalHabit] = useState<Habit | null>(null)

  const { data: habits = [] } = useHabits()
  const { data: entries = [], track } = useTracking(selectedDate)
  const { data: rangeEntries = [] } = useTrackingRange(30)

  const activeHabits = useMemo(() => habits.filter((h) => h.is_active), [habits])

  const habitState = useMemo(() => {
    return activeHabits.map((habit) => {
      const todayEntry = entries.find((e) => e.habit_id === habit.id)
      const done = !!todayEntry && isCompleted(todayEntry.value)
      const habitEntries = rangeEntries.filter((e) => e.habit_id === habit.id)
      const streak = calcStreak(habitEntries)
      const miniGrid: boolean[] = Array.from({ length: 30 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (29 - i))
        const ds = toDateString(d)
        const e = habitEntries.find((x) => x.tracked_date === ds)
        return !!e && isCompleted(e.value)
      })
      const subtitle = todayEntry ? formatValue(todayEntry.value) : undefined
      return { habit, done, streak, miniGrid, subtitle }
    })
  }, [activeHabits, entries, rangeEntries])

  const pending = habitState.filter((h) => !h.done)
  const done = habitState.filter((h) => h.done)

  async function handleQuickCheck(habit: Habit) {
    if (habit.metric_type === 'binary') {
      const value: TrackingValue = { type: 'binary', completed: true }
      await track.mutateAsync({
        habit_id: habit.id,
        tracked_date: selectedDate,
        value,
        notes: null,
      })
    } else {
      setModalHabit(habit)
    }
  }

  async function handleSave(habitId: string, value: TrackingValue, notes?: string) {
    await track.mutateAsync({
      habit_id: habitId,
      tracked_date: selectedDate,
      value,
      notes: notes ?? null,
    })
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = displayName.split(' ')[0]

  const modalEntry = modalHabit
    ? entries.find((e) => e.habit_id === modalHabit.id)
    : undefined

  return (
    <main className="p-3 md:p-6 max-w-2xl mx-auto pb-28">
      <header className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-subtle-ash mb-0.5">{formatEyebrow(selectedDate)}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal tracking-[-0.005em] truncate">
            {greeting}, {firstName}.
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <IconButton aria-label="Notificações" variant="muted">
            <Bell size={18} />
          </IconButton>
          <IconButton aria-label="Buscar" variant="muted">
            <Search size={18} />
          </IconButton>
        </div>
      </header>

      <WeekStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

      <DailyProgress done={done.length} total={habitState.length} />

      {pending.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-2">
            Pendentes · {pending.length}
          </h2>
          <div className="flex flex-col gap-2">
            {pending.map(({ habit, done, streak, miniGrid, subtitle }) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                done={done}
                streak={streak}
                miniGridData={miniGrid}
                subtitle={subtitle}
                onClick={() => setModalHabit(habit)}
                onCheck={() => handleQuickCheck(habit)}
              />
            ))}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-2">
            Concluídos · {done.length}
          </h2>
          <div className="flex flex-col gap-2">
            {done.map(({ habit, done, streak, miniGrid, subtitle }) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                done={done}
                streak={streak}
                miniGridData={miniGrid}
                subtitle={subtitle}
                onClick={() => setModalHabit(habit)}
                onCheck={() => handleQuickCheck(habit)}
              />
            ))}
          </div>
        </section>
      )}

      {habitState.length === 0 && (
        <div className="text-center py-12 px-6 border border-dashed border-soft-gray rounded-card">
          <p className="text-sm text-subtle-ash mb-3">Nenhum hábito ativo ainda.</p>
          <a href="/habits" className="text-link-orange text-sm font-medium hover:underline">
            Criar primeiro hábito →
          </a>
        </div>
      )}

      <FAB aria-label="Novo hábito" onClick={() => router.push('/habits')} />

      <TrackingModal
        habit={modalHabit}
        open={modalHabit !== null}
        onClose={() => setModalHabit(null)}
        onSave={handleSave}
        existingValue={modalEntry?.value}
        existingNotes={modalEntry?.notes ?? undefined}
      />
    </main>
  )
}
