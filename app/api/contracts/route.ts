import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
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

// POST: 계약서 업로드 (공개) - IP/전화번호 기반 rate limit
export async function POST(req: Request) {
  const ip = getClientIp(req)

  // IP 기반 rate limit (10분에 10회 - 파일 업로드 비용 큼)
  const ipRl = rateLimit({ key: `contracts:ip:${ip}`, windowMs: 10 * 60 * 1000, max: 10 })
  if (!ipRl.ok) {
    return NextResponse.json(
      { error: `업로드 횟수 초과. ${ipRl.retryAfterMinutes}분 후 다시 시도해주세요.` },
      { status: 429 },
    )
  }

  const formData = await req.formData()

  const eventId = formData.get('eventId') as string
  const eventTitle = formData.get('eventTitle') as string
  const customerName = formData.get('customerName') as string
  const customerPhone = formData.get('customerPhone') as string
  const password = formData.get('password') as string
  const files = formData.getAll('file').filter((f): f is File => f instanceof File)

  if (!eventId || !customerName || !customerPhone || !password || files.length === 0) {
    return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 })
  }

  // 파일 개수 제한
  if (files.length > 20) {
    return NextResponse.json({ error: '한 번에 최대 20개까지 업로드 가능합니다.' }, { status: 400 })
  }

  // 서버사이드 MIME 타입 / 크기 검증
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  for (const f of files) {
    if (!allowedTypes.includes(f.type)) {
      return NextResponse.json({ error: `PDF, JPG, PNG 파일만 업로드 가능합니다. (${f.name})` }, { status: 400 })
    }
    if (f.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: `파일 크기는 20MB 이하여야 합니다. (${f.name})` }, { status: 400 })
    }
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
    const ids: string[] = []

    for (const file of files) {
      const blobFilename = `contracts/${randomUUID()}-${file.name}`
      const blob = await put(blobFilename, file, { access: 'public' })

      const id = randomUUID()
      await db.execute({
        sql: `INSERT INTO contract_uploads
          (id, event_id, event_title, customer_name, phone_last4, password_hash, file_url, file_name, file_size, mime_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [id, String(eventId).slice(0, 100), String(eventTitle).slice(0, 200), customerName, phoneLast4, passwordHash, blob.url, file.name, file.size, file.type],
      })
      ids.push(id)
    }

    return NextResponse.json({ success: true, ids, count: ids.length })
  } catch (err) {
    console.error('[contract-upload] error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
