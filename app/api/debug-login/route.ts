import { NextResponse } from 'next/server'

// 임시 디버그 엔드포인트 - 배포 후 삭제
export async function GET() {
  const steps: Record<string, unknown> = {}

  // 1. 환경변수
  steps['1_env'] = {
    TURSO_URL: process.env.TURSO_URL ? process.env.TURSO_URL.slice(0, 30) + '...' : 'MISSING',
    TURSO_TOKEN: process.env.TURSO_TOKEN ? 'SET' : 'MISSING',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
  }

  // 2. DB import
  try {
    const { createClient } = await import('@libsql/client')
    steps['2_import'] = 'OK'

    // 3. DB 연결
    try {
      const url = process.env.TURSO_URL!.replace(/^libsql:\/\//, 'https://')
      const db = createClient({ url, authToken: process.env.TURSO_TOKEN! })
      steps['3_connect'] = 'OK'

      // 4. 쿼리
      try {
        const { rows } = await db.execute('SELECT username FROM users LIMIT 1')
        steps['4_query'] = `OK - found ${rows.length} user(s)`
      } catch (e) {
        steps['4_query'] = `FAIL: ${(e as Error).message}`
      }
    } catch (e) {
      steps['3_connect'] = `FAIL: ${(e as Error).message}`
    }
  } catch (e) {
    steps['2_import'] = `FAIL: ${(e as Error).message}`
  }

  // 5. bcryptjs
  try {
    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.hash('test', 10)
    const ok = await bcrypt.compare('test', hash)
    steps['5_bcrypt'] = ok ? 'OK' : 'FAIL'
  } catch (e) {
    steps['5_bcrypt'] = `FAIL: ${(e as Error).message}`
  }

  // 6. jose JWT
  try {
    const { SignJWT, jwtVerify } = await import('jose')
    const secret = new TextEncoder().encode('test-secret')
    const token = await new SignJWT({ test: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret)
    const { payload } = await jwtVerify(token, secret)
    steps['6_jose'] = payload.test === true ? 'OK' : 'FAIL'
  } catch (e) {
    steps['6_jose'] = `FAIL: ${(e as Error).message}`
  }

  return NextResponse.json(steps)
}
