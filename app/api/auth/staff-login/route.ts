import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signSession, sessionCookieOptions } from '@/lib/auth'
import { rateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

// staff 계정은 환경변수로 관리 (소스코드에 하드코딩 금지)
const STAFF_USERNAME = process.env.STAFF_USERNAME ?? ''
const STAFF_PASSWORD = process.env.STAFF_PASSWORD ?? ''

export async function POST(req: Request) {
  const ip = getClientIp(req)

  // IP 기반 rate limit (15분에 10회)
  const ipRl = rateLimit({ key: `staff-login:ip:${ip}`, windowMs: 15 * 60 * 1000, max: 10 })
  if (!ipRl.ok) {
    return NextResponse.json(
      { error: `시도 횟수 초과. ${ipRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  let body: { id?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { id, password } = body

  if (!id || !password) {
    return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  // 사용자명 기반 추가 rate limit (브루트포스 방지: 15분에 5회)
  const userRl = rateLimit({ key: `staff-login:user:${id}`, windowMs: 15 * 60 * 1000, max: 5 })
  if (!userRl.ok) {
    return NextResponse.json(
      { error: `시도 횟수 초과. ${userRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  // staff 계정 확인 (env)
  if (STAFF_USERNAME && STAFF_PASSWORD && id === STAFF_USERNAME && password === STAFF_PASSWORD) {
    const token = await signSession({ id: 'staff', username: STAFF_USERNAME, role: 'staff' })
    const res = NextResponse.json({ success: true })
    res.cookies.set(sessionCookieOptions(token))
    resetRateLimit(`staff-login:ip:${ip}`)
    resetRateLimit(`staff-login:user:${id}`)
    return res
  }

  // 관리자 계정 확인 (DB)
  try {
    const { rows } = await db.execute({
      sql: 'SELECT id, username, password_hash, role FROM users WHERE username = ?',
      args: [id],
    })

    const user = rows[0]
    const isValid = user && (await bcrypt.compare(password, user.password_hash as string))

    if (!isValid) {
      return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const token = await signSession({
      id: user.id as string,
      username: user.username as string,
      role: user.role as 'admin',
    })
    const res = NextResponse.json({ success: true })
    res.cookies.set(sessionCookieOptions(token))
    resetRateLimit(`staff-login:ip:${ip}`)
    resetRateLimit(`staff-login:user:${id}`)
    return res
  } catch (err) {
    console.error('[staff-login] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
