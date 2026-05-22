'use client'

import { useState } from 'react'
import type { TrackingEntry } from '@/types'
import { isCompleted } from '@/lib/metrics'

interface HeatmapChartProps {
  entries: TrackingEntry[]
  weeks?: number
  habitTitle?: string
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

function formatTooltipDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function HeatmapChart({ entries, weeks = 12, habitTitle }: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<{ key: string; x: number; y: number } | null>(null)

  const days = getDateGrid(weeks)

  const completedSet = new Set(
    entries.filter((e) => isCompleted(e.value)).map((e) => e.tracked_date)
  )

  // Build streak map: for each date, how many consecutive days before (inclusive)
  const streakMap = new Map<string, number>()
  const sortedCompleted = Array.from(completedSet).sort()
  let streak = 0
  let prev: string | null = null
  for (const dateStr of sortedCompleted) {
    if (prev) {
      const prevDate = new Date(prev + 'T00:00:00')
      prevDate.setDate(prevDate.getDate() + 1)
      if (toKey(prevDate) === dateStr) {
        streak++
      } else {
        streak = 1
      }
    } else {
      streak = 1
    }
    streakMap.set(dateStr, streak)
    prev = dateStr
  }

  const columns: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7))
  }

  // Build month labels: find which column each month first appears in
  const monthLabels: { colIndex: number; label: string }[] = []
  let lastMonth = -1
  columns.forEach((week, wi) => {
    const firstDay = week[0]
    const month = firstDay.getMonth()
    if (month !== lastMonth) {
      monthLabels.push({
        colIndex: wi,
        label: firstDay.toLocaleDateString('pt-BR', { month: 'short' }),
      })
      lastMonth = month
    }
  })

  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  function getCellColor(dateStr: string) {
    if (!completedSet.has(dateStr)) return 'bg-todoist-gray-200'
    const streak = streakMap.get(dateStr) ?? 1
    return streak >= 3 ? 'bg-todoist-green' : 'bg-todoist-green-light border border-todoist-green'
  }

  return (
    <div className="flex flex-col gap-2">
      {habitTitle && (
        <h3 className="text-sm font-semibold text-todoist-charcoal">{habitTitle}</h3>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        <div className="relative">
          {/* Month labels row */}
          <div className="flex gap-1 mb-1 pl-5">
            {columns.map((_, wi) => {
              const label = monthLabels.find((m) => m.colIndex === wi)
              return (
                <div key={wi} className="w-3 flex-shrink-0">
                  {label && (
                    <span className="text-[9px] text-todoist-gray-500 leading-none capitalize">
                      {label.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid with day-of-week labels */}
          <div className="flex gap-1">
            {/* Day labels column */}
            <div className="flex flex-col gap-1 mr-0.5">
              {dayLabels.map((label, i) => (
                <div key={i} className="w-4 h-3 flex items-center justify-center">
                  {(i === 1 || i === 3 || i === 5) && (
                    <span className="text-[9px] text-todoist-gray-400">{label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Columns */}
            {columns.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => {
                  const key = toKey(day)
                  const done = completedSet.has(key)
                  const streakVal = streakMap.get(key) ?? 0
                  return (
                    <div
                      key={key}
                      onMouseEnter={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect()
                        setTooltip({ key, x: rect.left, y: rect.top })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className={`w-3 h-3 rounded-sm transition-colors cursor-pointer ${getCellColor(key)}`}
                      aria-label={`${key}: ${done ? `concluído (streak: ${streakVal})` : 'pendente'}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline tooltip (positioned via fixed) */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-todoist-charcoal text-white text-xs rounded px-2 py-1 shadow-lg"
          style={{ left: tooltip.x + 8, top: tooltip.y - 32 }}
        >
          {formatTooltipDate(tooltip.key)}
          {' — '}
          {completedSet.has(tooltip.key) ? (
            <span className="text-green-300">
              Feito
              {(streakMap.get(tooltip.key) ?? 0) >= 2 && ` (${streakMap.get(tooltip.key)}d streak)`}
            </span>
          ) : (
            <span className="text-todoist-gray-400">Pendente</span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-todoist-gray-500 mt-1">
        <span>Menos</span>
        <div className="w-3 h-3 rounded-sm bg-todoist-gray-200" />
        <div className="w-3 h-3 rounded-sm bg-todoist-green-light border border-todoist-green" />
        <div className="w-3 h-3 rounded-sm bg-todoist-green" />
        <span>Mais</span>
      </div>
    </div>
  )
}
