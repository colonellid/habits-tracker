'use client'

import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from './Button'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  icon?: React.ReactNode
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Deletar',
  cancelLabel = 'Cancelar',
  loading,
  icon,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/30 animate-fade-in" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[320px] bg-paper rounded-[18px] shadow-lg animate-slide-up p-6 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-tint-red flex items-center justify-center mx-auto mb-4 text-action-red">
          {icon ?? <Trash2 size={24} strokeWidth={1.75} />}
        </div>
        <h2 className="font-display text-lg-2 font-semibold text-charcoal mb-2">{title}</h2>
        <p className="text-sm text-subtle-ash mb-5">{message}</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} loading={loading} fullWidth>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
