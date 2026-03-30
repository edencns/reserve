import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/kiosk/lookup?unit=101동+1001호&eventId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get("unit")?.trim();
  const eventId = searchParams.get("eventId")?.trim();

  if (!unit) {
    return NextResponse.json({ error: "동호수를 입력해주세요" }, { status: 400 });
  }

  const where: Record<string, unknown> = {
    unitAddress: unit,
    status: { in: ["CONFIRMED", "CHECKED_IN"] },
  };
  if (eventId) where.eventId = eventId;

  const reservation = await prisma.reservation.findFirst({
    where,
    include: { event: true, timeSlot: true },
    orderBy: { createdAt: "desc" },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "해당 동호수의 예약을 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ticketNumber: reservation.ticketNumber });
}
