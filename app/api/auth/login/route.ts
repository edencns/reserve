import { NextResponse } from 'next/server'
import { loginUser } from '@/app/mockData'

export async function POST(req: Request) {
  const { id, password } = await req.json()
  const result = loginUser(id, password)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }
  return NextResponse.json({ success: true, user: result.user })
}
