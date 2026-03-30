"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ReservationData {
  ticketNumber: string;
  name: string;
  phone: string;
  email: string;
  partySize: number;
  status: string;
  qrCode: string;
  createdAt: string;
  checkedInAt?: string | null;
  event: { title: string; location: string; startDate: string; endDate: string };
  timeSlot: { date: string; startTime: string; endTime: string };
}

const statusLabel: Record<string, { text: string; color: string }> = {
  CONFIRMED: { text: "예약 확정", color: "#0F1F3D" },
  CHECKED_IN: { text: "방문 완료", color: "#2F9E44" },
  CANCELLED: { text: "취소됨", color: "#C92A2A" },
};

export default function MyTicketsPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ReservationData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/reservations/${query.trim().toUpperCase()}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "예약을 찾을 수 없습니다");
      else setResult(data);
    } catch {
      setError("조회 중 오류가 발생했습니다");
    }
    setLoading(false);
  };

  const status = result ? (statusLabel[result.status] ?? { text: result.status, color: "#0F1F3D" }) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--brand-lime)" }}>
      <Header />

      <main style={{ flex: 1, padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Heading */}
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.75rem" }}>
            My Tickets
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 600, color: "var(--brand-dark)", marginBottom: "0.75rem", lineHeight: 1.1 }}>
            내 예약 조회
          </h1>
          <p style={{ fontSize: "0.9rem", opacity: 0.6, marginBottom: "3rem" }}>
            예약번호를 입력하여 예약 내역을 확인하세요
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
            <div style={{ borderBottom: "2px solid var(--brand-dark)", display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value.toUpperCase()); setError(""); }}
                placeholder="예약번호 입력 (예: TK20260101XXXX)"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: "1rem", fontFamily: "var(--font-serif)",
                  color: "var(--brand-dark)", letterSpacing: "0.04em",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ flexShrink: 0, padding: "0.6rem 1.25rem" }}
              >
                {loading ? "조회 중" : "조회"}
              </button>
            </div>
            {error && (
              <p style={{ fontSize: "0.82rem", color: "#c0392b", letterSpacing: "0.03em" }}>{error}</p>
            )}
          </form>

          {/* Result */}
          {result && status && (
            <div style={{ border: "1px solid var(--brand-dark)", background: "white" }}>
              {/* Header */}
              <div style={{ background: "var(--brand-dark)", padding: "1.5rem", color: "var(--brand-lime)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.25rem" }}>
                  입장권
                </p>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {result.event.title}
                </h2>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  border: "1px solid currentColor", padding: "0.2rem 0.6rem",
                  color: result.status === "CHECKED_IN" ? "#86efac" : result.status === "CANCELLED" ? "#fca5a5" : "var(--brand-lime)",
                }}>
                  {status.text}
                </span>
              </div>

              {/* Info grid */}
              <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 2rem" }}>
                {[
                  { label: "예약번호", value: result.ticketNumber },
                  { label: "인원", value: `${result.partySize}명` },
                  { label: "방문일", value: result.timeSlot.date },
                  { label: "시간", value: `${result.timeSlot.startTime} – ${result.timeSlot.endTime}` },
                  { label: "장소", value: result.event.location },
                  { label: "예약자", value: result.name },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.25rem" }}>{label}</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--brand-dark)" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* QR */}
              <div style={{ borderTop: "1px solid var(--brand-dark)", padding: "1.5rem", textAlign: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.qrCode} alt="QR Code" style={{ width: "140px", height: "140px", margin: "0 auto", display: "block" }} />
                <p style={{ fontSize: "0.7rem", opacity: 0.45, marginTop: "0.75rem", letterSpacing: "0.06em" }}>
                  현장 키오스크에 QR 코드를 제시해주세요
                </p>
              </div>

              {/* Actions */}
              {result.status === "CONFIRMED" && (
                <div style={{ borderTop: "1px solid var(--brand-dark)", padding: "1rem 1.5rem", display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => window.print()}
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: "0.8rem" }}
                  >
                    프린트
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link href="/events" style={{ fontSize: "0.8rem", color: "var(--brand-dark)", opacity: 0.5, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ← 행사 목록으로
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
