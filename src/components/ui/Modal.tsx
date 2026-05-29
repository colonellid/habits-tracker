'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-[320px]',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
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
        aria-labelledby="modal-title"
        className={`relative w-full ${sizeClasses[size]} bg-paper rounded-[18px] shadow-lg animate-slide-up overflow-hidden`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 id="modal-title" className="font-display text-lg-2 font-semibold text-charcoal">
            {title}
          </h2>
          <IconButton aria-label="Fechar" onClick={onClose} variant="ghost" size="sm">
            <X size={18} />
          </IconButton>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  )
}
