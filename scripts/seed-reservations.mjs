import { createClient } from '@libsql/client'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf-8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
)

const db = createClient({
  url: env.TURSO_URL,
  authToken: env.TURSO_TOKEN,
})

const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '홍']
const firstNames = ['민준', '서연', '도윤', '서아', '시우', '지아', '주원', '하은', '예준', '하린', '지호', '지우', '현우', '수아', '지민', '채원', '준서', '수빈', '재원', '다은', '민재', '아린', '현준', '지윤', '건우', '나은', '유준', '예은', '동현', '지은']

const events = [
  { id: 'evt-gangnam-2024', title: '강남 래미안 입주박람회', venue: '강남구 문화센터', address: '서울 강남구 테헤란로 123', date: '2024-05-15', time: '10:00' },
  { id: 'evt-songpa-2024', title: '송파 헬리오시티 입주박람회', venue: '올림픽공원 KSPO돔', address: '서울 송파구 올림픽로 424', date: '2024-06-20', time: '10:00' },
  { id: 'evt-mapo-2024', title: '마포 공덕 파크자이 입주박람회', venue: '마포문화재단', address: '서울 마포구 월드컵북로 400', date: '2024-07-10', time: '11:00' },
  { id: 'evt-seocho-2024', title: '서초 반포 래미안 원베일리 입주박람회', venue: '서초문화예술회관', address: '서울 서초구 남부순환로 2374', date: '2024-08-03', time: '10:00' },
  { id: 'evt-dongtan-2025', title: '동탄2 힐스테이트 입주박람회', venue: '동탄복합문화센터', address: '경기 화성시 동탄대로 537', date: '2025-02-14', time: '10:00' },
]

const interestOptions = [
  '인테리어', '가전', '가구', '이사', 'A/S', '청소', '보안', '인터넷',
  '인테리어,가전', '가전,가구', '인테리어,가구,이사', '이사,청소',
  '', '', '', // 일부는 선택 안 함
]

const statuses = ['confirmed', 'confirmed', 'confirmed', 'confirmed', 'cancelled']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone() {
  const mid = String(Math.floor(Math.random() * 9000) + 1000)
  const end = String(Math.floor(Math.random() * 9000) + 1000)
  return `010-${mid}-${end}`
}

function randomUnit() {
  const dong = Math.floor(Math.random() * 20) + 101
  const ho = Math.floor(Math.random() * 30) + 1
  const floor = Math.floor(Math.random() * 25) + 1
  return `${dong}동 ${floor}층 ${dong * 100 + ho}호`
}

function randomDate(start, end) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  const d = new Date(s + Math.random() * (e - s))
  return d.toISOString().replace('T', ' ').substring(0, 19)
}

async function seed() {
  console.log('🌱 예약 데이터 1000개 삽입 시작...')

  const BATCH = 50
  let inserted = 0

  for (let i = 0; i < 1000; i += BATCH) {
    const statements = []
    for (let j = 0; j < BATCH && i + j < 1000; j++) {
      const event = randomItem(events)
      const name = randomItem(lastNames) + randomItem(firstNames)
      const phone = randomPhone()
      const email = `user${i + j + 1}@example.com`
      const unit = randomUnit()
      const interests = randomItem(interestOptions)
      const status = randomItem(statuses)
      const checkedIn = status === 'confirmed' && Math.random() > 0.5 ? 1 : 0
      const checkedInAt = checkedIn ? randomDate('2024-05-01', '2025-03-01') : null
      const createdAt = randomDate('2024-03-01', '2025-03-01')

      statements.push({
        sql: `INSERT INTO reservations
          (id, event_id, event_title, venue, address, date, time, attendee_count,
           customer_name, customer_phone, customer_email, unit_number, interests,
           status, checked_in, checked_in_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomUUID(),
          event.id, event.title, event.venue, event.address, event.date, event.time,
          Math.floor(Math.random() * 3) + 1,
          name, phone, email, unit, interests,
          status, checkedIn, checkedInAt, createdAt,
        ],
      })
    }

    await db.batch(statements)
    inserted += statements.length
    process.stdout.write(`\r  ${inserted}/1000 삽입 완료`)
  }

  console.log('\n✅ 완료!')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ 오류:', err)
  process.exit(1)
})
