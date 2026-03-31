import { NextResponse } from 'next/server'
import { logoutUser } from '@/app/mockData'

export async function POST() {
  logoutUser()
  return NextResponse.json({ success: true })
}
