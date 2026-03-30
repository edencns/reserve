"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
}

export default function KioskTicketPage() {
  const params = useParams();
  const ticketNumber = params.ticketNumber as string;

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);

  useEffect(() => {
    fetch(`/api/kiosk/${ticketNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setReservation(data);
        setLoading(false);
      })
      .catch(() => {
        setError("조회 중 오류가 발생했습니다");
        setLoading(false);
      });
  }, [ticketNumber]);

  const handleCheckIn = async () => {
    if (!reservation) return;
    setCheckingIn(true);
    try {
      const res = await fetch(`/api/kiosk/${ticketNumber}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setCheckInDone(true);
        setReservation({ ...reservation, status: "CHECKED_IN", checkedInAt: new Date().toISOString() });
      }
    } catch {
      setError("체크인 중 오류가 발생했습니다");
    }
    setCheckingIn(false);
  };

  const labelStyle = {
    fontSize: "0.65rem",
    fontWeight: "600" as const,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--brand-dark)",
    opacity: 0.5,
    marginBottom: "0.25rem",
    display: "block",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--brand-lime)" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "40px", height: "40px",
              border: "2px solid var(--brand-dark)", borderTopColor: "transparent",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }} />
            <p style={{ fontSize: "0.85rem", color: "var(--brand-dark)", opacity: 0.6, letterSpacing: "0.04em" }}>
              예약 정보를 불러오는 중...
            </p>
          </div>
        </main>
        <Footer />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--brand-lime)" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{
              width: "64px", height: "64px",
              border: "1px solid var(--brand-dark)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "1.5rem",
            }}>✕</div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "var(--brand-dark)",
              marginBottom: "0.5rem",
            }}>
              예약을 찾을 수 없습니다
            </h2>
            <p style={{ color: "var(--brand-dark)", opacity: 0.6, marginBottom: "2rem", fontSize: "0.9rem" }}>{error}</p>
            <Link href="/kiosk" className="btn-primary" style={{ display: "inline-block" }}>다시 조회</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!reservation) return null;

  const isCheckedIn = reservation.status === "CHECKED_IN";
  const isCancelled = reservation.status === "CANCELLED";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--brand-lime)" }}>
      <Header />

      <main style={{ flex: 1, padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Check-in success banner */}
          {checkInDone && (
            <div style={{
              background: "var(--brand-dark)",
              color: "var(--brand-lime)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              textAlign: "center",
              border: "1px solid var(--brand-dark)",
            }}>
              <p style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                fontWeight: "700",
                marginBottom: "0.25rem",
              }}>
                체크인 완료
              </p>
              <p style={{ fontSize: "0.85rem", opacity: 0.75, letterSpacing: "0.04em" }}>
                환영합니다. 즐거운 관람 되세요.
              </p>
            </div>
          )}

          {/* Already checked in */}
          {isCheckedIn && !checkInDone && (
            <div style={{
              background: "var(--brand-accent)",
              color: "var(--brand-dark)",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              border: "1px solid var(--brand-dark)",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
              textAlign: "center",
            }}>
              이미 체크인된 입장권입니다.
            </div>
          )}

          {/* Cancelled */}
          {isCancelled && (
            <div style={{
              background: "#fde8e8",
              color: "#8b0000",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              border: "1px solid #8b0000",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
              textAlign: "center",
            }}>
              취소된 예약입니다.
            </div>
          )}

          {/* Error during check-in */}
          {error && reservation && (
            <div style={{
              background: "#fde8e8",
              color: "#8b0000",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              border: "1px solid #8b0000",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
            }}>
              {error}
            </div>
          )}

          {/* Ticket info card */}
          <div style={{ border: "1px solid var(--brand-dark)", background: "white", marginBottom: "1.5rem" }}>
            {/* Ticket header */}
            <div style={{
              background: "var(--brand-dark)",
              color: "var(--brand-lime)",
              padding: "1.25rem 1.5rem",
            }}>
              <p style={{ fontSize: "0.65rem", fontWeight: "600", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.25rem" }}>
                입장권
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: "700" }}>
                {reservation.event.title}
              </p>
            </div>

            {/* Ticket body */}
            <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 2rem" }}>
              <div>
                <span style={labelStyle}>예약번호</span>
                <p style={{ fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.06em", color: "var(--brand-dark)" }}>
                  {reservation.ticketNumber}
                </p>
              </div>
              <div>
                <span style={labelStyle}>인원</span>
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--brand-dark)" }}>
                  {reservation.partySize}명
                </p>
              </div>
              <div>
                <span style={labelStyle}>방문 일시</span>
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--brand-dark)" }}>
                  {reservation.timeSlot.date}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--brand-dark)", opacity: 0.7 }}>
                  {reservation.timeSlot.startTime} – {reservation.timeSlot.endTime}
                </p>
              </div>
              <div>
                <span style={labelStyle}>장소</span>
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--brand-dark)" }}>
                  {reservation.event.location}
                </p>
              </div>
              <div>
                <span style={labelStyle}>예약자</span>
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--brand-dark)" }}>
                  {reservation.name}
                </p>
              </div>
              <div>
                <span style={labelStyle}>상태</span>
                <p style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: checkInDone || isCheckedIn ? "#1a6b3c" : isCancelled ? "#8b0000" : "var(--brand-dark)",
                }}>
                  {checkInDone || isCheckedIn ? "체크인 완료" : isCancelled ? "취소됨" : "입장 대기"}
                </p>
              </div>
            </div>

            {/* QR code */}
            <div style={{ borderTop: "1px solid var(--brand-dark)", padding: "1.5rem", textAlign: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reservation.qrCode}
                alt="QR Code"
                style={{ width: "160px", height: "160px", display: "block", margin: "0 auto" }}
              />
              <p style={{ fontSize: "0.7rem", color: "var(--brand-dark)", opacity: 0.5, marginTop: "0.5rem", letterSpacing: "0.06em" }}>
                키오스크에 QR 코드를 스캔해주세요
              </p>
            </div>
          </div>

          {/* Check-in button */}
          {reservation.status === "CONFIRMED" && (
            <div className="no-print" style={{ marginBottom: "1rem" }}>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="btn-primary"
                style={{ width: "100%", fontSize: "1rem", padding: "1.1rem" }}
              >
                {checkingIn ? "처리 중..." : "체크인 확인"}
              </button>
            </div>
          )}

          <div className="no-print" style={{ textAlign: "center" }}>
            <Link href="/kiosk" style={{
              fontSize: "0.8rem",
              color: "var(--brand-dark)",
              opacity: 0.6,
              letterSpacing: "0.06em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}>
              ← 다시 조회
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
