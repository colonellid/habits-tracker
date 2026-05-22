'use client'

import type { TrackingEntry } from '@/types'
import { isCompleted } from '@/lib/metrics'

interface HeatmapChartProps {
  entries: TrackingEntry[]
  weeks?: number
}

function getDateGrid(weeks: number) {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(today.getDate() - weeks * 7 + 1)

  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  return days
}

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function HeatmapChart({ entries, weeks = 12 }: HeatmapChartProps) {
  const days = getDateGrid(weeks)
  const completedSet = new Set(
    entries.filter((e) => isCompleted(e.value)).map((e) => e.tracked_date)
  )

  const columns: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7))
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-1">
        {columns.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => {
              const key = toKey(day)
              const done = completedSet.has(key)
              return (
                <div
                  key={key}
                  title={key}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    done ? 'bg-todoist-green' : 'bg-todoist-gray-200'
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
