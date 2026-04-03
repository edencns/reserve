import { NextResponse } from 'next/server'
import { signSession, sessionCookieOptions } from '@/lib/auth'

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

  if (id !== STAFF_ID || password !== STAFF_PASSWORD) {
    return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const token = await signSession({ id: 'staff', username: 'eden', role: 'staff' })
  const res = NextResponse.json({ success: true })
  res.cookies.set(sessionCookieOptions(token))
  return res
}
