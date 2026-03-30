import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationForm from "@/components/ReservationForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function ReservationPage({ params }: Props) {
  const { eventId } = await params;

  let event;
  try {
    event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        timeSlots: { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
      },
    });
  } catch {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.5rem" }}>서버 오류</h2>
            <p style={{ color: "#868e96", marginBottom: "1.5rem" }}>잠시 후 다시 시도해주세요.</p>
            <Link href="/events" className="btn-primary">행사 목록으로</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) notFound();

  if (event.status === "CLOSED") {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>🚫</p>
            <h2 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.5rem" }}>예약이 종료되었습니다</h2>
            <p style={{ color: "#868e96", marginBottom: "1.5rem" }}>이 행사의 예약이 마감되었습니다.</p>
            <Link href="/events" className="btn-primary">행사 목록으로</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const serializedEvent = {
    ...event,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    timeSlots: event.timeSlots.map((s) => ({
      ...s,
      date: s.date.toISOString(),
    })),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "var(--brand-lime)", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
            <span className="label-text" style={{ color: "var(--brand-dark)" }}>Reservation</span>
            <Link href="/events" className="label-text" style={{ color: "rgba(15,31,61,0.5)", textDecoration: "none" }}>← 행사 목록</Link>
          </div>

          <ReservationForm event={serializedEvent} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
