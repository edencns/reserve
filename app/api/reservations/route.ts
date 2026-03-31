import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { randomUUID } from 'crypto'

// GET: 예약 목록 (관리자 전용)
export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  const { rows } = await db.execute('SELECT * FROM reservations ORDER BY created_at DESC')
  return NextResponse.json(rows)
}

// POST: 예약 생성 (공개)
export async function POST(req: Request) {
  const body = await req.json()
  const {
    eventId, eventTitle, venue, address, date, time,
    customerName, customerPhone, customerEmail,
    unitNumber, interests, attendeeCount,
  } = body

  if (!eventId || !customerName || !customerPhone || !unitNumber) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
  }

  const id = randomUUID()
  await db.execute({
    sql: `INSERT INTO reservations
      (id, event_id, event_title, venue, address, date, time, attendee_count,
       customer_name, customer_phone, customer_email, unit_number, interests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, eventId, eventTitle, venue ?? '', address ?? '', date ?? '', time ?? '',
      attendeeCount ?? 1, customerName, customerPhone, customerEmail ?? '',
      unitNumber, interests ?? '',
    ],
  })

  return NextResponse.json({ success: true, id })
}
