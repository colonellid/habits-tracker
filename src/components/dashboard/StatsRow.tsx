'use client'

import type { DashboardStats } from '@/types'

interface StatsRowProps {
  stats: DashboardStats
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
}

function StatCard({ label, value, sub, color = 'text-todoist-charcoal' }: StatCardProps) {
  return (
    <div className="card flex flex-col gap-1 flex-1 min-w-0">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs font-medium text-todoist-gray-500">{label}</span>
      {sub && <span className="text-xs text-todoist-gray-400">{sub}</span>}
    </div>
  )
}

export function StatsRow({ stats }: StatsRowProps) {
  const todayPct = stats.todayTotal > 0
    ? Math.round((stats.todayCompleted / stats.todayTotal) * 100)
    : 0

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <StatCard
        label="Hoje"
        value={`${stats.todayCompleted}/${stats.todayTotal}`}
        sub={`${todayPct}% completo`}
        color="text-todoist-red"
      />
      <StatCard
        label="Sequência"
        value={`${stats.streakDays}🔥`}
        sub="dias seguidos"
        color="text-todoist-orange"
      />
      <StatCard
        label="Semana"
        value={`${stats.weekCompletion}%`}
        sub="últimos 7 dias"
        color="text-todoist-blue"
      />
      <StatCard
        label="Mês"
        value={`${stats.monthCompletion}%`}
        sub="média mensal"
        color="text-todoist-green"
      />
    </div>
  )
}
