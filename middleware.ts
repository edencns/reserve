import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 로그인 페이지는 통과
  if (pathname === '/login' || pathname === '/admin/login') return NextResponse.next()

  // /admin/* 경로 → 관리자(admin) 세션 필요
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('eden_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const session = await verifySession(token)
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // / 와 /events → staff 또는 admin 세션 필요
  if (pathname === '/' || pathname.startsWith('/events')) {
    const token = req.cookies.get('eden_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    const session = await verifySession(token)
    if (!session || (session.role !== 'admin' && session.role !== 'staff')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/', '/events', '/events/:path*', '/login'],
}
