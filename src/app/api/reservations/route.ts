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
    const interests = body.interests ?? "";

    // Check event exists (outside tx is fine — events don't change during reservation)
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "행사를 찾을 수 없습니다" }, { status: 404 });
    }

    // Generate ticket data before transaction (avoids holding tx open during async ops)
    const ticketNumber = generateTicketNumber();
    const ticketUrl = getTicketUrl(ticketNumber);
    const qrCode = await generateQRCode(ticketUrl);

    const encryptedName = encrypt(name);
    const encryptedPhone = encrypt(phone);
    const encryptedEmail = encrypt(email);
    const encryptedAddress = address ? encrypt(address) : null;

    // Atomic transaction: re-check capacity INSIDE tx to prevent race condition
    let reservation;
    try {
      reservation = await prisma.$transaction(async (tx) => {
        // Re-read timeslot inside transaction for atomic capacity check
        const slot = await tx.timeSlot.findUnique({ where: { id: timeSlotId } });

        if (!slot) {
          throw Object.assign(new Error("시간대를 찾을 수 없습니다"), { code: "NOT_FOUND" });
        }

        if (slot.currentCount + partySize > slot.maxCapacity) {
          throw Object.assign(new Error("선택한 시간대의 예약이 마감되었습니다"), { code: "CAPACITY_EXCEEDED" });
        }

        const res = await tx.reservation.create({
          data: {
            ticketNumber,
            eventId,
            timeSlotId,
            name: encryptedName,
            phone: encryptedPhone,
            email: encryptedEmail,
            address: encryptedAddress,
            interests,
            partySize,
            qrCode,
            privacyConsent,
            marketingConsent: marketingConsent ?? false,
            status: "CONFIRMED",
          },
          include: { event: true, timeSlot: true },
        });

        // Atomic increment — only runs if capacity check passed
        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: { currentCount: { increment: partySize } },
        });

        return res;
      });
    } catch (txError) {
      const err = txError as Error & { code?: string };
      if (err.code === "CAPACITY_EXCEEDED") {
        return NextResponse.json({ error: err.message }, { status: 409 });
      }
      if (err.code === "NOT_FOUND") {
        return NextResponse.json({ error: err.message }, { status: 404 });
      }
      throw txError;
    }

    return NextResponse.json(
      { ticketNumber: reservation.ticketNumber, message: "예약이 완료되었습니다" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation POST error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
