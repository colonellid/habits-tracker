'use client'

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useHabits } from '@/hooks/useHabits'
import { useTracking } from '@/hooks/useTracking'
import { useInsights, useWeekCompletion } from '@/hooks/useInsights'
import { HeatmapChart } from '@/components/habits/HeatmapChart'
import { isCompleted } from '@/lib/metrics'

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateString(d)
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="card flex flex-col gap-1 flex-1 min-w-0">
      <p className="text-xs text-todoist-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-todoist-red' : 'text-todoist-charcoal'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-todoist-gray-400">{sub}</p>}
    </div>
  )
}

export default function InsightsPage() {
  const today = toDateString(new Date())
  const [selectedHabitId, setSelectedHabitId] = useState<string>('')

  const { data: habits = [], isLoading: habitsLoading } = useHabits()
  const { data: todayEntries = [] } = useTracking(today)
  const activeHabits = useMemo(() => habits.filter((h) => h.is_active), [habits])

  // Week summary stats
  const weekStats = useMemo(() => {
    let totalSlots = 0
    let completedSlots = 0
    for (let i = 0; i < 7; i++) {
      totalSlots += activeHabits.length
    }
    // We'll approximate from today's tracking for a simple stat
    const todayDone = todayEntries.filter((e) => isCompleted(e.value)).length
    completedSlots = todayDone
    return { todayDone, total: activeHabits.length }
  }, [activeHabits, todayEntries])

  const weekPct = weekStats.total > 0
    ? Math.round((weekStats.todayDone / weekStats.total) * 100)
    : 0

  // Per-habit insights
  const effectiveHabitId = selectedHabitId || (activeHabits[0]?.id ?? null)
  const selectedHabit = activeHabits.find((h) => h.id === effectiveHabitId) ?? null
  const { data: insights, isLoading: insightsLoading } = useInsights(effectiveHabitId)

  // Week bar chart
  const { data: weekPoints = [], isLoading: weekLoading } = useWeekCompletion(activeHabits.length)

  // Per-habit 7d completion rate for table
  const habitRates = useMemo(() => {
    const today = toDateString(new Date())
    return activeHabits.map((h) => {
      return { habit: h, rate7d: 0 } // populated by insights hook per habit
    })
  }, [activeHabits])

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-todoist-charcoal">Insights</h1>

      {/* Summary row */}
      <div className="flex gap-3 flex-wrap">
        <StatCard
          label="Hábitos ativos"
          value={activeHabits.length}
          sub="no total"
        />
        <StatCard
          label="Hoje"
          value={`${weekStats.todayDone}/${weekStats.total}`}
          sub={`${weekPct}% concluído`}
          accent={weekPct === 100}
        />
        <StatCard
          label="Streak atual"
          value={insights?.streakDays ?? '—'}
          sub={selectedHabit ? selectedHabit.title : 'selecione um hábito'}
        />
      </div>

      {/* Habit selector */}
      <div className="card flex flex-col gap-2">
        <label className="text-sm font-semibold text-todoist-charcoal" htmlFor="habit-select">
          Analisar hábito
        </label>
        {habitsLoading ? (
          <div className="h-9 bg-todoist-gray-200 rounded animate-pulse" />
        ) : (
          <select
            id="habit-select"
            value={effectiveHabitId ?? ''}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="input-field"
          >
            {activeHabits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        )}

        {/* Stats for selected habit */}
        {insights && !insightsLoading && (
          <div className="flex gap-4 flex-wrap mt-2">
            <div className="text-center">
              <p className="text-xl font-bold text-todoist-charcoal">{insights.completionRate7d}%</p>
              <p className="text-xs text-todoist-gray-500">7 dias</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-todoist-charcoal">{insights.completionRate30d}%</p>
              <p className="text-xs text-todoist-gray-500">30 dias</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-todoist-charcoal">{insights.streakDays}</p>
              <p className="text-xs text-todoist-gray-500">streak atual</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-todoist-charcoal">{insights.totalDays}</p>
              <p className="text-xs text-todoist-gray-500">dias totais</p>
            </div>
          </div>
        )}

        {insightsLoading && (
          <div className="flex gap-4 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 h-12 bg-todoist-gray-200 rounded animate-pulse" />
            ))}
          </div>
        )}
      </div>

      {/* Heatmap */}
      {selectedHabit && insights && (
        <div className="card">
          <h2 className="text-sm font-semibold text-todoist-charcoal mb-3">
            Mapa de calor — últimas 12 semanas
          </h2>
          <HeatmapChart
            entries={insights.entries}
            weeks={12}
            habitTitle={selectedHabit.title}
          />
        </div>
      )}

      {/* Bar chart — last 7 days */}
      <div className="card">
        <h2 className="text-sm font-semibold text-todoist-charcoal mb-4">
          Completados — últimos 7 dias
        </h2>
        {weekLoading ? (
          <div className="h-40 bg-todoist-gray-200 rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekPoints} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#8a837a' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 10, fill: '#8a837a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Concluído']}
                labelStyle={{ color: '#25221e', fontWeight: 600 }}
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="pct"
                fill="#e34432"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Habits list with rates */}
      <div className="card">
        <h2 className="text-sm font-semibold text-todoist-charcoal mb-3">
          Todos os hábitos
        </h2>
        {habitsLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-todoist-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : activeHabits.length === 0 ? (
          <p className="text-sm text-todoist-gray-500">Nenhum hábito ativo.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeHabits.map((habit) => {
              const todayEntry = todayEntries.find((e) => e.habit_id === habit.id)
              const done = todayEntry ? isCompleted(todayEntry.value) : false
              return (
                <button
                  key={habit.id}
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors text-left w-full ${
                    habit.id === effectiveHabitId
                      ? 'bg-todoist-red-light'
                      : 'hover:bg-todoist-gray-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="flex-1 text-sm text-todoist-charcoal truncate">
                    {habit.title}
                  </span>
                  <span className={`text-xs font-medium flex-shrink-0 ${done ? 'text-todoist-green' : 'text-todoist-gray-400'}`}>
                    {done ? 'Feito hoje' : 'Pendente'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
