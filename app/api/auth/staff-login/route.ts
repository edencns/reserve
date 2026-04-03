import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signSession, sessionCookieOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const STAFF_ID = 'eden'
const STAFF_PASSWORD = 'dlems123'

export async function POST(req: Request) {
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

  // staff 계정 확인
  if (id === STAFF_ID && password === STAFF_PASSWORD) {
    const token = await signSession({ id: 'staff', username: 'eden', role: 'staff' })
    const res = NextResponse.json({ success: true })
    res.cookies.set(sessionCookieOptions(token))
    return res
  }

  // 관리자 계정 확인 (DB)
  try {
    const { rows } = await db.execute({
      sql: 'SELECT id, username, password_hash, role FROM users WHERE username = ?',
      args: [id],
    })

    const user = rows[0]
    const isValid = user && await bcrypt.compare(password, user.password_hash as string)

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
    return res
  } catch (err) {
    console.error('[staff-login] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
