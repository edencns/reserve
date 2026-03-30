import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: Awaited<ReturnType<typeof prisma.event.findMany<{ include: { _count: { select: { reservations: true } } } }>>> = [];
  let dbError = false;

  try {
    events = await prisma.event.findMany({
      include: {
        _count: { select: { reservations: true } },
      },
      orderBy: { startDate: "asc" },
    });
  } catch {
    dbError = true;
  }

  const activeEvents = events.filter((e) => e.status === "ACTIVE");
  const upcomingEvents = events.filter((e) => e.status === "UPCOMING");
  const closedEvents = events.filter((e) => e.status === "CLOSED");

  if (dbError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.5rem" }}>데이터베이스 연결 오류</h2>
            <p style={{ color: "#868e96", marginBottom: "1.5rem", lineHeight: "1.6" }}>
              서버에 일시적인 문제가 발생했습니다.<br />잠시 후 다시 시도해주세요.
            </p>
            <a href="/" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "#3B5BDB", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
              홈으로 돌아가기
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "#E8EEF4" }}>
        {/* Page Header */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 2rem 2rem", borderBottom: "1px solid #0F1F3D" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
            <span className="label-text" style={{ color: "#0F1F3D" }}>Directory</span>
            <span className="label-text" style={{ color: "#5a7a9a" }}>
              진행중 {activeEvents.length} · 예정 {upcomingEvents.length} · 전체 {events.length}
            </span>
          </div>
          <h1 className="display-title" style={{ color: "#0F1F3D" }}>
            Upcoming Fairs
          </h1>
        </div>

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" }}>
          {events.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "5rem 2rem",
              border: "1px solid #0F1F3D",
            }}>
              <p className="label-text" style={{ color: "#5a7a9a", marginBottom: "1rem" }}>등록된 행사가 없습니다</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "#0F1F3D" }}>곧 새로운 행사가 등록될 예정입니다.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              {activeEvents.length > 0 && (
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(15,31,61,0.15)" }}>
                    <span className="label-text" style={{ color: "#2F9E44", border: "1px solid #2F9E44", padding: "0.2rem 0.6rem" }}>진행중</span>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "#0F1F3D" }}>
                      현재 진행 중인 행사
                    </h2>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "4rem" }}>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(15,31,61,0.15)" }}>
                    <span className="label-text" style={{ color: "#0F1F3D", border: "1px solid #0F1F3D", padding: "0.2rem 0.6rem" }}>예정</span>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "#0F1F3D" }}>
                      예정된 행사
                    </h2>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "4rem" }}>
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
                <section style={{ opacity: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(15,31,61,0.15)" }}>
                    <span className="label-text" style={{ color: "#888", border: "1px solid #888", padding: "0.2rem 0.6rem" }}>종료</span>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "#0F1F3D" }}>
                      종료된 행사
                    </h2>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "4rem" }}>
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
