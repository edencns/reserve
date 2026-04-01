import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Rate limiting: 전화번호별 시도 횟수 제한
const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 10
const LOCK_MS = 10 * 60 * 1000 // 10분

// 만료된 항목 정리 (1시간마다)
let lastCleanup = Date.now()
function cleanupAttempts() {
  const now = Date.now()
  if (now - lastCleanup < 60 * 60 * 1000) return
  lastCleanup = now
  for (const [key, val] of attempts) {
    if (val.until > 0 && now > val.until) attempts.delete(key)
    else if (val.until === 0 && val.count > 0) attempts.delete(key)
  }
}

// POST: 계약서 조회 (전화번호 끝 4자리 + 비밀번호)
export async function POST(req: Request) {
  cleanupAttempts()

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

  // 입력값 검증
  if (!/^\d{4}$/.test(phoneLast4)) {
    return NextResponse.json({ error: '전화번호 끝 4자리는 숫자 4자리여야 합니다.' }, { status: 400 })
  }

  if (password.length > 100) {
    return NextResponse.json({ error: '비밀번호가 너무 깁니다.' }, { status: 400 })
  }

  // Rate limiting
  const now = Date.now()
  const record = attempts.get(phoneLast4)
  if (record && now < record.until) {
    const remaining = Math.ceil((record.until - now) / 60000)
    return NextResponse.json(
      { error: `시도 횟수 초과. ${remaining}분 후 다시 시도해주세요.` },
      { status: 429 }
    )
  }

  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM contract_uploads WHERE phone_last4 = ? ORDER BY uploaded_at DESC',
      args: [phoneLast4],
    })

    // bcrypt로 비밀번호 검증
    for (const row of rows) {
      const match = await bcrypt.compare(password, row.password_hash as string)
      if (match) {
        // 성공 시 시도 횟수 초기화
        attempts.delete(phoneLast4)
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

    // 실패 시 시도 횟수 기록
    const prev = attempts.get(phoneLast4) ?? { count: 0, until: 0 }
    const newCount = prev.count + 1
    attempts.set(phoneLast4, {
      count: newCount,
      until: newCount >= MAX_ATTEMPTS ? now + LOCK_MS : 0,
    })

    return NextResponse.json({ error: '일치하는 계약서를 찾을 수 없습니다.' }, { status: 404 })
  } catch (err) {
    console.error('[contract-verify] DB error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
