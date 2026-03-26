import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    // Last 6 months
    const months: { label: string; reservations: number; visitors: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const [reservations, visitors] = await Promise.all([
        prisma.reservation.count({
          where: { createdAt: { gte: start, lte: end }, status: { not: "CANCELLED" } },
        }),
        prisma.reservation.count({
          where: { checkedInAt: { gte: start, lte: end } },
        }),
      ]);

      months.push({
        label: `${d.getMonth() + 1}월`,
        reservations,
        visitors,
      });
    }

    // Time slot stats (reservations by hour)
    const checkedIn = await prisma.reservation.findMany({
      where: { status: "CHECKED_IN" },
      include: { timeSlot: { select: { startTime: true } } },
    });

    const timeMap: Record<string, number> = {};
    for (const r of checkedIn) {
      const hour = r.timeSlot.startTime;
      timeMap[hour] = (timeMap[hour] || 0) + 1;
    }

    const timeStats = Object.entries(timeMap)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));

    // Event stats
    const events = await prisma.event.findMany({
      include: {
        _count: { select: { reservations: true } },
        reservations: { where: { status: "CHECKED_IN" }, select: { id: true } },
        timeSlots: { select: { maxCapacity: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const eventStats = events.map((e) => {
      const totalCap = e.timeSlots.reduce((s, t) => s + t.maxCapacity, 0);
      return {
        id: e.id,
        title: e.title,
        totalCapacity: totalCap || null,
        reservations: e._count.reservations,
        visitors: e.reservations.length,
        visitRate: totalCap > 0
          ? Math.round((e.reservations.length / totalCap) * 100)
          : 0,
      };
    });

    return NextResponse.json({ months, timeStats, eventStats });
  } catch (error) {
    console.error("Monthly stats error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
