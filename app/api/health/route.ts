import { NextResponse } from 'next/server'

// 단순 헬스체크 - 환경변수 정보 노출 금지
export async function GET() {
  return NextResponse.json({ ok: true })
}
