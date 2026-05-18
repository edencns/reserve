import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { randomUUID } from 'crypto'

function parseEvent(row: Record<string, unknown>) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    venue: row.venue ?? '',
    address: row.address ?? '',
    imageUrl: row.image_url ?? '',
    dates: JSON.parse((row.dates as string) || '[]'),
    startTime: row.start_time ?? '',
    endTime: row.end_time ?? '',
    timeSlots: JSON.parse((row.time_slots as string) || '[]'),
    customFields: JSON.parse((row.custom_fields as string) || '[]'),
    vendorCategories: JSON.parse((row.vendor_categories as string) || '[]'),
    vendors: JSON.parse((row.vendors as string) || '[]'),
    status: row.status ?? 'draft',
    createdAt: row.created_at ?? '',
  }
}

// GET: slug로 단일 조회 (공개) 또는 전체 목록 (관리자)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  try {
    if (slug) {
      const { rows } = await db.execute({
        sql: 'SELECT * FROM events WHERE slug = ?',
        args: [slug],
      })
      if (rows.length === 0) return NextResponse.json(null)
      return NextResponse.json(parseEvent(rows[0] as Record<string, unknown>))
    }

    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    const { rows } = await db.execute('SELECT * FROM events ORDER BY created_at DESC')
    return NextResponse.json(rows.map(r => parseEvent(r as Record<string, unknown>)))
  } catch (err) {
    console.error('[events] GET error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// POST: 이벤트 생성 (관리자 전용)
export async function POST(req: Request) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  if (!body.slug || !body.title) {
    return NextResponse.json({ error: '제목과 slug는 필수입니다.' }, { status: 400 })
  }

  const id = randomUUID()
  try {
    await db.execute({
      sql: `INSERT INTO events
        (id, slug, title, description, venue, address, image_url, dates, start_time, end_time, time_slots, custom_fields, vendor_categories, vendors, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        body.slug as string,
        body.title as string,
        (body.description as string) ?? '',
        (body.venue as string) ?? '',
        (body.address as string) ?? '',
        (body.imageUrl as string) ?? null,
        JSON.stringify(body.dates ?? []),
        (body.startTime as string) ?? null,
        (body.endTime as string) ?? null,
        JSON.stringify(body.timeSlots ?? []),
        JSON.stringify(body.customFields ?? []),
        JSON.stringify(body.vendorCategories ?? []),
        JSON.stringify(body.vendors ?? []),
        (body.status as string) ?? 'draft',
      ],
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('[events] POST error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
