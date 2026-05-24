'use client'

import { Plus } from 'lucide-react'

interface FABProps {
  onClick: () => void
  'aria-label': string
  icon?: React.ReactNode
  className?: string
}

export function FAB({ onClick, icon, className = '', ...rest }: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rest['aria-label']}
      className={`fixed bottom-[92px] right-6 w-14 h-14 rounded-full bg-action-red text-white shadow-fab hover:bg-cta-hover hover:scale-105 active:scale-95 transition-all duration-150 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-action-red focus-visible:ring-offset-2 z-30 ${className}`}
    >
      {icon ?? <Plus size={24} strokeWidth={2.5} />}
    </button>
  )
}
