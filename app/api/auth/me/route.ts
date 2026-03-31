import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/mockData'

export async function GET() {
  const user = getCurrentUser()
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({ user })
}
