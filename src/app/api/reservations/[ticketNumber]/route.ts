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
      include: {
        event: true,
        timeSlot: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다" }, { status: 404 });
    }

    // Decrypt and mask personal info
    const name = decrypt(reservation.name);
    const phone = maskPhone(decrypt(reservation.phone));
    const email = maskEmail(decrypt(reservation.email));

    // Mask address: show only first part before city-level detail
    const rawAddress = reservation.address ? decrypt(reservation.address) : null
    const maskedAddress = rawAddress
      ? rawAddress.slice(0, Math.min(6, rawAddress.length)) + '***'
      : null

    return NextResponse.json({
      ...reservation,
      name,
      phone,
      email,
      address: maskedAddress,
    });
  } catch (error) {
    console.error("Reservation GET error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
