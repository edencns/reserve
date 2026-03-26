import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (production에서는 Redis 사용)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             '127.0.0.1'

  const path = request.nextUrl.pathname

  // Security headers
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self';"
  )

  // Rate limiting for API routes
  if (path.startsWith('/api/')) {
    let limit = 60 // default: 60 req/min
    let windowMs = 60 * 1000

    if (path.includes('/api/reservations') && request.method === 'POST') {
      limit = 5 // 예약은 5회/분
    } else if (path.includes('/api/admin/login')) {
      limit = 5 // 로그인 시도 5회/분
    } else if (path.includes('/api/kiosk')) {
      limit = 30 // 키오스크 30회/분
    }

    if (!getRateLimit(ip, limit, windowMs)) {
      return NextResponse.json(
        { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
        {
          status: 429,
          headers: { 'Retry-After': '60' }
        }
      )
    }
  }

  // Admin route protection
  if (path.startsWith('/admin/') && path !== '/admin/login') {
    const token = request.cookies.get('admin-token')
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
