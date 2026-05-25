'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useHabits } from '@/hooks/useHabits'
import { useAreas } from '@/hooks/useAreas'
import { useObjectives } from '@/hooks/useObjectives'
import { useProfile } from '@/hooks/useProfile'
import {
  Badge,
  BottomSheet,
  ConfirmModal,
  Toast,
  Toggle,
  IconButton,
  ScreenHeader,
} from '@/components/ui'
import { HabitIcon } from '@/components/habits/HabitIcon'
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

  const todoistConnected = !!profile?.todoist_access_token
  const filtered = filterArea === 'all' ? habits : habits.filter((h) => h.area_id === filterArea)

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
        message:
          action === 'link'
            ? `"${habit.title}" vinculado ao Todoist!`
            : 'Sincronização desativada.',
        type: 'success',
      })
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Erro na integração.',
        type: 'error',
      })
    } finally {
      setTodoistLoading((prev) => ({ ...prev, [habit.id]: false }))
    }
  }

  return (
    <main className="p-4 md:p-6 max-w-3xl mx-auto pb-24">
      <ScreenHeader
        eyebrow={`${habits.length} cadastrado${habits.length !== 1 ? 's' : ''}`}
        title="Meus hábitos"
        actions={
          <IconButton aria-label="Novo hábito" onClick={() => setCreateOpen(true)} variant="solid">
            <Plus size={20} />
          </IconButton>
        }
      />

      {/* Filtros */}
      {areas.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          <button
            onClick={() => setFilterArea('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterArea === 'all'
                ? 'bg-charcoal text-paper'
                : 'bg-[rgba(37,34,30,0.07)] text-charcoal hover:bg-[rgba(37,34,30,0.12)]'
            }`}
          >
            Todos
          </button>
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setFilterArea(area.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterArea === area.id
                  ? 'text-paper'
                  : 'bg-[rgba(37,34,30,0.07)] text-charcoal hover:bg-[rgba(37,34,30,0.12)]'
              }`}
              style={filterArea === area.id ? { backgroundColor: area.color } : {}}
            >
              {area.name}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-bg-muted rounded-card animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12 px-6 border border-dashed border-soft-gray rounded-card">
          <p className="text-base-2 font-medium text-charcoal mb-1">Nenhum hábito</p>
          <p className="text-sm text-subtle-ash mb-4">
            {filterArea === 'all' ? 'Crie seu primeiro hábito' : 'Nenhum hábito nesta área'}
          </p>
          {filterArea === 'all' && (
            <button
              onClick={() => setCreateOpen(true)}
              className="text-link-orange text-sm font-medium hover:underline"
            >
              Criar primeiro hábito →
            </button>
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
                className={`bg-paper border border-soft-gray rounded-card p-3.5 flex items-center gap-3 transition-opacity ${
                  !habit.is_active ? 'opacity-50' : ''
                }`}
              >
                <div
                  className="w-10 h-10 rounded-default flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                >
                  <HabitIcon name={habit.icon} size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm-2 font-semibold text-charcoal truncate">{habit.title}</p>
                    {habit.todoist_sync_enabled && habit.todoist_task_id && (
                      <Badge variant="error" className="text-[9px] px-1">
                        T
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Badge variant="default">{METRIC_LABELS[habit.metric_type]}</Badge>
                    <Badge variant="info">{FREQ_LABELS[habit.frequency]}</Badge>
                    {area && (
                      <span className="text-xs text-dusty-sage truncate">{area.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {todoistConnected && (
                    <Toggle
                      checked={!!habit.todoist_sync_enabled}
                      onChange={() => handleTodoistToggle(habit)}
                      disabled={isTodoistLoading}
                      size="sm"
                      aria-label="Sincronizar com Todoist"
                    />
                  )}
                  <Toggle
                    checked={habit.is_active}
                    onChange={() => toggleActive(habit)}
                    size="sm"
                    aria-label={habit.is_active ? 'Desativar' : 'Ativar'}
                  />
                  <IconButton
                    aria-label="Editar"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(habit)}
                  >
                    <Pencil size={15} />
                  </IconButton>
                  <IconButton
                    aria-label="Deletar"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleting(habit)}
                  >
                    <Trash2 size={15} className="text-action-red" />
                  </IconButton>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BottomSheet open={createOpen} onClose={() => setCreateOpen(false)} title="Novo hábito">
        <HabitForm
          areas={areas}
          objectives={objectives}
          onSubmit={handleCreate}
          loading={create.isPending}
        />
      </BottomSheet>

      <BottomSheet open={!!editing} onClose={() => setEditing(null)} title="Editar hábito">
        {editing && (
          <HabitForm
            areas={areas}
            objectives={objectives}
            defaultValues={editing}
            onSubmit={handleUpdate}
            loading={update.isPending}
          />
        )}
      </BottomSheet>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Deletar hábito?"
        message={`"${deleting?.title}" e todo seu histórico serão removidos.`}
        loading={remove.isPending}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
