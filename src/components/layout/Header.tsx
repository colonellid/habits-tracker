'use client'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-todoist-paper border-b border-todoist-gray-200">
      <span className="text-base font-semibold text-todoist-charcoal">{title ?? 'Habits'}</span>
      <button className="p-1 rounded text-todoist-gray-500 hover:text-todoist-charcoal">
        {/* Profile avatar placeholder */}
        <div className="w-7 h-7 rounded-full bg-todoist-red text-white flex items-center justify-center text-xs font-semibold">
          H
        </div>
      </button>
    </header>
  )
}
