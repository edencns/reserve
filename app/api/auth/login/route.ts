import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signSession, sessionCookieOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// 로그인 시도 횟수 제한 (메모리 기반)
const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000 // 15분

// 만료된 항목 정리 (1시간마다)
let lastCleanup = Date.now()
function cleanupAttempts() {
  const now = Date.now()
  if (now - lastCleanup < 60 * 60 * 1000) return
  lastCleanup = now
  for (const [key, val] of attempts) {
    if (val.until > 0 && now > val.until) attempts.delete(key)
    else if (val.until === 0 && val.count > 0) attempts.delete(key)
  }
}

export async function POST(req: Request) {
  cleanupAttempts()

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

  try {
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
  } catch (err) {
    console.error('[login] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
