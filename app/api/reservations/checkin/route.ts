import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// POST: 키오스크 체크인 - staff 또는 admin 세션 필요
export async function POST(req: Request) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'staff')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
  }

  const ip = getClientIp(req)

  // IP 기반 rate limit (1분에 60회 - 키오스크는 빠른 입력이 정상 패턴)
  const ipRl = rateLimit({ key: `checkin:ip:${ip}`, windowMs: 60 * 1000, max: 60 })
  if (!ipRl.ok) {
    return NextResponse.json(
      { error: `요청 횟수 초과. ${ipRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  let body: { eventId?: string; unitNumber?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { eventId, unitNumber } = body

  if (!eventId || !unitNumber) {
    return NextResponse.json({ error: '동호수를 입력해주세요.' }, { status: 400 })
  }

  // 입력값 길이 제한
  if (eventId.length > 100 || unitNumber.length > 50) {
    return NextResponse.json({ error: '입력값이 너무 깁니다.' }, { status: 400 })
  }

  try {
    // 원자적 UPDATE: SELECT → UPDATE 사이 레이스컨디션 제거
    const result = await db.execute({
      sql: `UPDATE reservations
            SET checked_in = 1, checked_in_at = datetime('now')
            WHERE event_id = ? AND unit_number = ? AND checked_in = 0`,
      args: [eventId, unitNumber],
    })

    if (result.rowsAffected === 0) {
      const { rows } = await db.execute({
        sql: 'SELECT checked_in FROM reservations WHERE event_id = ? AND unit_number = ?',
        args: [eventId, unitNumber],
      })

      if (rows.length > 0 && rows[0].checked_in) {
        return NextResponse.json({ error: '이미 체크인된 예약입니다.' }, { status: 409 })
      }
      return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
    }

    const { rows } = await db.execute({
      sql: 'SELECT id, customer_name, customer_phone, event_title, venue, date, time, unit_number, ticket_type FROM reservations WHERE event_id = ? AND unit_number = ? AND checked_in = 1',
      args: [eventId, unitNumber],
    })

    return NextResponse.json({ success: true, reservation: rows[0] })
  } catch (err) {
    console.error('[checkin] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
