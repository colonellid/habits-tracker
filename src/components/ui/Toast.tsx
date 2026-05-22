'use client'

import { useEffect } from 'react'

export interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const colors =
    type === 'success'
      ? 'bg-todoist-green text-white'
      : 'bg-todoist-red text-white'

  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-medium animate-toast-in ${colors}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{message}</span>
    </div>
  )
}
