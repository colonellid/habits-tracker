'use client'

import { HabitIcon } from '@/components/habits/HabitIcon'
import type { Habit } from '@/types'

interface HabitProgressBarProps {
  habit: Habit
  percent: number
  onClick?: () => void
}

export function HabitProgressBar({ habit, percent, onClick }: HabitProgressBarProps) {
  const accent = habit.color || '#e34432'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2 px-1 hover:bg-[rgba(37,34,30,0.04)] rounded-default transition-colors text-left"
    >
      <div
        className="w-9 h-9 rounded-default flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        <HabitIcon name={habit.icon} size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm-2 font-medium text-charcoal truncate">{habit.title}</p>
        <div className="h-1 rounded-full bg-bg-muted mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-250 ease-out"
            style={{ width: `${percent}%`, backgroundColor: accent }}
          />
        </div>
      </div>
      <span className="font-display text-base font-bold text-charcoal shrink-0">{percent}%</span>
    </button>
  )
}
