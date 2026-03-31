import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST: 키오스크 체크인
export async function POST(req: Request) {
  const { eventId, unitNumber } = await req.json()

  if (!eventId || !unitNumber) {
    return NextResponse.json({ error: '동호수를 입력해주세요.' }, { status: 400 })
  }

  const { rows } = await db.execute({
    sql: 'SELECT * FROM reservations WHERE event_id = ? AND unit_number = ? AND checked_in = 0',
    args: [eventId, unitNumber],
  })

  if (rows.length === 0) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
  }

  const reservation = rows[0]
  await db.execute({
    sql: 'UPDATE reservations SET checked_in = 1, checked_in_at = datetime("now") WHERE id = ?',
    args: [reservation.id],
  })

  return NextResponse.json({ success: true, reservation })
}
