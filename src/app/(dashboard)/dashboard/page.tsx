'use client'

import { useMemo } from 'react'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { useAuth } from '@/hooks/useAuth'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { TodayList } from '@/components/dashboard/TodayList'
import type { HabitWithTracking, DashboardStats, TrackingValue } from '@/types'
import { isCompleted } from '@/lib/metrics'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export default function DashboardPage() {
  const { displayName } = useAuth()
  const today = todayString()

  const { data: habits = [], isLoading: habitsLoading } = useHabits()
  const { data: entries = [], track } = useTracking(today)

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
    return { todayTotal: total, todayCompleted: completed, streakDays: 0, weekCompletion: 0, monthCompletion: 0 }
  }, [habitsWithTracking])

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
