import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signSession, sessionCookieOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// 로그인 시도 횟수 제한 (메모리 기반)
const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000 // 15분

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  // Rate limiting
  const now = Date.now()
  const record = attempts.get(ip)
  if (record && now < record.until) {
    const remaining = Math.ceil((record.until - now) / 60000)
    return NextResponse.json(
      { error: `시도 횟수 초과. ${remaining}분 후 다시 시도해주세요.` },
      { status: 429 }
    )
  }

  const { id, password } = await req.json()

  if (!id || !password) {
    return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  // Turso에서 사용자 조회
  const { rows } = await db.execute({
    sql: 'SELECT id, username, password_hash, role FROM users WHERE username = ?',
    args: [id],
  })

  const user = rows[0]
  const isValid = user && await bcrypt.compare(password, user.password_hash as string)

  if (!isValid) {
    const prev = attempts.get(ip) ?? { count: 0, until: 0 }
    const newCount = prev.count + 1
    attempts.set(ip, {
      count: newCount,
      until: newCount >= MAX_ATTEMPTS ? now + LOCK_MS : 0,
    })
    return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  attempts.delete(ip)

  const token = await signSession({
    id: user.id as string,
    username: user.username as string,
    role: user.role as 'admin',
  })

  const res = NextResponse.json({ success: true })
  res.cookies.set(sessionCookieOptions(token))
  return res
}
