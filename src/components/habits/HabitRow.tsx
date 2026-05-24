'use client'

import { Check, Flame } from 'lucide-react'
import { HabitIcon } from './HabitIcon'
import { MiniGrid } from './MiniGrid'
import type { Habit } from '@/types'

interface HabitRowProps {
  habit: Habit
  done: boolean
  streak?: number
  miniGridData?: boolean[]
  onClick?: () => void
  onCheck?: () => void
  /** Subtítulo opcional (ex: valor registrado hoje, frequência) */
  subtitle?: string
}

export function HabitRow({
  habit,
  done,
  streak = 0,
  miniGridData,
  onClick,
  onCheck,
  subtitle,
}: HabitRowProps) {
  const accent = habit.color || '#e34432'

  return (
    <div
      className="bg-paper border border-soft-gray rounded-[12px] p-4 hover:border-[rgba(37,34,30,0.2)] transition-colors duration-150 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-[10px] flex items-center justify-center text-charcoal shrink-0"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <HabitIcon name={habit.icon} size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-base-2 font-semibold truncate ${
              done ? 'text-dusty-sage line-through' : 'text-charcoal'
            }`}
          >
            {habit.title}
          </p>
          {subtitle && (
            <p className="text-sm text-subtle-ash truncate mt-0.5">{subtitle}</p>
          )}
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1 shrink-0 text-link-orange">
            <Flame size={14} strokeWidth={2} />
            <span className="text-sm-2 font-semibold">{streak}</span>
          </div>
        )}

        <button
          type="button"
          aria-label={done ? 'Desmarcar' : 'Marcar como concluído'}
          onClick={(e) => {
            e.stopPropagation()
            onCheck?.()
          }}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150 shrink-0 ${
            done
              ? 'bg-success-green border-success-green text-white'
              : 'border-soft-gray hover:border-charcoal'
          }`}
        >
          {done && <Check size={16} strokeWidth={3} />}
        </button>
      </div>

      {miniGridData && (
        <div className="mt-3">
          <MiniGrid data={miniGridData} accentColor={accent} />
        </div>
      )}
    </div>
  )
}
