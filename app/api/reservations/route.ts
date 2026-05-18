import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { randomUUID } from 'crypto'

// GET: 예약 목록 (관리자 전용)
export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  try {
    const { rows } = await db.execute('SELECT * FROM reservations ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[reservations] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// POST: 예약 생성 (공개) - IP 기반 rate limit
export async function POST(req: Request) {
  const ip = getClientIp(req)

  // IP 기반 rate limit (10분에 10회)
  const ipRl = rateLimit({ key: `reservations:ip:${ip}`, windowMs: 10 * 60 * 1000, max: 10 })
  if (!ipRl.ok) {
    return NextResponse.json(
      { error: `예약 횟수 초과. ${ipRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const {
    eventId, eventTitle, venue, address, date, time,
    customerName, customerPhone, customerEmail,
    unitNumber, interests, attendeeCount, ticketType,
  } = body as Record<string, string | number | undefined>

  if (!eventId || !customerName || !customerPhone || !unitNumber) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
  }

  // 서버사이드 입력값 검증
  const name = String(customerName)
  const phone = String(customerPhone)
  const unit = String(unitNumber)

  if (name.length > 50 || !/^[가-힣a-zA-Z\s\-]{2,50}$/.test(name)) {
    return NextResponse.json({ error: '이름 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  if (!/^010-\d{4}-\d{4}$/.test(phone)) {
    return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  if (unit.length > 50) {
    return NextResponse.json({ error: '동호수가 너무 깁니다.' }, { status: 400 })
  }

  if (customerEmail && String(customerEmail).length > 200) {
    return NextResponse.json({ error: '이메일이 너무 깁니다.' }, { status: 400 })
  }

  const count = Number(attendeeCount) || 1
  if (count < 1 || count > 20) {
    return NextResponse.json({ error: '참석 인원은 1~20명이어야 합니다.' }, { status: 400 })
  }

  const ticketTypeVal = ticketType === 'member' ? 'member' : 'general'

  try {
    // ensure ticket_type column exists (migration for existing DBs)
    try {
      await db.execute(`ALTER TABLE reservations ADD COLUMN ticket_type TEXT DEFAULT 'general'`)
    } catch { /* column already exists */ }

    const id = randomUUID()
    await db.execute({
      sql: `INSERT INTO reservations
        (id, event_id, event_title, venue, address, date, time, attendee_count,
         customer_name, customer_phone, customer_email, unit_number, interests, ticket_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        String(eventId).slice(0, 100),
        String(eventTitle ?? '').slice(0, 200),
        String(venue ?? '').slice(0, 200),
        String(address ?? '').slice(0, 300),
        String(date ?? '').slice(0, 20),
        String(time ?? '').slice(0, 20),
        count, name, phone,
        String(customerEmail ?? '').slice(0, 200),
        unit,
        String(interests ?? '').slice(0, 500),
        ticketTypeVal,
      ],
    })

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('[reservations] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
