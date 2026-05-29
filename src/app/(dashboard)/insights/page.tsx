'use client'

import { useState, useMemo } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Flame, Award } from 'lucide-react'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { useTrackingRange } from '@/hooks/useTrackingRange'
import { useInsights, useWeekCompletion } from '@/hooks/useInsights'
import { Select, ScreenHeader } from '@/components/ui'
import { HeatmapChart } from '@/components/habits/HeatmapChart'
import { BigStat } from '@/components/insights/BigStat'
import { StatCard } from '@/components/insights/StatCard'
import { HabitProgressBar } from '@/components/insights/HabitProgressBar'
import { isCompleted } from '@/lib/metrics'
import { calcStreak } from '@/lib/streak'

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default function InsightsPage() {
  const today = toDateString(new Date())
  const [selectedHabitId, setSelectedHabitId] = useState<string>('')

  const { data: habits = [], isLoading: habitsLoading } = useHabits()
  const { data: todayEntries = [] } = useTracking(today)
  const { data: rangeEntries = [] } = useTrackingRange(30)
  const activeHabits = useMemo(() => habits.filter((h) => h.is_active), [habits])

  // ─── Maior sequência ativa entre todos os hábitos ─────────────
  const maxStreak = useMemo(() => {
    let max = 0
    let habit = ''
    for (const h of activeHabits) {
      const habitEntries = rangeEntries.filter((e) => e.habit_id === h.id)
      const s = calcStreak(habitEntries)
      if (s > max) {
        max = s
        habit = h.title
      }
    }
    return { value: max, habit }
  }, [activeHabits, rangeEntries])

  // ─── Esta semana ──────────────────────────────────────────────
  const weekStats = useMemo(() => {
    const todayDone = todayEntries.filter((e) => isCompleted(e.value)).length
    const total = activeHabits.length
    const pct = total > 0 ? Math.round((todayDone / total) * 100) : 0
    return { todayDone, total, pct }
  }, [todayEntries, activeHabits])

  const totalStreakSum = useMemo(() => {
    let sum = 0
    for (const h of activeHabits) {
      const habitEntries = rangeEntries.filter((e) => e.habit_id === h.id)
      sum += calcStreak(habitEntries)
    }
    return sum
  }, [activeHabits, rangeEntries])

  const effectiveHabitId = selectedHabitId || (activeHabits[0]?.id ?? null)
  const selectedHabit = activeHabits.find((h) => h.id === effectiveHabitId) ?? null
  const { data: insights } = useInsights(effectiveHabitId)
  const { data: weekPoints = [], isLoading: weekLoading } = useWeekCompletion(activeHabits.length)

  // Per-habit completion rate 7d
  const habitRates = useMemo(() => {
    return activeHabits
      .map((habit) => {
        const habitEntries = rangeEntries.filter((e) => e.habit_id === habit.id)
        const last7Slots = 7
        let done = 0
        for (let i = 0; i < last7Slots; i++) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = toDateString(d)
          const e = habitEntries.find((x) => x.tracked_date === ds)
          if (e && isCompleted(e.value)) done++
        }
        return { habit, percent: Math.round((done / last7Slots) * 100) }
      })
      .sort((a, b) => b.percent - a.percent)
  }, [activeHabits, rangeEntries])

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col gap-5 pb-24">
      <ScreenHeader title="Estatísticas" eyebrow="Visão geral" />

      {maxStreak.value > 0 ? (
        <BigStat
          eyebrow="Maior sequência ativa"
          value={maxStreak.value}
          unit="dias seguidos"
          footer={maxStreak.habit ? `Em "${maxStreak.habit}"` : undefined}
        />
      ) : (
        <BigStat
          eyebrow="Comece sua jornada"
          value="0"
          unit="dias"
          footer="Marque um hábito hoje para começar"
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Esta semana"
          value={`${weekStats.todayDone}/${weekStats.total}`}
          sub={`${weekStats.pct}% concluído hoje`}
        />
        <StatCard
          label="Sequência total"
          value={totalStreakSum}
          sub="somatório de streaks"
        />
      </div>

      <div className="bg-paper border border-soft-gray rounded-card p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-3">
          Últimos 7 dias
        </h2>
        {weekLoading ? (
          <div className="h-32 bg-bg-muted rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weekPoints} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="label"
                tick={(props) => {
                  const { x, y, payload, index } = props
                  const isLast = index === weekPoints.length - 1
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={12}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={isLast ? 600 : 500}
                      fill={isLast ? '#e34432' : '#6f6c69'}
                    >
                      {payload.value}
                    </text>
                  )
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 10, fill: '#94928f' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(37, 34, 30, 0.05)' }}
                formatter={(value: number) => [`${value}%`, 'Concluído']}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #d7d6d4',
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="pct"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {weekPoints.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === weekPoints.length - 1 ? '#e34432' : '#d7d6d4'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-paper border border-soft-gray rounded-card p-5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-3">
          Analisar hábito
        </h2>
        {habitsLoading || activeHabits.length === 0 ? (
          <p className="text-sm text-subtle-ash">Crie um hábito para ver insights.</p>
        ) : (
          <Select
            value={effectiveHabitId ?? ''}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            options={activeHabits.map((h) => ({ value: h.id, label: h.title }))}
          />
        )}

        {selectedHabit && insights && (
          <>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <p className="font-display text-xl font-bold text-charcoal">{insights.streakDays}</p>
                <p className="text-xs text-subtle-ash mt-1 flex items-center justify-center gap-1">
                  <Flame size={11} /> Sequência
                </p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-charcoal">{insights.completionRate7d}%</p>
                <p className="text-xs text-subtle-ash mt-1">7 dias</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-charcoal">{insights.totalDays}</p>
                <p className="text-xs text-subtle-ash mt-1 flex items-center justify-center gap-1">
                  <Award size={11} /> Total
                </p>
              </div>
            </div>
            <div className="mt-5">
              <HeatmapChart
                entries={insights.entries}
                weeks={12}
                habitTitle={selectedHabit.title}
              />
            </div>
          </>
        )}
      </div>

      {habitRates.length > 0 && (
        <div className="bg-paper border border-soft-gray rounded-card p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-3">
            Taxa por hábito · 7d
          </h2>
          <div className="flex flex-col gap-1">
            {habitRates.map(({ habit, percent }) => (
              <HabitProgressBar
                key={habit.id}
                habit={habit}
                percent={percent}
                onClick={() => setSelectedHabitId(habit.id)}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
