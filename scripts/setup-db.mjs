import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'

// .env.local 수동 로드
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

async function setup() {
  console.log('🔧 Turso DB 설정 시작...')

  // 1. users 테이블
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  console.log('✅ users 테이블 생성')

  // 2. reservations 테이블
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      venue TEXT,
      address TEXT,
      date TEXT,
      time TEXT,
      attendee_count INTEGER DEFAULT 1,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      unit_number TEXT,
      interests TEXT,
      status TEXT DEFAULT 'confirmed',
      checked_in INTEGER DEFAULT 0,
      checked_in_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  console.log('✅ reservations 테이블 생성')

  // 3. contract_uploads 테이블
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contract_uploads (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      event_title TEXT,
      customer_name TEXT NOT NULL,
      phone_last4 TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      uploaded_at TEXT DEFAULT (datetime('now')),
      verified INTEGER DEFAULT 0
    )
  `)
  console.log('✅ contract_uploads 테이블 생성')

  // 4. audit_logs 테이블
  await db.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  console.log('✅ audit_logs 테이블 생성')

  // 5. 관리자 계정 시딩 (bcrypt 해시)
  const passwordHash = await bcrypt.hash('aaaa4799!', 12)
  await db.execute({
    sql: `INSERT OR IGNORE INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)`,
    args: [randomUUID(), 'ed_cns', passwordHash, 'admin'],
  })
  console.log('✅ 관리자 계정 생성 (ed_cns)')

  console.log('\n🎉 DB 설정 완료!')
  process.exit(0)
}

setup().catch(err => {
  console.error('❌ 오류:', err)
  process.exit(1)
})
