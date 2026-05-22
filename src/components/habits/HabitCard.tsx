'use client'

import { Card, Badge } from '@/components/ui'
import type { HabitWithTracking } from '@/types'
import { formatValue, isCompleted } from '@/lib/metrics'

interface HabitCardProps {
  habit: HabitWithTracking
  onTrack?: (habitId: string) => void
}

export function HabitCard({ habit, onTrack }: HabitCardProps) {
  const done = habit.todayEntry ? isCompleted(habit.todayEntry.value) : false

  return (
    <Card
      className={`flex items-center gap-3 transition-opacity ${done ? 'opacity-60' : ''}`}
      onClick={() => onTrack?.(habit.id)}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: habit.color + '20', color: habit.color }}
      >
        {habit.icon ?? '🔄'}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${done ? 'line-through text-todoist-gray-400' : 'text-todoist-charcoal'}`}>
          {habit.title}
        </p>
        <p className="text-xs text-todoist-gray-500">
          {habit.todayEntry
            ? formatValue(habit.todayEntry.value)
            : 'Not tracked today'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant={done ? 'success' : 'default'}>
          {done ? 'Done' : 'Pending'}
        </Badge>
        {habit.streakDays > 0 && (
          <span className="text-xs text-todoist-orange">🔥 {habit.streakDays}</span>
        )}
      </div>
    </Card>
  )
}
