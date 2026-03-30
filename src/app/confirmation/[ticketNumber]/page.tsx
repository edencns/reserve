import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { decrypt, maskPhone, maskEmail } from "@/lib/encryption";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ticket from "@/components/Ticket";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ ticketNumber: string }>;
}

export default async function ConfirmationPage({ params }: Props) {
  const { ticketNumber } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { ticketNumber },
    include: { event: true, timeSlot: true },
  });

  if (!reservation) notFound();

  const ticketData = {
    ...reservation,
    name: decrypt(reservation.name),
    phone: maskPhone(decrypt(reservation.phone)),
    email: maskEmail(decrypt(reservation.email)),
    address: reservation.address ? decrypt(reservation.address) : null,
    createdAt: reservation.createdAt.toISOString(),
    checkedInAt: reservation.checkedInAt?.toISOString() ?? null,
    event: {
      ...reservation.event,
      startDate: reservation.event.startDate.toISOString(),
      endDate: reservation.event.endDate.toISOString(),
    },
    timeSlot: {
      ...reservation.timeSlot,
      date: reservation.timeSlot.date.toISOString(),
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "var(--brand-lime)", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>예약 완료</span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 600, margin: "0.5rem 0 0.375rem", color: "var(--brand-dark)" }}>
              입장권이 발급되었습니다
            </h1>
            <p style={{ fontSize: "0.875rem", color: "rgba(15,31,61,0.6)" }}>현장 키오스크 또는 QR 스캔으로 체크인하세요</p>
          </div>

          <Ticket reservation={ticketData} />

          <div style={{ borderLeft: "2px solid var(--brand-accent)", paddingLeft: "1rem", margin: "1.5rem 0" }}>
            <p style={{ fontSize: "0.85rem", color: "rgba(15,31,61,0.7)", lineHeight: 1.7 }}>
              QR 코드를 키오스크에 스캔하거나 동호수를 입력해 체크인하세요.
              입장권 분실 시 <Link href="/my-tickets" style={{ color: "var(--brand-dark)", fontWeight: 600, textDecoration: "underline" }}>내 예약 조회</Link>에서 재확인 가능합니다.
            </p>
          </div>

          <div className="no-print" style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn-secondary" style={{ flex: 1, padding: "0.875rem" }} onClick={() => window.print()}>프린트</button>
            <Link href="/events" className="btn-primary" style={{ flex: 1, padding: "0.875rem", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              다른 행사 보기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
