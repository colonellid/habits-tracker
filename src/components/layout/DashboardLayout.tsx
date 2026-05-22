import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-todoist-paper">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
