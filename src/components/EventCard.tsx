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

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE": return { label: "진행중", color: "#2F9E44" };
    case "UPCOMING": return { label: "예정", color: "#0F1F3D" };
    case "CLOSED": return { label: "종료", color: "#888" };
    default: return { label: status, color: "#0F1F3D" };
  }
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("ko-KR", opts)} – ${e.toLocaleDateString("ko-KR", opts)}`;
}

export default function EventCard({ event }: EventCardProps) {
  const { label: statusLabel, color: statusColor } = getStatusLabel(event.status);
  const reservationCount = event._count?.reservations ?? 0;
  const isAvailable = event.status !== "CLOSED" && reservationCount < event.maxCapacity;

  const fallbackImgs = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
  ];
  const imgSrc = event.imageUrl || fallbackImgs[Math.abs(event.id.charCodeAt(0) % 3)];

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Arch image */}
      <div style={{
        width: "100%", aspectRatio: "3/4",
        borderRadius: "500px 500px 0 0",
        overflow: "hidden",
        background: "#0F1F3D",
        position: "relative",
      }}>
        <img
          src={imgSrc}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, filter: "grayscale(0.3)" }}
        />
        {/* Status badge */}
        <span style={{
          position: "absolute", top: "1.25rem", right: "1.25rem",
          fontSize: "0.65rem", fontWeight: 500, textTransform: "uppercase",
          letterSpacing: "0.1em", color: statusColor,
          border: `1px solid ${statusColor}`,
          padding: "0.2rem 0.6rem",
          backgroundColor: "#E8EEF4",
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Info */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem", fontWeight: 400,
            color: "#0F1F3D", lineHeight: 1.2,
          }}>
            {event.title}
          </h3>
          <span className="label-text" style={{ color: "#5a7a9a", flexShrink: 0, marginLeft: "0.75rem" }}>
            {formatDateRange(event.startDate, event.endDate)}
          </span>
        </div>

        <p style={{ fontSize: "0.875rem", color: "#5a7a9a", marginBottom: "1rem" }}>
          {event.location}
        </p>

        <p style={{ fontSize: "0.875rem", color: "#0F1F3D", opacity: 0.75, marginBottom: "1.25rem", lineHeight: 1.6 }}>
          {event.description.length > 80 ? event.description.slice(0, 80) + "..." : event.description}
        </p>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {isAvailable ? (
            <Link href={`/reservation/${event.id}`} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
              Reserve
            </Link>
          ) : (
            <button disabled className="btn-primary" style={{ flex: 1, opacity: 0.4, cursor: "not-allowed" }}>
              {event.status === "CLOSED" ? "Closed" : "마감"}
            </button>
          )}
          <Link href={`/events/${event.id}`} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
