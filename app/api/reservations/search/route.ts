import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  let body: { phone?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const phone = body.phone?.trim()
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: '전화번호를 입력해주세요.' }, { status: 400 })
  }

  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM reservations WHERE customer_phone = ? ORDER BY created_at DESC',
      args: [phone],
    })

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[reservations/search] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
