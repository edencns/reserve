import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { put } from '@vercel/blob'

// GET: 계약서 목록 (관리자 전용)
export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  const { rows } = await db.execute('SELECT * FROM contract_uploads ORDER BY uploaded_at DESC')
  return NextResponse.json(rows)
}

// POST: 계약서 업로드 (공개)
export async function POST(req: Request) {
  const formData = await req.formData()

  const eventId = formData.get('eventId') as string
  const eventTitle = formData.get('eventTitle') as string
  const customerName = formData.get('customerName') as string
  const customerPhone = formData.get('customerPhone') as string
  const password = formData.get('password') as string
  const file = formData.get('file') as File | null

  if (!eventId || !customerName || !customerPhone || !password || !file) {
    return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 })
  }

  // 서버사이드 MIME 타입 검증
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'PDF, JPG, PNG 파일만 업로드 가능합니다.' }, { status: 400 })
  }

  // 파일 크기 검증 (20MB)
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: '파일 크기는 20MB 이하여야 합니다.' }, { status: 400 })
  }

  // 서버사이드 입력값 검증
  if (customerName.length > 50 || !/^[가-힣a-zA-Z\s\-]{2,50}$/.test(customerName)) {
    return NextResponse.json({ error: '이름 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  if (password.length < 4 || password.length > 100) {
    return NextResponse.json({ error: '비밀번호는 4자 이상이어야 합니다.' }, { status: 400 })
  }

  const phoneDigits = customerPhone.replace(/\D/g, '')
  const phoneLast4 = phoneDigits.slice(-4)

  if (!/^\d{4}$/.test(phoneLast4)) {
    return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12)

    // Vercel Blob에 파일 저장
    const blobFilename = `contracts/${randomUUID()}-${file.name}`
    const blob = await put(blobFilename, file, { access: 'public' })

    const id = randomUUID()
    await db.execute({
      sql: `INSERT INTO contract_uploads
        (id, event_id, event_title, customer_name, phone_last4, password_hash, file_url, file_name, file_size, mime_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, String(eventId).slice(0, 100), String(eventTitle).slice(0, 200), customerName, phoneLast4, passwordHash, blob.url, file.name, file.size, file.type],
    })

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('[contract-upload] error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
