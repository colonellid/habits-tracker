'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Calendar, Target } from 'lucide-react'
import { useObjectives } from '@/hooks/useObjectives'
import { useAreas } from '@/hooks/useAreas'
import {
  Badge,
  Modal,
  ConfirmModal,
  IconButton,
  ScreenHeader,
} from '@/components/ui'
import { ObjectiveForm } from '@/components/objectives/ObjectiveForm'
import type { Objective } from '@/types'
import type { ObjectiveInput } from '@/lib/validators'

const STATUS_CONFIG = {
  active: { label: 'Ativo', variant: 'success' as const },
  paused: { label: 'Pausado', variant: 'default' as const },
  completed: { label: 'Concluído', variant: 'info' as const },
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
    <main className="p-4 md:p-6 max-w-3xl mx-auto pb-24">
      <ScreenHeader
        title="Objetivos"
        subtitle="Metas de médio e longo prazo"
        actions={
          <IconButton aria-label="Novo objetivo" onClick={() => setCreateOpen(true)} variant="solid">
            <Plus size={20} />
          </IconButton>
        }
      />

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-bg-muted rounded-card animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && objectives.length === 0 && (
        <div className="text-center py-12 px-6 border border-dashed border-soft-gray rounded-card">
          <Target size={32} className="text-dusty-sage mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-base-2 font-medium text-charcoal mb-1">Nenhum objetivo</p>
          <p className="text-sm text-subtle-ash mb-4">Defina metas para guiar seus hábitos</p>
          <button
            onClick={() => setCreateOpen(true)}
            className="text-link-orange text-sm font-medium hover:underline"
          >
            Criar primeiro objetivo →
          </button>
        </div>
      )}

      {!isLoading && objectives.length > 0 && (
        <div className="flex flex-col gap-3">
          {objectives.map((obj) => {
            const statusCfg = STATUS_CONFIG[obj.status]
            const area = areas.find((a) => a.id === obj.area_id)
            return (
              <div
                key={obj.id}
                className="bg-paper border border-soft-gray rounded-card overflow-hidden flex hover:border-[rgba(37,34,30,0.2)] transition-colors"
              >
                <div
                  className="w-1 shrink-0"
                  style={{ backgroundColor: obj.color }}
                />
                <div className="flex-1 p-4 flex items-start gap-3 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm-2 font-semibold text-charcoal">{obj.title}</p>
                      <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    </div>
                    {obj.description && (
                      <p className="text-xs text-subtle-ash line-clamp-2 mb-2">{obj.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-subtle-ash">
                      {area && (
                        <span style={{ color: area.color }} className="font-medium">
                          {area.name}
                        </span>
                      )}
                      {obj.target_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(obj.target_date).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <IconButton
                      aria-label="Editar"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(obj)}
                    >
                      <Pencil size={15} />
                    </IconButton>
                    <IconButton
                      aria-label="Deletar"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleting(obj)}
                    >
                      <Trash2 size={15} className="text-action-red" />
                    </IconButton>
                  </div>
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
        title="Deletar objetivo?"
        message={`"${deleting?.title}" será removido.`}
        loading={remove.isPending}
      />
    </main>
  )
}
