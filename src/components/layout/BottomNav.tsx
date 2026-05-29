'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, FolderOpen, Target, MoreHorizontal, type LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  Icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Hoje', Icon: Home },
  { href: '/insights', label: 'Insights', Icon: BarChart3 },
  { href: '/areas', label: 'Áreas', Icon: FolderOpen },
  { href: '/objectives', label: 'Objetivos', Icon: Target },
  { href: '/settings', label: 'Mais', Icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-paper border-t border-soft-gray safe-area-bottom">
      <div className="flex h-[60px]">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 ${
                active ? 'text-action-red' : 'text-subtle-ash hover:text-charcoal'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[9px] font-semibold leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
