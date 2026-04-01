import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST: 키오스크 체크인
export async function POST(req: Request) {
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
    // checked_in = 0 조건을 UPDATE에 직접 포함하여 동시 체크인 방지
    const result = await db.execute({
      sql: `UPDATE reservations
            SET checked_in = 1, checked_in_at = datetime('now')
            WHERE event_id = ? AND unit_number = ? AND checked_in = 0`,
      args: [eventId, unitNumber],
    })

    if (result.rowsAffected === 0) {
      // 이미 체크인했거나 예약이 없는 경우
      const { rows } = await db.execute({
        sql: 'SELECT checked_in FROM reservations WHERE event_id = ? AND unit_number = ?',
        args: [eventId, unitNumber],
      })

      if (rows.length > 0 && rows[0].checked_in) {
        return NextResponse.json({ error: '이미 체크인된 예약입니다.' }, { status: 409 })
      }
      return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 체크인된 예약 정보 조회
    const { rows } = await db.execute({
      sql: 'SELECT id, customer_name FROM reservations WHERE event_id = ? AND unit_number = ? AND checked_in = 1',
      args: [eventId, unitNumber],
    })

    return NextResponse.json({ success: true, reservation: rows[0] })
  } catch (err) {
    console.error('[checkin] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
