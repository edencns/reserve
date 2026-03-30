import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt, maskPhone, maskEmail } from "@/lib/encryption";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { ticketNumber },
      include: { event: true, timeSlot: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다" }, { status: 404 });
    }

    const name = decrypt(reservation.name);
    const phone = maskPhone(decrypt(reservation.phone));
    const email = maskEmail(decrypt(reservation.email));

    return NextResponse.json({
      ...reservation,
      name,
      phone,
      email,
      address: reservation.address ? decrypt(reservation.address) : null,
    });
  } catch (error) {
    console.error("Kiosk GET error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber } = await params;

    // Atomic check-in: updateMany with status condition prevents double check-in
    // even when two kiosks process the same ticket simultaneously
    const result = await prisma.reservation.updateMany({
      where: {
        ticketNumber,
        status: "CONFIRMED", // Only succeeds if still CONFIRMED
      },
      data: {
        status: "CHECKED_IN",
        checkedInAt: new Date(),
      },
    });

    if (result.count === 0) {
      // Could be: not found, already checked in, or cancelled
      const reservation = await prisma.reservation.findUnique({
        where: { ticketNumber },
      });

      if (!reservation) {
        return NextResponse.json({ error: "예약을 찾을 수 없습니다" }, { status: 404 });
      }
      if (reservation.status === "CHECKED_IN") {
        return NextResponse.json({ error: "이미 체크인된 예약입니다" }, { status: 409 });
      }
      if (reservation.status === "CANCELLED") {
        return NextResponse.json({ error: "취소된 예약입니다" }, { status: 409 });
      }
      return NextResponse.json({ error: "체크인할 수 없는 예약입니다" }, { status: 409 });
    }

    return NextResponse.json({
      message: "체크인이 완료되었습니다",
      status: "CHECKED_IN",
      checkedInAt: new Date(),
    });
  } catch (error) {
    console.error("Kiosk POST error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
