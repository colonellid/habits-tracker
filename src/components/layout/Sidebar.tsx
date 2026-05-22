'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Today', icon: '☀️' },
  { href: '/tracking', label: 'Tracking', icon: '✅' },
  { href: '/habits', label: 'Habits', icon: '🔄' },
  { href: '/objectives', label: 'Objectives', icon: '🎯' },
  { href: '/areas', label: 'Areas', icon: '🗂️' },
  { href: '/insights', label: 'Insights', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut, displayName, avatarInitial } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-todoist-sidebar-bg py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-6 flex items-center gap-2">
        <div className="w-7 h-7 bg-todoist-red rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">H</span>
        </div>
        <span className="text-white font-semibold text-base">Habits</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'sidebar-item-active' : 'sidebar-item-inactive'}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="mt-4 border-t border-todoist-sidebar-item pt-4 px-1">
        <div className="flex items-center gap-2 px-2 py-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-todoist-red text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {avatarInitial}
          </div>
          <span className="text-xs text-todoist-gray-400 truncate">{displayName}</span>
        </div>
        <button
          onClick={signOut}
          className="sidebar-item-inactive w-full text-left"
        >
          <span>🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
