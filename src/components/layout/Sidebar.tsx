'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-todoist-sidebar-bg py-6 px-3">
      <div className="px-3 mb-6">
        <span className="text-white font-semibold text-base">Habits</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'sidebar-item-active' : 'sidebar-item-inactive'}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="px-3 mt-4 border-t border-todoist-sidebar-item pt-4">
        <button className="sidebar-item-inactive w-full text-left">
          <span>🚪</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
