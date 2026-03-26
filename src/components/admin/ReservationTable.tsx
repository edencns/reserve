"use client";

interface Reservation {
  id: string;
  ticketNumber: string;
  name: string;
  phone: string;
  email: string;
  partySize: number;
  status: string;
  createdAt: string;
  checkedInAt?: string | null;
  event: { title: string };
  timeSlot: { date: string; startTime: string; endTime: string };
}

interface ReservationTableProps {
  reservations: Reservation[];
  onCheckIn?: (ticketNumber: string) => void;
}

const statusInfo: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "예약확정", className: "status-confirmed" },
  CHECKED_IN: { label: "입장완료", className: "status-checked-in" },
  CANCELLED: { label: "취소됨", className: "status-cancelled" },
};

export default function ReservationTable({ reservations, onCheckIn }: ReservationTableProps) {
  if (reservations.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#adb5bd" }}>
        <p style={{ fontSize: "2rem" }}>📋</p>
        <p>예약 내역이 없습니다</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2d3561" }}>
            {["예약번호", "예약자", "연락처", "행사", "방문일시", "인원", "상태", "액션"].map((h) => (
              <th key={h} style={{
                textAlign: "left", padding: "0.75rem 1rem",
                color: "#adb5bd", fontSize: "0.8rem", fontWeight: "600",
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => {
            const status = statusInfo[r.status] || statusInfo.CONFIRMED;
            return (
              <tr key={r.id} style={{
                borderBottom: "1px solid #1e2342",
                transition: "background 0.15s",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#1e2342")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "0.875rem 1rem" }}>
                  <code style={{ fontSize: "0.8rem", color: "#74c0fc" }}>{r.ticketNumber}</code>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "white", fontWeight: "500" }}>{r.name}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#adb5bd", fontSize: "0.875rem" }}>{r.phone}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#adb5bd", fontSize: "0.875rem", maxWidth: "180px" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {r.event.title}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#adb5bd", fontSize: "0.875rem" }}>
                  {new Date(r.timeSlot.date).toLocaleDateString("ko-KR")}<br />
                  <span style={{ fontSize: "0.75rem" }}>{r.timeSlot.startTime} ~ {r.timeSlot.endTime}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#adb5bd", textAlign: "center" }}>{r.partySize}명</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span className={`status-badge ${status.className}`}>{status.label}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  {r.status === "CONFIRMED" && onCheckIn && (
                    <button
                      onClick={() => onCheckIn(r.ticketNumber)}
                      style={{
                        backgroundColor: "#51CF66", color: "white",
                        border: "none", borderRadius: "6px",
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.8rem", fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      체크인
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
