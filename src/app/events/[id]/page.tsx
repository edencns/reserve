import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function getStatusInfo(status: string) {
  switch (status) {
    case "ACTIVE": return { label: "진행중", className: "status-active" };
    case "UPCOMING": return { label: "예정", className: "status-upcoming" };
    case "CLOSED": return { label: "종료", className: "status-closed" };
    default: return { label: status, className: "status-upcoming" };
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      timeSlots: { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
      _count: { select: { reservations: true } },
    },
  });

  if (!event) notFound();

  const { label, className } = getStatusInfo(event.status);
  const reservationCount = event._count.reservations;
  const capacityPercent = Math.min((reservationCount / event.maxCapacity) * 100, 100);
  const isAvailable = event.status !== "CLOSED" && reservationCount < event.maxCapacity;

  const totalSlotCapacity = event.timeSlots.reduce((a, s) => a + s.maxCapacity, 0);
  const totalSlotUsed = event.timeSlots.reduce((a, s) => a + s.currentCount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        {/* Hero */}
        <div className="hero-gradient" style={{ padding: "3rem 1rem", color: "white" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Link href="/events" style={{ color: "#93c5fd", textDecoration: "none", fontSize: "0.9rem" }}>
              ← 행사 목록으로
            </Link>
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <h1 style={{ fontWeight: "800", fontSize: "2rem", flex: 1, lineHeight: "1.3" }}>
                {event.title}
              </h1>
              <span className={`status-badge ${className}`} style={{ flexShrink: 0, marginTop: "0.5rem" }}>
                {label}
              </span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
            {/* Left: Details */}
            <div>
              <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: "700", fontSize: "1.2rem", marginBottom: "1rem" }}>행사 정보</h2>
                <p style={{ color: "#495057", lineHeight: "1.8", marginBottom: "1.5rem" }}>
                  {event.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <InfoRow icon="📍" label="장소" value={event.location} />
                  <InfoRow icon="📅" label="기간"
                    value={`${new Date(event.startDate).toLocaleDateString("ko-KR")} ~ ${new Date(event.endDate).toLocaleDateString("ko-KR")}`} />
                  <InfoRow icon="👥" label="최대 인원" value={`${event.maxCapacity}명`} />
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontWeight: "700", fontSize: "1.2rem", marginBottom: "1rem" }}>방문 가능 시간</h2>
                {event.timeSlots.length === 0 ? (
                  <p style={{ color: "#868e96" }}>등록된 시간대가 없습니다.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {event.timeSlots.map((slot) => {
                      const available = slot.maxCapacity - slot.currentCount;
                      const isFull = available === 0;
                      return (
                        <div key={slot.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "0.875rem 1rem",
                          border: "1px solid #e9ecef",
                          borderRadius: "8px",
                          background: isFull ? "#f8f9fa" : "white",
                        }}>
                          <div>
                            <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                              {new Date(slot.date).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
                            </p>
                            <p style={{ color: "#868e96", fontSize: "0.8rem" }}>
                              {slot.startTime} ~ {slot.endTime}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{
                              fontWeight: "700", fontSize: "0.875rem",
                              color: isFull ? "#FF6B6B" : available < 5 ? "#FFD43B" : "#51CF66",
                            }}>
                              {isFull ? "마감" : `잔여 ${available}명`}
                            </p>
                            <p style={{ fontSize: "0.75rem", color: "#868e96" }}>
                              {slot.currentCount}/{slot.maxCapacity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Reservation CTA */}
            <div>
              <div style={{
                background: "white", borderRadius: "16px",
                padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                position: "sticky", top: "1rem",
              }}>
                <h3 style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "1rem" }}>예약 현황</h3>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#868e96", marginBottom: "0.5rem" }}>
                    <span>전체 예약</span>
                    <span style={{ fontWeight: "600", color: "#212529" }}>{reservationCount} / {event.maxCapacity}명</span>
                  </div>
                  <div style={{ height: "8px", background: "#e9ecef", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${capacityPercent}%`,
                      background: capacityPercent > 80 ? "#FF6B6B" : capacityPercent > 50 ? "#FFD43B" : "#51CF66",
                      borderRadius: "4px",
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem", padding: "0.875rem", background: "#f8f9fa", borderRadius: "8px", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#868e96" }}>슬롯 총 잔여</span>
                    <span style={{ fontWeight: "600" }}>{totalSlotCapacity - totalSlotUsed}명</span>
                  </div>
                </div>

                {isAvailable ? (
                  <Link href={`/reservation/${event.id}`} className="btn-primary" style={{ display: "block", textAlign: "center", fontSize: "1rem" }}>
                    예약하기
                  </Link>
                ) : (
                  <button disabled className="btn-primary" style={{ width: "100%", opacity: 0.5, cursor: "not-allowed" }}>
                    {event.status === "CLOSED" ? "행사 종료" : "예약 마감"}
                  </button>
                )}

                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#868e96", marginTop: "0.75rem" }}>
                  무료 예약 · 회원가입 불필요
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span style={{ fontSize: "1.25rem" }}>{icon}</span>
      <div>
        <p style={{ fontSize: "0.75rem", color: "#868e96" }}>{label}</p>
        <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>{value}</p>
      </div>
    </div>
  );
}
