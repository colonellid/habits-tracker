'use client'

import { useMemo } from 'react'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { useTrackingRange } from '@/hooks/useTrackingRange'
import { useAuth } from '@/hooks/useAuth'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { TodayList } from '@/components/dashboard/TodayList'
import type { HabitWithTracking, DashboardStats, TrackingValue } from '@/types'
import { isCompleted } from '@/lib/metrics'
import { calcStreak, calcCompletionRate } from '@/lib/streak'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function currentMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export default function DashboardPage() {
  const { displayName } = useAuth()
  const today = todayString()

  const { data: habits = [], isLoading: habitsLoading } = useHabits()
  const { data: entries = [], track } = useTracking(today)
  // Fetch last 30 days for streak + week/month stats
  const { data: rangeEntries = [] } = useTrackingRange(30)

  const activeHabitIds = useMemo(
    () => habits.filter((h) => h.is_active).map((h) => h.id),
    [habits]
  )

  const habitsWithTracking = useMemo<HabitWithTracking[]>(() => {
    return habits
      .filter((h) => h.is_active)
      .map((habit) => {
        const todayEntry = entries.find((e) => e.habit_id === habit.id)
        return { ...habit, todayEntry, streakDays: 0, completionRate7d: 0 }
      })
  }, [habits, entries])

  const stats = useMemo<DashboardStats>(() => {
    const total = habitsWithTracking.length
    const completed = habitsWithTracking.filter(
      (h) => h.todayEntry && isCompleted(h.todayEntry.value)
    ).length

    const streakDays = calcStreak(rangeEntries)
    const weekCompletion = calcCompletionRate(rangeEntries, activeHabitIds, 7)

    // Month completion: days elapsed so far this month
    const now = new Date()
    const dayOfMonth = now.getDate()
    const monthStart = currentMonthStart()
    const monthEntries = rangeEntries.filter((e) => e.tracked_date >= monthStart)
    const monthCompletion = calcCompletionRate(monthEntries, activeHabitIds, dayOfMonth)

    return { todayTotal: total, todayCompleted: completed, streakDays, weekCompletion, monthCompletion }
  }, [habitsWithTracking, rangeEntries, activeHabitIds])

  async function handleTrack(habitId: string, value: TrackingValue, notes?: string) {
    await track.mutateAsync({ habit_id: habitId, tracked_date: today, value, notes: notes ?? null })
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-todoist-charcoal">
          {greeting}, {displayName.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-todoist-gray-500 mt-0.5">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
        </p>
      </div>

      <div className="mb-5">
        <StatsRow stats={stats} />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-todoist-charcoal">Hábitos de hoje</h2>
        <a href="/habits" className="text-xs text-todoist-red hover:underline">Gerenciar</a>
      </div>

      <TodayList habits={habitsWithTracking} onTrack={handleTrack} loading={habitsLoading} />
    </main>
  )
}
