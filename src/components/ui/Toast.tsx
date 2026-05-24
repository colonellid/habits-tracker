'use client'

import { useEffect } from 'react'
import { Check, X, Info } from 'lucide-react'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

const typeStyles: Record<NonNullable<ToastProps['type']>, { color: string; icon: React.ReactNode }> = {
  success: { color: 'text-success-green', icon: <Check size={16} strokeWidth={2.5} /> },
  error: { color: 'text-action-red', icon: <X size={16} strokeWidth={2.5} /> },
  info: { color: 'text-accent-blue', icon: <Info size={16} strokeWidth={2.5} /> },
}

export function Toast({ message, type = 'success', onClose, duration }: ToastProps) {
  const auto = duration ?? (type === 'error' ? 5000 : 3000)

  useEffect(() => {
    const timer = setTimeout(onClose, auto)
    return () => clearTimeout(timer)
  }, [onClose, auto])

  const t = typeStyles[type]

  return (
    <div
      className="fixed bottom-[100px] md:bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-md z-50 flex items-center gap-3 px-4 py-3.5 rounded-[14px] bg-charcoal text-white shadow-lg animate-toast-in cursor-pointer"
      role="status"
      aria-live="polite"
      onClick={onClose}
    >
      <span
        className={`shrink-0 w-7 h-7 rounded-full bg-white/[0.12] flex items-center justify-center ${t.color}`}
      >
        {t.icon}
      </span>
      <span className="text-sm-2 font-medium flex-1">{message}</span>
    </div>
  )
}
