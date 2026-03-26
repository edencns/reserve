import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";
import { decrypt, maskPhone, maskEmail } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where = {
      ...(eventId ? { eventId } : {}),
      ...(status ? { status } : {}),
    };

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: { event: true, timeSlot: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.reservation.count({ where }),
    ]);

    const decryptedReservations = reservations.map((r) => ({
      ...r,
      name: decrypt(r.name),
      phone: maskPhone(decrypt(r.phone)),
      email: maskEmail(decrypt(r.email)),
      address: r.address ? decrypt(r.address) : null,
    }));

    return NextResponse.json({
      reservations: decryptedReservations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Admin reservations GET error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
