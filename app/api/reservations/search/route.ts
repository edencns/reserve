import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// 본인 예약 조회 (공개) - 전화번호 + 이름 둘 다 일치해야 반환.
// 단순히 전화번호만으로 조회 가능하면 무작위 번호 enumeration 으로 PII 노출 위험.
export async function POST(req: Request) {
  const ip = getClientIp(req)

  // IP 기반 rate limit (10분에 20회)
  const ipRl = rateLimit({ key: `res-search:ip:${ip}`, windowMs: 10 * 60 * 1000, max: 20 })
  if (!ipRl.ok) {
    return NextResponse.json(
      { error: `조회 횟수 초과. ${ipRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  let body: { phone?: string; name?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const phone = body.phone?.trim() ?? ''
  const name = body.name?.trim() ?? ''

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: '전화번호를 입력해주세요.' }, { status: 400 })
  }
  if (!name || name.length < 2 || name.length > 50) {
    return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 })
  }

  // 전화번호 기반 추가 rate limit (10분에 5회) - enumeration 차단
  const phoneRl = rateLimit({
    key: `res-search:phone:${phone.replace(/\D/g, '')}`,
    windowMs: 10 * 60 * 1000,
    max: 5,
  })
  if (!phoneRl.ok) {
    return NextResponse.json(
      { error: `조회 횟수 초과. ${phoneRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  try {
    // 전화번호 + 이름 모두 일치해야 본인으로 간주
    const { rows } = await db.execute({
      sql: 'SELECT id, event_id, event_title, venue, address, date, time, attendee_count, customer_name, unit_number, checked_in, created_at FROM reservations WHERE customer_phone = ? AND customer_name = ? ORDER BY created_at DESC',
      args: [phone, name],
    })

    // 응답에서 민감 필드(이메일, 전체 전화번호, 관심사) 제외 + 전화번호는 마스킹
    const safe = rows.map((r) => ({
      id: r.id,
      event_id: r.event_id,
      event_title: r.event_title,
      venue: r.venue,
      address: r.address,
      date: r.date,
      time: r.time,
      attendee_count: r.attendee_count,
      customer_name: r.customer_name,
      customer_phone_masked: maskPhone(phone),
      unit_number: r.unit_number,
      checked_in: r.checked_in,
      created_at: r.created_at,
    }))

    return NextResponse.json(safe)
  } catch (err) {
    console.error('[reservations/search] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

function maskPhone(p: string) {
  const digits = p.replace(/\D/g, '')
  if (digits.length < 8) return '***'
  return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`
}
