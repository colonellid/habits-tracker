'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/30 animate-fade-in"
        aria-hidden
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottomsheet-title' : undefined}
        className="relative w-full sm:max-w-md sm:mx-4 bg-paper rounded-t-[24px] sm:rounded-[24px] shadow-lg max-h-[92vh] flex flex-col animate-slide-up"
      >
        <div className="flex flex-col items-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-[5px] rounded-full bg-soft-gray" aria-hidden />
        </div>

        {title && (
          <div className="flex items-center justify-between px-5 pt-3 pb-3 shrink-0">
            <span className="w-10" aria-hidden />
            <h2 id="bottomsheet-title" className="font-display text-lg-2 font-semibold text-charcoal">
              {title}
            </h2>
            <IconButton aria-label="Fechar" onClick={onClose} variant="ghost" size="sm">
              <X size={18} />
            </IconButton>
          </div>
        )}

        <div className="overflow-y-auto px-5 pb-4 flex-1">{children}</div>

        {footer && (
          <div className="border-t border-soft-gray px-5 py-4 shrink-0">{footer}</div>
        )}
      </div>
    </div>
  )
}
