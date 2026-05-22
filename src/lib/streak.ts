import type { TrackingEntry } from '@/types'
import { isCompleted } from '@/lib/metrics'

/**
 * Given an array of tracking entries, calculates the current streak in days.
 * A "streak day" is any calendar date that has at least one completed entry.
 * The streak counts consecutive days going back from today (or yesterday if
 * today has no completed entry yet).
 */
export function calcStreak(entries: TrackingEntry[]): number {
  if (entries.length === 0) return 0

  // Build a Set of dates that have at least one completed entry
  const completedDates = new Set<string>()
  for (const entry of entries) {
    if (isCompleted(entry.value)) {
      completedDates.add(entry.tracked_date)
    }
  }
  if (completedDates.size === 0) return 0

  const today = new Date().toISOString().slice(0, 10)

  // Start from today; if today is not completed, start from yesterday
  function dateMinus(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00')
    d.setDate(d.getDate() - days)
    return d.toISOString().slice(0, 10)
  }

  let cursor = completedDates.has(today) ? today : dateMinus(today, 1)

  // If neither today nor yesterday has a completed entry, streak is 0
  if (!completedDates.has(cursor)) return 0

  let streak = 0
  while (completedDates.has(cursor)) {
    streak++
    cursor = dateMinus(cursor, 1)
  }
  return streak
}

/**
 * Given an array of tracking entries and a set of active habit ids,
 * calculates the completion percentage for the last N days.
 */
export function calcCompletionRate(
  entries: TrackingEntry[],
  habitIds: string[],
  days: number
): number {
  if (habitIds.length === 0 || days === 0) return 0

  const today = new Date()
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  let possible = 0
  let completed = 0

  for (const date of dates) {
    for (const habitId of habitIds) {
      possible++
      const entry = entries.find((e) => e.habit_id === habitId && e.tracked_date === date)
      if (entry && isCompleted(entry.value)) completed++
    }
  }

  if (possible === 0) return 0
  return Math.round((completed / possible) * 100)
}
