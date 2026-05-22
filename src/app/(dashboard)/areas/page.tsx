'use client'

import { useState } from 'react'
import { useAreas } from '@/hooks/useAreas'
import { Button, Badge, Modal, ConfirmModal } from '@/components/ui'
import { AreaForm } from '@/components/areas/AreaForm'
import type { Area } from '@/types'
import type { AreaInput } from '@/lib/validators'

export default function AreasPage() {
  const { data: areas = [], isLoading, create, update, remove } = useAreas()
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
    <main className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-todoist-charcoal">Áreas</h1>
          <p className="text-sm text-todoist-gray-500 mt-0.5">Organize seus hábitos por área de vida</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Nova área</Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-24 bg-todoist-gray-100" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && areas.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-3xl mb-3">🗂️</p>
          <p className="font-medium text-todoist-charcoal">Nenhuma área criada</p>
          <p className="text-sm text-todoist-gray-500 mt-1 mb-4">Crie áreas para organizar seus hábitos</p>
          <Button onClick={() => setCreateOpen(true)}>Criar primeira área</Button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && areas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {areas.map((area) => (
            <div key={area.id} className="card flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                style={{ backgroundColor: area.color + '20', color: area.color }}
              >
                {area.icon ?? '🗂️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-todoist-charcoal truncate">{area.name}</p>
                  {!area.is_active && <Badge variant="warning">Inativa</Badge>}
                </div>
                {area.description && (
                  <p className="text-xs text-todoist-gray-500 line-clamp-2">{area.description}</p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditing(area)}
                  className="p-1.5 rounded text-todoist-gray-400 hover:text-todoist-charcoal hover:bg-todoist-gray-100 transition-colors"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setDeleting(area)}
                  className="p-1.5 rounded text-todoist-gray-400 hover:text-todoist-red hover:bg-todoist-red-light transition-colors"
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal criar */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nova área" size="md">
        <AreaForm onSubmit={handleCreate} loading={create.isPending} />
      </Modal>

      {/* Modal editar */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar área" size="md">
        {editing && (
          <AreaForm
            defaultValues={editing}
            onSubmit={handleUpdate}
            loading={update.isPending}
          />
        )}
      </Modal>

      {/* Modal confirmar delete */}
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Deletar área"
        message={`Tem certeza que quer deletar "${deleting?.name}"? Esta ação não pode ser desfeita.`}
        loading={remove.isPending}
      />
    </main>
  )
}
