import { NextResponse } from 'next/server'

// DB 연결 없이 환경변수만 체크하는 진단 엔드포인트
export async function GET() {
  const checks = {
    TURSO_URL: !!process.env.TURSO_URL,
    TURSO_TOKEN: !!process.env.TURSO_TOKEN,
    JWT_SECRET: !!process.env.JWT_SECRET,
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  }

  const allOk = checks.TURSO_URL && checks.TURSO_TOKEN && checks.JWT_SECRET

  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 503 })
}
