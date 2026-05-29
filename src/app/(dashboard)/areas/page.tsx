'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, FolderOpen } from 'lucide-react'
import { useAreas } from '@/hooks/useAreas'
import { useHabits } from '@/hooks/useHabits'
import {
  Badge,
  Modal,
  ConfirmModal,
  IconButton,
  ScreenHeader,
} from '@/components/ui'
import { AreaForm } from '@/components/areas/AreaForm'
import type { Area } from '@/types'
import type { AreaInput } from '@/lib/validators'

export default function AreasPage() {
  const { data: areas = [], isLoading, create, update, remove } = useAreas()
  const { data: habits = [] } = useHabits()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Area | null>(null)
  const [deleting, setDeleting] = useState<Area | null>(null)

  async function handleCreate(data: AreaInput) {
    await create.mutateAsync({
      name: data.name,
      color: data.color,
      is_active: data.is_active ?? true,
      description: data.description ?? null,
      icon: data.icon ?? null,
    })
    setCreateOpen(false)
  }

  async function handleUpdate(data: AreaInput) {
    if (!editing) return
    await update.mutateAsync({
      id: editing.id,
      name: data.name,
      color: data.color,
      is_active: data.is_active ?? true,
      description: data.description ?? null,
      icon: data.icon ?? null,
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
        title="Áreas"
        subtitle="Organize seus hábitos por área de vida"
        actions={
          <IconButton aria-label="Nova área" onClick={() => setCreateOpen(true)} variant="solid">
            <Plus size={20} />
          </IconButton>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-bg-muted rounded-card animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && areas.length === 0 && (
        <div className="text-center py-12 px-6 border border-dashed border-soft-gray rounded-card">
          <FolderOpen size={32} className="text-dusty-sage mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-base-2 font-medium text-charcoal mb-1">Nenhuma área</p>
          <p className="text-sm text-subtle-ash mb-4">
            Crie áreas para organizar seus hábitos
          </p>
          <button
            onClick={() => setCreateOpen(true)}
            className="text-link-orange text-sm font-medium hover:underline"
          >
            Criar primeira área →
          </button>
        </div>
      )}

      {!isLoading && areas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {areas.map((area) => {
            const habitCount = habits.filter((h) => h.area_id === area.id).length
            return (
              <div
                key={area.id}
                className="bg-paper border border-soft-gray rounded-card p-4 hover:border-[rgba(37,34,30,0.2)] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-default flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${area.color}15`, color: area.color }}
                  >
                    <FolderOpen size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm-2 font-semibold text-charcoal truncate">{area.name}</p>
                      {!area.is_active && <Badge variant="warning">Inativa</Badge>}
                    </div>
                    {area.description && (
                      <p className="text-xs text-subtle-ash line-clamp-2 mb-1">
                        {area.description}
                      </p>
                    )}
                    <p className="text-xs font-medium" style={{ color: area.color }}>
                      {habitCount} hábito{habitCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <IconButton
                      aria-label="Editar"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(area)}
                    >
                      <Pencil size={15} />
                    </IconButton>
                    <IconButton
                      aria-label="Deletar"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleting(area)}
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nova área" size="md">
        <AreaForm onSubmit={handleCreate} loading={create.isPending} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar área" size="md">
        {editing && (
          <AreaForm defaultValues={editing} onSubmit={handleUpdate} loading={update.isPending} />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Deletar área?"
        message={`"${deleting?.name}" será removida. Hábitos da área ficam sem categoria.`}
        loading={remove.isPending}
      />
    </main>
  )
}
