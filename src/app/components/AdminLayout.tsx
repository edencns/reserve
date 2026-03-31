// Legacy component — no longer used. Kept as stub to satisfy old imports in src/app/pages/.
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>
}
