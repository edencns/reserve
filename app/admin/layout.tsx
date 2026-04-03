'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Ticket, Users, FileText, BarChart3, Building2, LogOut } from 'lucide-react'

const menuItems = [
  { path: '/admin', label: '대시보드', icon: LayoutDashboard },
  { path: '/admin/events', label: '이벤트', icon: Calendar },
  { path: '/admin/reservations', label: '예약', icon: Ticket },
  { path: '/admin/vendors', label: '업체', icon: Users },
  { path: '/admin/contracts', label: '계약', icon: FileText },
  { path: '/admin/statistics', label: '통계', icon: BarChart3 },
  { path: '/admin/company', label: '회사', icon: Building2 },
]

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--brand-dark)] flex flex-col">
        <div className="p-8 border-b border-[var(--brand-dark)]">
          <Link href="/admin" className="font-serif text-3xl">
            EDEN Admin
          </Link>
          <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mt-2">
            Administrator
          </div>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${
                  isActive
                    ? 'bg-[var(--brand-dark)] text-[var(--brand-lime)]'
                    : 'hover:bg-[var(--brand-accent)]/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[var(--brand-dark)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 border border-[var(--brand-dark)] text-sm hover:bg-[var(--brand-lime)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
