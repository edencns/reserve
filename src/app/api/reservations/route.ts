import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { generateTicketNumber } from "@/lib/ticket";
import { generateQRCode, getTicketUrl } from "@/lib/qrcode";
import { reservationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = reservationSchema.safeParse({
      ...body,
      partySize: Number(body.partySize),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { eventId, timeSlotId, name, phone, email, address, partySize, privacyConsent, marketingConsent } = result.data;

    // Check timeslot availability
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!timeSlot) {
      return NextResponse.json({ error: "시간대를 찾을 수 없습니다" }, { status: 404 });
    }

    if (timeSlot.currentCount + partySize > timeSlot.maxCapacity) {
      return NextResponse.json(
        { error: "선택한 시간대의 예약이 마감되었습니다" },
        { status: 409 }
      );
    }

    // Check event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "행사를 찾을 수 없습니다" }, { status: 404 });
    }

    // Generate ticket
    const ticketNumber = generateTicketNumber();
    const ticketUrl = getTicketUrl(ticketNumber);
    const qrCode = await generateQRCode(ticketUrl);

    // Encrypt personal info
    const encryptedName = encrypt(name);
    const encryptedPhone = encrypt(phone);
    const encryptedEmail = encrypt(email);
    const encryptedAddress = address ? encrypt(address) : null;

    // Create reservation and update timeslot count in transaction
    const reservation = await prisma.$transaction(async (tx) => {
      const res = await tx.reservation.create({
        data: {
          ticketNumber,
          eventId,
          timeSlotId,
          name: encryptedName,
          phone: encryptedPhone,
          email: encryptedEmail,
          address: encryptedAddress,
          partySize,
          qrCode,
          privacyConsent,
          marketingConsent: marketingConsent ?? false,
          status: "CONFIRMED",
        },
        include: {
          event: true,
          timeSlot: true,
        },
      });

      await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { currentCount: { increment: partySize } },
      });

      return res;
    });

    return NextResponse.json(
      {
        ticketNumber: reservation.ticketNumber,
        message: "예약이 완료되었습니다",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation POST error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
