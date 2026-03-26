import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const timeSlots = await prisma.timeSlot.findMany({
      where: { eventId: id },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("TimeSlots GET error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const timeSlot = await prisma.timeSlot.create({
      data: {
        eventId: id,
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        maxCapacity: Number(body.maxCapacity),
      },
    });

    return NextResponse.json(timeSlot, { status: 201 });
  } catch (error) {
    console.error("TimeSlots POST error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
