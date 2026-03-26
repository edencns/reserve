import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      _count: { select: { reservations: true } },
    },
    orderBy: { startDate: "asc" },
  });

  const activeEvents = events.filter((e) => e.status === "ACTIVE");
  const upcomingEvents = events.filter((e) => e.status === "UPCOMING");
  const closedEvents = events.filter((e) => e.status === "CLOSED");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        {/* Page Header */}
        <div className="hero-gradient" style={{
          padding: "4rem 1.5rem 3.5rem",
          color: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(59,91,219,0.08)", filter: "blur(60px)" }} />
          </div>
          <div style={{ position: "relative" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              입주박람회 예약
            </p>
            <h1 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              박람회 행사 목록
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem" }}>
              관심 있는 입주박람회를 선택하고 예약하세요
            </p>

            {/* Quick summary */}
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
              {[
                { label: "진행중 행사", value: activeEvents.length, color: "#51CF66" },
                { label: "예정 행사", value: upcomingEvents.length, color: "#93C5FD" },
                { label: "전체 행사", value: events.length, color: "rgba(255,255,255,0.7)" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: "800", fontSize: "1.75rem", color: s.color, lineHeight: "1" }}>{s.value}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}>
          {events.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "5rem 2rem", color: "var(--color-text-secondary)",
              background: "white", borderRadius: "16px", border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏢</div>
              <h3 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--color-text-primary)" }}>
                등록된 행사가 없습니다
              </h3>
              <p style={{ fontSize: "0.95rem" }}>곧 새로운 행사가 등록될 예정입니다.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              {activeEvents.length > 0 && (
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "0.375rem",
                      padding: "0.3rem 0.875rem", borderRadius: "9999px",
                      background: "#D3F9D8", color: "#2F9E44",
                      fontSize: "0.8rem", fontWeight: "700",
                    }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2F9E44" }} />
                      진행중
                    </span>
                    <h2 style={{ fontWeight: "700", fontSize: "1.3rem", color: "var(--color-text-primary)" }}>
                      현재 진행 중인 행사
                    </h2>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>({activeEvents.length}개)</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    {activeEvents.map((event) => (
                      <EventCard key={event.id} event={{
                        ...event,
                        startDate: event.startDate.toISOString(),
                        endDate: event.endDate.toISOString(),
                      }} />
                    ))}
                  </div>
                </section>
              )}

              {upcomingEvents.length > 0 && (
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "0.375rem",
                      padding: "0.3rem 0.875rem", borderRadius: "9999px",
                      background: "#DBE4FF", color: "#3B5BDB",
                      fontSize: "0.8rem", fontWeight: "700",
                    }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3B5BDB" }} />
                      예정
                    </span>
                    <h2 style={{ fontWeight: "700", fontSize: "1.3rem", color: "var(--color-text-primary)" }}>
                      예정된 행사
                    </h2>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>({upcomingEvents.length}개)</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={{
                        ...event,
                        startDate: event.startDate.toISOString(),
                        endDate: event.endDate.toISOString(),
                      }} />
                    ))}
                  </div>
                </section>
              )}

              {closedEvents.length > 0 && (
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "0.375rem",
                      padding: "0.3rem 0.875rem", borderRadius: "9999px",
                      background: "#F1F3F5", color: "#868E96",
                      fontSize: "0.8rem", fontWeight: "700",
                    }}>
                      종료
                    </span>
                    <h2 style={{ fontWeight: "700", fontSize: "1.3rem", color: "var(--color-text-primary)" }}>
                      종료된 행사
                    </h2>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>({closedEvents.length}개)</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", opacity: 0.7 }}>
                    {closedEvents.map((event) => (
                      <EventCard key={event.id} event={{
                        ...event,
                        startDate: event.startDate.toISOString(),
                        endDate: event.endDate.toISOString(),
                      }} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
