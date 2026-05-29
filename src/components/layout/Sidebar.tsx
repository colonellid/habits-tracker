'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  CheckSquare,
  Repeat,
  Target,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface NavItem {
  href: string
  label: string
  Icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Hoje', Icon: Home },
  { href: '/tracking', label: 'Rastreamento', Icon: CheckSquare },
  { href: '/habits', label: 'Hábitos', Icon: Repeat },
  { href: '/objectives', label: 'Objetivos', Icon: Target },
  { href: '/areas', label: 'Áreas', Icon: FolderOpen },
  { href: '/insights', label: 'Estatísticas', Icon: BarChart3 },
  { href: '/settings', label: 'Configurações', Icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut, displayName, avatarInitial } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-todoist-sidebar-bg py-6 px-3">
      <div className="px-3 mb-6 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-action-red rounded-[8px] flex items-center justify-center flex-shrink-0 text-white">
          <CheckCircle2 size={18} strokeWidth={2} />
        </div>
        <span className="text-white font-display font-semibold text-base">Habits</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-default text-sm-2 font-medium transition-colors duration-150 ${
                active
                  ? 'bg-todoist-sidebar-item text-white'
                  : 'text-dusty-sage hover:text-white hover:bg-todoist-sidebar-item'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 border-t border-todoist-sidebar-item pt-4 px-1">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-action-red text-white flex items-center justify-center text-xs font-display font-semibold flex-shrink-0">
            {avatarInitial}
          </div>
          <span className="text-xs text-dusty-sage truncate">{displayName}</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-default text-sm-2 font-medium w-full text-left text-dusty-sage hover:text-white hover:bg-todoist-sidebar-item transition-colors duration-150"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
