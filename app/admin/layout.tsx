'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser } from '../../src/app/mockData'
import { AdminLayout } from '../../src/app/components/AdminLayout'

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = getCurrentUser()

  // Skip auth check for the login page itself
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage && (!user || user.role !== 'admin')) {
      router.replace('/admin/login')
    }
  }, [user, router, isLoginPage])

  // Login page doesn't need AdminLayout wrapper
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!user || user.role !== 'admin') return null

  return <AdminLayout>{children}</AdminLayout>
}
