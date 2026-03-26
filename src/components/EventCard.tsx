import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  maxCapacity: number;
  status: string;
  _count?: { reservations: number };
}

interface EventCardProps {
  event: Event;
}

function getStatusInfo(status: string) {
  switch (status) {
    case "ACTIVE": return { label: "진행중", dot: "#2F9E44", bg: "#D3F9D8", color: "#2F9E44" };
    case "UPCOMING": return { label: "예정", dot: "#3B5BDB", bg: "#DBE4FF", color: "#3B5BDB" };
    case "CLOSED": return { label: "종료", dot: "#868E96", bg: "#F1F3F5", color: "#868E96" };
    default: return { label: status, dot: "#3B5BDB", bg: "#DBE4FF", color: "#3B5BDB" };
  }
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("ko-KR")} ~ ${e.toLocaleDateString("ko-KR")}`;
}

export default function EventCard({ event }: EventCardProps) {
  const statusInfo = getStatusInfo(event.status);
  const reservationCount = event._count?.reservations ?? 0;
  const capacityPercent = Math.min((reservationCount / event.maxCapacity) * 100, 100);
  const isAvailable = event.status !== "CLOSED" && reservationCount < event.maxCapacity;

  let barColor = "#51CF66";
  if (capacityPercent > 80) barColor = "#FF6B6B";
  else if (capacityPercent > 50) barColor = "#FFD43B";

  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* Image / Banner */}
      <div style={{
        height: "160px",
        background: event.imageUrl
          ? `url(${event.imageUrl}) center/cover no-repeat`
          : "linear-gradient(135deg, #1A1F36 0%, #3B5BDB 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}>
        {!event.imageUrl && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>🏢</div>
          </div>
        )}
        {/* Status badge */}
        <span style={{
          position: "absolute", top: "12px", right: "12px",
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          padding: "0.3rem 0.75rem", borderRadius: "9999px",
          background: statusInfo.bg, color: statusInfo.color,
          fontSize: "0.78rem", fontWeight: "700",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusInfo.dot, flexShrink: 0 }} />
          {statusInfo.label}
        </span>
      </div>

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "0.5rem", color: "var(--color-text-primary)", lineHeight: "1.4" }}>
          {event.title}
        </h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBottom: "1rem", lineHeight: "1.6", flex: 1 }}>
          {event.description.length > 80 ? event.description.slice(0, 80) + "..." : event.description}
        </p>

        {/* Meta info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "#495057" }}>
            <span style={{ fontSize: "0.9rem" }}>📍</span>
            <span style={{ fontWeight: "500" }}>{event.location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "#495057" }}>
            <span style={{ fontSize: "0.9rem" }}>📅</span>
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "#495057" }}>
            <span style={{ fontSize: "0.9rem" }}>👥</span>
            <span>정원 {event.maxCapacity}명</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.375rem" }}>
            <span style={{ fontWeight: "500" }}>예약 현황</span>
            <span style={{ fontWeight: "600", color: capacityPercent > 80 ? "#FF6B6B" : "var(--color-text-primary)" }}>
              {reservationCount} / {event.maxCapacity}명
            </span>
          </div>
          <div style={{ height: "6px", background: "#E9ECEF", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${capacityPercent}%`,
              background: barColor,
              borderRadius: "3px",
              transition: "width 0.4s ease",
            }} />
          </div>
          {capacityPercent > 80 && event.status !== "CLOSED" && (
            <p style={{ fontSize: "0.72rem", color: "#FF6B6B", marginTop: "0.25rem", fontWeight: "600" }}>
              마감 임박! 서둘러 예약하세요
            </p>
          )}
        </div>

        {isAvailable ? (
          <Link href={`/reservation/${event.id}`} className="btn-primary" style={{ display: "flex", textAlign: "center", justifyContent: "center", fontSize: "0.9rem", padding: "0.65rem 1rem" }}>
            지금 예약하기
          </Link>
        ) : (
          <button disabled className="btn-primary" style={{ width: "100%", opacity: 0.5, cursor: "not-allowed", fontSize: "0.9rem", padding: "0.65rem 1rem" }}>
            {event.status === "CLOSED" ? "행사 종료" : "예약 마감"}
          </button>
        )}
      </div>
    </div>
  );
}
