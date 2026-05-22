'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { TrackingEntry } from '@/types'
import { isCompleted } from '@/lib/metrics'

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateString(d)
}

async function fetchInsightEntries(habitId: string): Promise<TrackingEntry[]> {
  const today = toDateString(new Date())
  const from = addDays(today, -89) // 90 days inclusive

  const { data, error } = await supabase
    .from('tracking_entries')
    .select('*')
    .eq('habit_id', habitId)
    .gte('tracked_date', from)
    .lte('tracked_date', today)
    .order('tracked_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export interface InsightsData {
  entries: TrackingEntry[]
  completionRate7d: number
  completionRate30d: number
  streakDays: number
  totalDays: number
}

export function useInsights(habitId: string | null) {
  return useQuery<InsightsData>({
    queryKey: ['insights', habitId],
    enabled: !!habitId,
    queryFn: async () => {
      if (!habitId) throw new Error('No habit selected')
      const entries = await fetchInsightEntries(habitId)

      const today = toDateString(new Date())
      const completedDates = new Set(
        entries.filter((e) => isCompleted(e.value)).map((e) => e.tracked_date)
      )

      function rateForDays(days: number): number {
        let count = 0
        let done = 0
        for (let i = 0; i < days; i++) {
          const d = addDays(today, -i)
          count++
          if (completedDates.has(d)) done++
        }
        return count > 0 ? Math.round((done / count) * 100) : 0
      }

      // Current streak: consecutive days ending today (backwards)
      let streakDays = 0
      let cursor = today
      while (completedDates.has(cursor)) {
        streakDays++
        cursor = addDays(cursor, -1)
      }

      return {
        entries,
        completionRate7d: rateForDays(7),
        completionRate30d: rateForDays(30),
        streakDays,
        totalDays: completedDates.size,
      }
    },
  })
}

// Fetch tracking for ALL habits over the last 7 days (for the bar chart)
async function fetchWeekEntries(): Promise<TrackingEntry[]> {
  const today = toDateString(new Date())
  const from = addDays(today, -6)

  const { data, error } = await supabase
    .from('tracking_entries')
    .select('*')
    .gte('tracked_date', from)
    .lte('tracked_date', today)

  if (error) throw new Error(error.message)
  return data
}

export interface DailyCompletionPoint {
  date: string
  label: string
  completed: number
  total: number
  pct: number
}

export function useWeekCompletion(totalHabits: number) {
  return useQuery<DailyCompletionPoint[]>({
    queryKey: ['week-completion'],
    queryFn: async () => {
      const entries = await fetchWeekEntries()
      const today = toDateString(new Date())

      const byDate = new Map<string, TrackingEntry[]>()
      for (const e of entries) {
        if (!byDate.has(e.tracked_date)) byDate.set(e.tracked_date, [])
        byDate.get(e.tracked_date)!.push(e)
      }

      const points: DailyCompletionPoint[] = []
      for (let i = 6; i >= 0; i--) {
        const dateStr = addDays(today, -i)
        const d = new Date(dateStr + 'T00:00:00')
        const label = d.toLocaleDateString('pt-BR', { weekday: 'short' })
        const dayEntries = byDate.get(dateStr) ?? []
        const completed = dayEntries.filter((e) => isCompleted(e.value)).length
        const pct = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0
        points.push({ date: dateStr, label, completed, total: totalHabits, pct })
      }
      return points
    },
    enabled: totalHabits > 0,
  })
}
