import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const [
      totalEvents,
      activeEvents,
      totalReservations,
      confirmedReservations,
      checkedInReservations,
      cancelledReservations,
      todayReservations,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: "ACTIVE" } }),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "CONFIRMED" } }),
      prisma.reservation.count({ where: { status: "CHECKED_IN" } }),
      prisma.reservation.count({ where: { status: "CANCELLED" } }),
      prisma.reservation.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const [recentReservations, ongoingEvents] = await Promise.all([
      prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { event: true, timeSlot: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.event.findMany({
        where: { status: "ACTIVE" },
        include: { _count: { select: { reservations: true } } },
        take: 5,
        orderBy: { startDate: "asc" },
      }),
    ]);

    return NextResponse.json({
      totalEvents,
      activeEvents,
      totalReservations,
      confirmedReservations,
      checkedInReservations,
      cancelledReservations,
      todayReservations,
      recentReservations,
      ongoingEvents,
    });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
