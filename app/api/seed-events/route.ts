import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { randomUUID } from 'crypto'

const SEED_EVENTS = [
  {
    slug: 'the-lumina-oct',
    title: 'The Lumina 입주박람회',
    description: '더 루미나 아파트 입주자를 위한 특별 박람회입니다. 가구, 가전, 인테리어 업체가 한자리에!',
    venue: 'The Lumina',
    address: '서울시 강남구 테헤란로 123',
    image_url: 'https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3NDYxNzgxMnww&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['2026-10-12', '2026-10-13', '2026-10-14'],
    start_time: '10:00', end_time: '18:00',
    time_slots: [
      { id: 't1', time: '10:00' }, { id: 't2', time: '11:00' }, { id: 't3', time: '13:00' },
      { id: 't4', time: '14:00' }, { id: 't5', time: '15:00' }, { id: 't6', time: '16:00' }, { id: 't7', time: '17:00' },
    ],
    custom_fields: [
      { id: 'f1', key: 'unitNumber', label: '동호수', type: 'text', placeholder: '예: 101동 1001호', required: true },
      { id: 'f2', key: 'moveInDate', label: '입주 예정일', type: 'text', placeholder: 'YYYY-MM-DD', required: false },
      { id: 'f3', key: 'interests', label: '관심 분야', type: 'multiselect', options: ['가구', '가전', '인테리어', '커튼/블라인드', '조명'], required: false },
    ],
    vendor_categories: [
      { id: 'cat-0', name: '가구' }, { id: 'cat-1', name: '에어컨/냉난방' }, { id: 'cat-2', name: '이사' },
      { id: 'cat-3', name: '전동커튼/블라인드' }, { id: 'cat-4', name: '인테리어' }, { id: 'cat-5', name: '조명' },
    ],
    vendors: [
      { id: 'v1', name: '프리미엄 가구', category: '가구', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
      { id: 'v2', name: '쿨에어 시스템', category: '에어컨/냉난방', imageUrl: 'https://images.unsplash.com/photo-1631083215283-b7a8e55d2adf?w=400&q=80' },
      { id: 'v3', name: '스마트이사', category: '이사', imageUrl: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&q=80' },
      { id: 'v4', name: '모던커튼', category: '전동커튼/블라인드', imageUrl: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=400&q=80' },
      { id: 'v6', name: '하우스인테리어', category: '인테리어', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
      { id: 'v7', name: '루미나조명', category: '조명', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80' },
    ],
    status: 'active', created_at: '2026-03-01T00:00:00Z',
  },
  {
    slug: 'oasis-heights-oct',
    title: 'Oasis Heights 입주박람회',
    description: '프리미엄 아파트 입주자를 위한 맞춤형 박람회',
    venue: 'Oasis Heights 커뮤니티 센터',
    address: '서울시 서초구 서초대로 456',
    image_url: 'https://images.unsplash.com/photo-1690489965043-ec15758cce71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzc0Njk1MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['2026-10-20', '2026-10-21', '2026-10-22'],
    start_time: '10:00', end_time: '18:00',
    time_slots: [
      { id: 't1', time: '10:00' }, { id: 't2', time: '11:30' }, { id: 't3', time: '13:00' },
      { id: 't4', time: '14:30' }, { id: 't5', time: '16:00' }, { id: 't6', time: '17:30' },
    ],
    custom_fields: [
      { id: 'f1', key: 'unitNumber', label: '동호수', type: 'text', placeholder: '예: 201동 2001호', required: true },
    ],
    vendor_categories: [
      { id: 'cat-0', name: '가구' }, { id: 'cat-1', name: '전동커튼/블라인드' },
      { id: 'cat-2', name: '욕실/위생' }, { id: 'cat-3', name: '인테리어' }, { id: 'cat-4', name: '주방가전' },
    ],
    vendors: [
      { id: 'v1', name: '프리미엄 가구', category: '가구' },
      { id: 'v4', name: '모던커튼', category: '전동커튼/블라인드' },
      { id: 'v5', name: '욕실플러스', category: '욕실/위생' },
      { id: 'v6', name: '하우스인테리어', category: '인테리어' },
      { id: 'v8', name: '키친마스터', category: '주방가전' },
    ],
    status: 'active', created_at: '2026-03-05T00:00:00Z',
  },
  {
    slug: 'vertex-lofts-nov',
    title: 'Vertex Lofts 입주박람회',
    description: '모던 로프트 스타일 아파트 입주 준비',
    venue: 'Vertex Lofts 루프탑 라운지',
    address: '서울시 마포구 월드컵북로 789',
    image_url: 'https://images.unsplash.com/photo-1664813954641-1ffcb7b55fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzQ2NDQ5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['2026-11-05', '2026-11-06', '2026-11-07'],
    start_time: '10:00', end_time: '17:00',
    time_slots: [
      { id: 't1', time: '10:00' }, { id: 't2', time: '11:00' }, { id: 't3', time: '13:00' },
      { id: 't4', time: '14:00' }, { id: 't5', time: '15:00' }, { id: 't6', time: '16:00' },
    ],
    custom_fields: [
      { id: 'f1', key: 'unitNumber', label: '호수', type: 'text', placeholder: '예: 301호', required: true },
    ],
    vendor_categories: [], vendors: [],
    status: 'active', created_at: '2026-03-10T00:00:00Z',
  },
  {
    slug: 'skyline-residence-nov',
    title: 'Skyline Residence 입주박람회',
    description: '스카이라인 레지던스 입주자를 위한 프리미엄 박람회',
    venue: 'Skyline Residence 컨벤션홀',
    address: '서울시 송파구 올림픽로 333',
    image_url: 'https://images.unsplash.com/photo-1648502298359-055a3f374705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjB0b3dlcnxlbnwxfHx8fDE3NzQ3MTA0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['2026-11-15', '2026-11-16'],
    start_time: '10:00', end_time: '18:00',
    time_slots: [
      { id: 't1', time: '10:00' }, { id: 't2', time: '12:00' },
      { id: 't3', time: '14:00' }, { id: 't4', time: '16:00' },
    ],
    custom_fields: [
      { id: 'f1', key: 'unitNumber', label: '동호수', type: 'text', placeholder: '예: 401동 4001호', required: true },
    ],
    vendor_categories: [], vendors: [],
    status: 'active', created_at: '2026-03-15T00:00:00Z',
  },
  {
    slug: 'urban-park-nov',
    title: 'Urban Park 입주박람회',
    description: '어반 파크 아파트 입주자들을 위한 특별 이벤트',
    venue: 'Urban Park 주민센터',
    address: '서울시 용산구 한강대로 777',
    image_url: 'https://images.unsplash.com/photo-1760561148422-bbb515696fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZmFjYWRlfGVufDF8fHx8MTc3NDYxNzU1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['2026-11-25', '2026-11-26', '2026-11-27'],
    start_time: '10:00', end_time: '18:00',
    time_slots: [
      { id: 't1', time: '10:00' }, { id: 't2', time: '11:30' }, { id: 't3', time: '13:00' },
      { id: 't4', time: '14:30' }, { id: 't5', time: '16:00' },
    ],
    custom_fields: [
      { id: 'f1', key: 'unitNumber', label: '동호수', type: 'text', placeholder: '예: 501동 5001호', required: true },
    ],
    vendor_categories: [], vendors: [],
    status: 'active', created_at: '2026-03-20T00:00:00Z',
  },
]

// POST: 관리자 전용 - 기존 mockData 이벤트를 DB에 시딩
export async function POST() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  const results: string[] = []
  for (const e of SEED_EVENTS) {
    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO events
          (id, slug, title, description, venue, address, image_url, dates, start_time, end_time,
           time_slots, custom_fields, vendor_categories, vendors, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomUUID(), e.slug, e.title, e.description, e.venue, e.address, e.image_url,
          JSON.stringify(e.dates), e.start_time, e.end_time,
          JSON.stringify(e.time_slots), JSON.stringify(e.custom_fields),
          JSON.stringify(e.vendor_categories), JSON.stringify(e.vendors),
          e.status, e.created_at,
        ],
      })
      results.push(`✅ ${e.title}`)
    } catch (err) {
      results.push(`⚠️ ${e.title}: ${err}`)
    }
  }

  return NextResponse.json({ ok: true, results })
}
