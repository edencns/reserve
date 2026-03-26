"use client";

import { useRef } from "react";

interface TicketProps {
  reservation: {
    ticketNumber: string;
    name: string;
    phone: string;
    email: string;
    partySize: number;
    status: string;
    qrCode: string;
    createdAt: string;
    checkedInAt?: string | null;
    event: {
      title: string;
      location: string;
      startDate: string;
      endDate: string;
    };
    timeSlot: {
      date: string;
      startTime: string;
      endTime: string;
    };
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });
}

export default function Ticket({ reservation }: TicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`입장권_${reservation.ticketNumber}.pdf`);
  };

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED: { label: "예약확정", color: "#3B5BDB", bg: "#DBE4FF" },
    CHECKED_IN: { label: "입장완료", color: "#2F9E44", bg: "#D3F9D8" },
    CANCELLED: { label: "취소됨", color: "#C92A2A", bg: "#FFE3E3" },
  };

  const statusInfo = statusMap[reservation.status] || statusMap.CONFIRMED;

  return (
    <div>
      {/* Ticket Card */}
      <div ref={ticketRef} className="ticket-print" style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        maxWidth: "440px",
        margin: "0 auto",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1A1F36 0%, #3B5BDB 100%)",
          padding: "2rem 1.75rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ position: "relative" }}>
            <p style={{ fontSize: "0.7rem", opacity: 0.7, marginBottom: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "600" }}>
              입주박람회 공식 입장권
            </p>
            <h2 style={{ fontWeight: "800", fontSize: "1.25rem", lineHeight: "1.3", marginBottom: "1rem" }}>
              {reservation.event.title}
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>방문일시</p>
                <p style={{ fontWeight: "700", fontSize: "0.9rem" }}>
                  {formatDate(reservation.timeSlot.date)}
                </p>
                <p style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  {reservation.timeSlot.startTime} ~ {reservation.timeSlot.endTime}
                </p>
              </div>
              <span style={{
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                padding: "0.35rem 0.9rem",
                borderRadius: "9999px",
                fontSize: "0.78rem",
                fontWeight: "700",
              }}>
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Dashed divider with notches */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F8F9FA", flexShrink: 0 }} />
          <div style={{ flex: 1, height: "2px", backgroundImage: "repeating-linear-gradient(to right, #DEE2E6 0, #DEE2E6 8px, transparent 8px, transparent 16px)" }} />
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F8F9FA", flexShrink: 0 }} />
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* QR Code - centered and large */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={reservation.qrCode}
              alt="QR Code"
              style={{
                width: "180px", height: "180px",
                border: "3px solid #E9ECEF",
                borderRadius: "12px",
                padding: "4px",
                background: "white",
              }}
            />
            <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.5rem", fontWeight: "600" }}>
              현장에서 QR 코드를 스캔해 주세요
            </p>
          </div>

          {/* Ticket number */}
          <div style={{
            background: "#F8F9FA", borderRadius: "8px", padding: "0.75rem 1rem",
            textAlign: "center", marginBottom: "1.25rem", border: "1px solid #E9ECEF",
          }}>
            <p style={{ fontSize: "0.7rem", color: "#868E96", marginBottom: "0.2rem", fontWeight: "600" }}>예약번호</p>
            <p style={{ fontFamily: "monospace", fontWeight: "800", fontSize: "1.1rem", color: "#212529", letterSpacing: "0.1em" }}>
              {reservation.ticketNumber}
            </p>
          </div>

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <InfoRow label="예약자" value={`${reservation.name} (${reservation.partySize}명)`} />
            <InfoRow label="연락처" value={reservation.phone} />
            <InfoRow label="장소" value={reservation.event.location} />
            {reservation.checkedInAt && (
              <InfoRow label="입장시간" value={new Date(reservation.checkedInAt).toLocaleString("ko-KR")} highlight />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: "#F8F9FA",
          padding: "0.75rem 1.75rem",
          fontSize: "0.72rem",
          color: "#868E96",
          textAlign: "center",
          borderTop: "1px solid #E9ECEF",
        }}>
          예약일시: {new Date(reservation.createdAt).toLocaleString("ko-KR")}
        </div>
      </div>

      {/* Buttons */}
      <div className="no-print" style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.75rem", flexWrap: "wrap" }}>
        <button onClick={handlePrint} style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 1.5rem", borderRadius: "var(--radius-btn)",
          border: "1.5px solid var(--color-border)", background: "white",
          cursor: "pointer", fontWeight: "600", fontSize: "0.9rem",
          color: "var(--color-text-primary)", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F8F9FA"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
        >
          🖨️ 프린트
        </button>
        <button onClick={handleDownload} className="btn-primary">
          📄 PDF 저장
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="ticket-info-row">
      <span className="ticket-info-label">{label}</span>
      <span className="ticket-info-value" style={{ color: highlight ? "#2F9E44" : undefined }}>{value}</span>
    </div>
  );
}
