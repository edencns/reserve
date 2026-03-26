import { prisma } from '@/lib/prisma'

// 개인정보보호법: 목적 달성 후 즉시 파기 원칙
// 행사 종료 후 30일 보관 후 파기

export async function scheduleDataDeletion(reservationId: string, eventEndDate: Date): Promise<void> {
  // 실제 운영에서는 cron job 또는 scheduled job 사용
  // 여기서는 보존 기간 기록
  console.log(`Scheduled deletion for reservation ${reservationId} after ${eventEndDate.toISOString()}`)
}

export async function deleteExpiredPersonalData(): Promise<void> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // 30일 이전 완료된 행사의 개인정보를 익명화
  // 실제로 삭제하지 않고 익명화 (로그 보존 목적)
  const expiredReservations = await prisma.reservation.findMany({
    where: {
      createdAt: { lt: thirtyDaysAgo },
      status: { not: 'ACTIVE' }
    },
    include: { event: true }
  })

  for (const reservation of expiredReservations) {
    if (reservation.event.endDate < thirtyDaysAgo) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          name: '[삭제됨]',
          phone: '[삭제됨]',
          email: '[삭제됨]',
          address: '[삭제됨]',
        }
      })
    }
  }
}
