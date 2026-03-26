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

      <main style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Success Banner */}
          <div style={{
            background: "linear-gradient(135deg, #2b8a3e, #37b24d)",
            borderRadius: "16px",
            padding: "1.5rem",
            color: "white",
            textAlign: "center",
            marginBottom: "2rem",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
            <h1 style={{ fontWeight: "800", fontSize: "1.5rem", marginBottom: "0.375rem" }}>
              예약이 완료되었습니다!
            </h1>
            <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>
              입장권을 저장하거나 프린트하여 현장에서 사용하세요
            </p>
          </div>

          {/* Ticket */}
          <Ticket reservation={ticketData} />

          {/* Additional info */}
          <div style={{
            background: "#eef2ff", border: "1px solid #c5cff6",
            borderRadius: "12px", padding: "1.25rem",
            marginTop: "1.5rem", fontSize: "0.875rem", color: "#3B5BDB",
          }}>
            <p style={{ fontWeight: "700", marginBottom: "0.5rem" }}>📌 방문 안내</p>
            <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.8", color: "#495057" }}>
              <li>QR 코드를 키오스크에 스캔하면 빠르게 체크인 가능합니다</li>
              <li>입장권 분실 시 예약번호로 재조회 가능합니다</li>
              <li>예약 변경/취소는 행사 관리자에게 문의해 주세요</li>
            </ul>
          </div>

          <div className="no-print" style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/events" style={{ color: "#3B5BDB", textDecoration: "none", fontSize: "0.9rem" }}>
              ← 다른 행사 보기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
