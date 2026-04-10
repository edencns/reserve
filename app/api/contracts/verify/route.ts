import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

// POST: 계약서 조회 (전화번호 끝 4자리 + 비밀번호)
export async function POST(req: Request) {
  const ip = getClientIp(req)

  // IP 기반 rate limit (10분에 20회) - 무차별 brute force 방지
  const ipRl = rateLimit({ key: `contract-verify:ip:${ip}`, windowMs: 10 * 60 * 1000, max: 20 })
  if (!ipRl.ok) {
    return NextResponse.json(
      { error: `시도 횟수 초과. ${ipRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  let body: { phoneLast4?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { phoneLast4, password } = body

  if (!phoneLast4 || !password) {
    return NextResponse.json({ error: '전화번호 끝 4자리와 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  if (!/^\d{4}$/.test(phoneLast4)) {
    return NextResponse.json({ error: '전화번호 끝 4자리는 숫자 4자리여야 합니다.' }, { status: 400 })
  }

  if (password.length > 100) {
    return NextResponse.json({ error: '비밀번호가 너무 깁니다.' }, { status: 400 })
  }

  // 전화번호 끝4자리 기반 rate limit (10분에 10회) - 사용자 계정 lockout
  const phoneRl = rateLimit({
    key: `contract-verify:phone:${phoneLast4}`,
    windowMs: 10 * 60 * 1000,
    max: 10,
  })
  if (!phoneRl.ok) {
    return NextResponse.json(
      { error: `시도 횟수 초과. ${phoneRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM contract_uploads WHERE phone_last4 = ? ORDER BY uploaded_at DESC',
      args: [phoneLast4],
    })

    for (const row of rows) {
      const match = await bcrypt.compare(password, row.password_hash as string)
      if (match) {
        // 성공 시 해당 phoneLast4 lock 해제
        resetRateLimit(`contract-verify:phone:${phoneLast4}`)
        return NextResponse.json({
          id: row.id,
          eventTitle: row.event_title,
          customerName: row.customer_name,
          fileName: row.file_name,
          fileSize: row.file_size,
          mimeType: row.mime_type,
          fileUrl: row.file_url,
          uploadedAt: row.uploaded_at,
        })
      }
    }

    return NextResponse.json({ error: '일치하는 계약서를 찾을 수 없습니다.' }, { status: 404 })
  } catch (err) {
    console.error('[contract-verify] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
