'use client'

import { useState } from 'react'
import { useObjectives } from '@/hooks/useObjectives'
import { useAreas } from '@/hooks/useAreas'
import { Button, Badge, Modal, ConfirmModal } from '@/components/ui'
import { ObjectiveForm } from '@/components/objectives/ObjectiveForm'
import type { Objective } from '@/types'
import type { ObjectiveInput } from '@/lib/validators'

const STATUS_CONFIG = {
  active:    { label: 'Ativo',     variant: 'success'  as const },
  paused:    { label: 'Pausado',   variant: 'warning'  as const },
  completed: { label: 'Concluído', variant: 'info'     as const },
}

export default function ObjectivesPage() {
  const { data: objectives = [], isLoading, create, update, remove } = useObjectives()
  const { data: areas = [] } = useAreas()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Objective | null>(null)
  const [deleting, setDeleting] = useState<Objective | null>(null)

  async function handleCreate(data: ObjectiveInput) {
    await create.mutateAsync({
      title: data.title,
      color: data.color,
      status: data.status ?? 'active',
      description: data.description ?? null,
      area_id: data.area_id ?? null,
      target_date: data.target_date ?? null,
    })
    setCreateOpen(false)
  }

  async function handleUpdate(data: ObjectiveInput) {
    if (!editing) return
    await update.mutateAsync({
      id: editing.id,
      title: data.title,
      color: data.color,
      status: data.status ?? 'active',
      description: data.description ?? null,
      area_id: data.area_id ?? null,
      target_date: data.target_date ?? null,
    })
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleting) return
    await remove.mutateAsync(deleting.id)
    setDeleting(null)
  }

  return (
    <main className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-todoist-charcoal">Objetivos</h1>
          <p className="text-sm text-todoist-gray-500 mt-0.5">Metas de médio e longo prazo</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Novo objetivo</Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-20 bg-todoist-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && objectives.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-3xl mb-3">🎯</p>
          <p className="font-medium text-todoist-charcoal">Nenhum objetivo criado</p>
          <p className="text-sm text-todoist-gray-500 mt-1 mb-4">Defina metas para guiar seus hábitos</p>
          <Button onClick={() => setCreateOpen(true)}>Criar primeiro objetivo</Button>
        </div>
      )}

      {!isLoading && objectives.length > 0 && (
        <div className="flex flex-col gap-3">
          {objectives.map((obj) => {
            const statusCfg = STATUS_CONFIG[obj.status]
            const area = areas.find((a) => a.id === obj.area_id)
            return (
              <div key={obj.id} className="card flex items-start gap-3">
                <div
                  className="w-3 h-full min-h-[2.5rem] rounded-full flex-shrink-0 self-stretch"
                  style={{ backgroundColor: obj.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-medium text-todoist-charcoal">{obj.title}</p>
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    {area && (
                      <span className="text-xs text-todoist-gray-500 flex items-center gap-1">
                        <span style={{ color: area.color }}>{area.icon ?? '🗂️'}</span>
                        {area.name}
                      </span>
                    )}
                  </div>
                  {obj.description && (
                    <p className="text-xs text-todoist-gray-500 line-clamp-2">{obj.description}</p>
                  )}
                  {obj.target_date && (
                    <p className="text-xs text-todoist-gray-400 mt-1">
                      📅 {new Date(obj.target_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditing(obj)}
                    className="p-1.5 rounded text-todoist-gray-400 hover:text-todoist-charcoal hover:bg-todoist-gray-100 transition-colors"
                  >✏️</button>
                  <button
                    onClick={() => setDeleting(obj)}
                    className="p-1.5 rounded text-todoist-gray-400 hover:text-todoist-red hover:bg-todoist-red-light transition-colors"
                  >🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo objetivo" size="md">
        <ObjectiveForm areas={areas} onSubmit={handleCreate} loading={create.isPending} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar objetivo" size="md">
        {editing && (
          <ObjectiveForm
            areas={areas}
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
        title="Deletar objetivo"
        message={`Tem certeza que quer deletar "${deleting?.title}"?`}
        loading={remove.isPending}
      />
    </main>
  )
}
