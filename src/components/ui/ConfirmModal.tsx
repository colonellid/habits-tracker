'use client'

import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, loading }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-todoist-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          loading={loading}
          className="!bg-todoist-red hover:!bg-todoist-red-dark !text-white"
        >
          Deletar
        </Button>
      </div>
    </Modal>
  )
}
