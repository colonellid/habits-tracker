'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useHabits } from '@/hooks/useHabits'
import { useAreas } from '@/hooks/useAreas'
import { useObjectives } from '@/hooks/useObjectives'
import { useProfile } from '@/hooks/useProfile'
import { Button, Badge, Modal, ConfirmModal, Toast } from '@/components/ui'
import { HabitForm } from '@/components/habits/HabitForm'
import { syncTodoistTask } from '@/lib/todoist-sync'
import type { Habit } from '@/types'
import type { HabitInput } from '@/lib/validators'

const METRIC_LABELS: Record<string, string> = {
  binary: 'Binário', quantity: 'Quantidade', duration: 'Duração',
  rating: 'Avaliação', checklist: 'Checklist', note: 'Nota',
}
const FREQ_LABELS: Record<string, string> = {
  daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal', custom: 'Personalizado',
}

interface ToastState { message: string; type: 'success' | 'error' }

function TodoistToggle({
  habit,
  connected,
  onToggle,
  loading,
}: {
  habit: Habit
  connected: boolean
  onToggle: (habit: Habit) => void
  loading: boolean
}) {
  if (!connected) return null
  const enabled = habit.todoist_sync_enabled

  return (
    <button
      onClick={() => onToggle(habit)}
      disabled={loading}
      title={enabled ? 'Desativar sincronização Todoist' : 'Ativar sincronização Todoist'}
      className={`relative w-8 h-4 rounded-full transition-colors disabled:opacity-50 ${
        enabled ? 'bg-todoist-red' : 'bg-todoist-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform flex items-center justify-center ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  )
}

export default function HabitsPage() {
  const qc = useQueryClient()
  const { data: habits = [], isLoading, create, update, remove } = useHabits()
  const { data: areas = [] } = useAreas()
  const { data: objectives = [] } = useObjectives()
  const { profile } = useProfile()

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)
  const [deleting, setDeleting] = useState<Habit | null>(null)
  const [filterArea, setFilterArea] = useState<string>('all')
  const [todoistLoading, setTodoistLoading] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<ToastState | null>(null)

  const todoistConnected = !!(profile?.todoist_access_token)

  const filtered = filterArea === 'all'
    ? habits
    : habits.filter((h) => h.area_id === filterArea)

  async function handleCreate(data: HabitInput) {
    await create.mutateAsync({
      title: data.title,
      color: data.color,
      metric_type: data.metric_type,
      metric_config: data.metric_config ?? {},
      frequency: data.frequency ?? 'daily',
      frequency_config: data.frequency_config ?? {},
      is_active: data.is_active ?? true,
      order_index: data.order_index ?? 0,
      description: data.description ?? null,
      area_id: data.area_id ?? null,
      objective_id: data.objective_id ?? null,
      icon: data.icon ?? null,
      todoist_task_id: null,
    })
    setCreateOpen(false)
  }

  async function handleUpdate(data: HabitInput) {
    if (!editing) return
    await update.mutateAsync({
      id: editing.id,
      title: data.title,
      color: data.color,
      metric_type: data.metric_type,
      metric_config: data.metric_config ?? {},
      frequency: data.frequency ?? 'daily',
      frequency_config: data.frequency_config ?? {},
      is_active: data.is_active ?? true,
      order_index: data.order_index ?? 0,
      description: data.description ?? null,
      area_id: data.area_id ?? null,
      objective_id: data.objective_id ?? null,
      icon: data.icon ?? null,
      todoist_task_id: editing.todoist_task_id,
    })
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleting) return
    await remove.mutateAsync(deleting.id)
    setDeleting(null)
  }

  async function toggleActive(habit: Habit) {
    await update.mutateAsync({ id: habit.id, is_active: !habit.is_active })
  }

  async function handleTodoistToggle(habit: Habit) {
    const action = habit.todoist_sync_enabled ? 'unlink' : 'link'
    setTodoistLoading((prev) => ({ ...prev, [habit.id]: true }))
    try {
      await syncTodoistTask(habit.id, action)
      await qc.invalidateQueries({ queryKey: ['habits'] })
      setToast({
        message: action === 'link'
          ? `"${habit.title}" vinculado ao Todoist!`
          : 'Sincronização desativada.',
        type: 'success',
      })
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Erro na integração Todoist.',
        type: 'error',
      })
    } finally {
      setTodoistLoading((prev) => ({ ...prev, [habit.id]: false }))
    }
  }

  return (
    <main className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-todoist-charcoal">Hábitos</h1>
          <p className="text-sm text-todoist-gray-500 mt-0.5">
            {habits.length} hábito{habits.length !== 1 ? 's' : ''} cadastrado{habits.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Novo hábito</Button>
      </div>

      {/* Filtro por área */}
      {areas.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          <button
            onClick={() => setFilterArea('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterArea === 'all'
                ? 'bg-todoist-charcoal text-white'
                : 'bg-todoist-gray-200 text-todoist-gray-600 hover:bg-todoist-gray-300'
            }`}
          >
            Todos
          </button>
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setFilterArea(area.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterArea === area.id
                  ? 'text-white'
                  : 'bg-todoist-gray-200 text-todoist-gray-600 hover:bg-todoist-gray-300'
              }`}
              style={filterArea === area.id ? { backgroundColor: area.color } : {}}
            >
              {area.icon} {area.name}
            </button>
          ))}
        </div>
      )}

      {/* Legenda Todoist (só mostra se conectado) */}
      {todoistConnected && (
        <div className="flex items-center gap-2 mb-3 text-xs text-todoist-gray-500">
          <span className="w-6 h-3 rounded-full bg-todoist-red inline-block opacity-70" />
          <span>Sincronizar com Todoist (projeto Hábitos)</span>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse h-16 bg-todoist-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-3xl mb-3">🔄</p>
          <p className="font-medium text-todoist-charcoal">Nenhum hábito encontrado</p>
          <p className="text-sm text-todoist-gray-500 mt-1 mb-4">
            {filterArea === 'all' ? 'Crie seu primeiro hábito' : 'Nenhum hábito nesta área'}
          </p>
          {filterArea === 'all' && (
            <Button onClick={() => setCreateOpen(true)}>Criar primeiro hábito</Button>
          )}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col gap-2">
          {filtered.map((habit) => {
            const area = areas.find((a) => a.id === habit.area_id)
            const isTodoistLoading = todoistLoading[habit.id] ?? false
            return (
              <div
                key={habit.id}
                className={`card flex items-center gap-3 transition-opacity ${!habit.is_active ? 'opacity-50' : ''}`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: habit.color + '20', color: habit.color }}
                >
                  {habit.icon ?? '🔄'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-todoist-charcoal truncate">{habit.title}</p>
                    {habit.todoist_sync_enabled && habit.todoist_task_id && (
                      <span
                        className="text-[9px] font-bold px-1 py-0.5 rounded bg-todoist-red text-white flex-shrink-0"
                        title="Sincronizado com Todoist"
                      >
                        T
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Badge variant="default">{METRIC_LABELS[habit.metric_type]}</Badge>
                    <Badge variant="info">{FREQ_LABELS[habit.frequency]}</Badge>
                    {area && (
                      <span className="text-xs text-todoist-gray-400">{area.icon} {area.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Todoist sync toggle */}
                  {todoistConnected && (
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-todoist-gray-400 font-medium">T</span>
                      <TodoistToggle
                        habit={habit}
                        connected={todoistConnected}
                        onToggle={handleTodoistToggle}
                        loading={isTodoistLoading}
                      />
                    </div>
                  )}

                  {/* Toggle ativo */}
                  <button
                    onClick={() => toggleActive(habit)}
                    title={habit.is_active ? 'Desativar' : 'Ativar'}
                    className={`relative w-8 h-4 rounded-full transition-colors ${
                      habit.is_active ? 'bg-todoist-green' : 'bg-todoist-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        habit.is_active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setEditing(habit)}
                    className="p-1.5 rounded text-todoist-gray-400 hover:text-todoist-charcoal hover:bg-todoist-gray-100 transition-colors"
                  >✏️</button>
                  <button
                    onClick={() => setDeleting(habit)}
                    className="p-1.5 rounded text-todoist-gray-400 hover:text-todoist-red hover:bg-todoist-red-light transition-colors"
                  >🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo hábito" size="lg">
        <HabitForm
          areas={areas}
          objectives={objectives}
          onSubmit={handleCreate}
          loading={create.isPending}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar hábito" size="lg">
        {editing && (
          <HabitForm
            areas={areas}
            objectives={objectives}
            defaultValues={editing}
            onSubmit={handleUpdate}
            loading={update.isPending}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Deletar hábito"
        message={`Tem certeza que quer deletar "${deleting?.title}"? O histórico de rastreamento também será removido.`}
        loading={remove.isPending}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
