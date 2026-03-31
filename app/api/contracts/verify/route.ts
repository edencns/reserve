import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST: 계약서 조회 (전화번호 끝 4자리 + 비밀번호)
export async function POST(req: Request) {
  const { phoneLast4, password } = await req.json()

  if (!phoneLast4 || !password) {
    return NextResponse.json({ error: '전화번호 끝 4자리와 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  const { rows } = await db.execute({
    sql: 'SELECT * FROM contract_uploads WHERE phone_last4 = ? ORDER BY uploaded_at DESC',
    args: [phoneLast4],
  })

  // bcrypt로 비밀번호 검증 (브루트포스 방지: 첫 번째 매칭만)
  for (const row of rows) {
    const match = await bcrypt.compare(password, row.password_hash as string)
    if (match) {
      // 파일 URL은 서버에서만 접근 가능한 경우 서명된 URL 생성 필요
      return NextResponse.json({
        id: row.id,
        eventTitle: row.event_title,
        customerName: row.customer_name,
        fileName: row.file_name,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        uploadedAt: row.uploaded_at,
      })
    }
  }

  return NextResponse.json({ error: '일치하는 계약서를 찾을 수 없습니다.' }, { status: 404 })
}
