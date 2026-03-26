"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface CheckResult {
  name: string;
  event: string;
  date: string;
  time: string;
  status: string;
}

export default function QRCheckInPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/kiosk/${ticketNumber.trim()}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "체크인에 실패했습니다");
      } else {
        setResult({
          name: data.reservation?.name ?? "방문자",
          event: data.reservation?.event?.title ?? "",
          date: data.reservation?.timeSlot?.date ?? "",
          time: `${data.reservation?.timeSlot?.startTime ?? ""} ~ ${data.reservation?.timeSlot?.endTime ?? ""}`,
          status: "CHECKED_IN",
        });
      }
    } catch {
      setError("네트워크 오류가 발생했습니다");
    }
    setLoading(false);
  };

  return (
    <AdminLayout title="QR 체크인">
      <div style={{ maxWidth: "480px" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#1A1F36", marginBottom: "0.5rem" }}>QR 체크인</h2>
        <p style={{ color: "#868E96", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          티켓 번호를 입력하거나 QR 코드를 스캔하여 체크인하세요
        </p>

        <form onSubmit={handleCheckIn}>
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <input
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="티켓 번호 입력"
              style={{
                flex: 1, padding: "0.875rem 1rem",
                border: "1.5px solid #E9ECEF", borderRadius: "10px",
                fontSize: "0.9rem", color: "#1A1F36", outline: "none",
              }}
            />
            <button type="submit" disabled={loading} style={{
              padding: "0.875rem 1.5rem", borderRadius: "10px",
              border: "none", background: "#3B5BDB", color: "white",
              fontWeight: "700", cursor: "pointer", fontSize: "0.9rem",
            }}>
              {loading ? "..." : "체크인"}
            </button>
          </div>
        </form>

        {error && (
          <div style={{ padding: "1rem", background: "#FFE3E3", borderRadius: "10px", border: "1px solid #FFC9C9", color: "#C92A2A", fontSize: "0.875rem", marginBottom: "1rem" }}>
            ⚠ {error}
          </div>
        )}

        {result && (
          <div style={{ padding: "1.25rem", background: "#D3F9D8", borderRadius: "12px", border: "1px solid #8CE99A" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>✅</span>
              <div>
                <p style={{ fontWeight: "700", fontSize: "1rem", color: "#2F9E44" }}>체크인 완료!</p>
                <p style={{ fontSize: "0.8rem", color: "#2F9E44" }}>{result.name}님이 입장하셨습니다</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem", color: "#1A1F36" }}>행사: <strong>{result.event}</strong></p>
              {result.date && <p style={{ fontSize: "0.8rem", color: "#1A1F36" }}>날짜: <strong>{new Date(result.date).toLocaleDateString("ko-KR")}</strong></p>}
              {result.time && <p style={{ fontSize: "0.8rem", color: "#1A1F36" }}>시간: <strong>{result.time}</strong></p>}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
