'use client'

import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { avatarInitial, signOut, loading } = useAuth()

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-todoist-paper border-b border-todoist-gray-200">
      <span className="text-base font-semibold text-todoist-charcoal">{title ?? 'Habits'}</span>
      {!loading && (
        <button
          onClick={signOut}
          className="p-1 rounded text-todoist-gray-500 hover:text-todoist-charcoal"
          title="Sair"
        >
          <div className="w-7 h-7 rounded-full bg-todoist-red text-white flex items-center justify-center text-xs font-semibold">
            {avatarInitial}
          </div>
        </button>
      )}
    </header>
  )
}
