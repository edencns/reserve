import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

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

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return null
  return session
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }
  const { id } = await params
  try {
    const { rows } = await db.execute({ sql: 'SELECT * FROM events WHERE id = ?', args: [id] })
    if (rows.length === 0) return NextResponse.json({ error: '이벤트를 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json(parseEvent(rows[0] as Record<string, unknown>))
  } catch (err) {
    console.error('[events/id] GET error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }
  const { id } = await params
  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }
  try {
    await db.execute({
      sql: `UPDATE events SET
        slug = ?, title = ?, description = ?, venue = ?, address = ?,
        image_url = ?, dates = ?, start_time = ?, end_time = ?,
        time_slots = ?, custom_fields = ?, vendor_categories = ?, vendors = ?, status = ?
      WHERE id = ?`,
      args: [
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
        id,
      ],
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[events/id] PUT error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }
  const { id } = await params
  try {
    await db.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [id] })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[events/id] DELETE error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
