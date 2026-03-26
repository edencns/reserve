"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Ticket from "@/components/Ticket";
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

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "48px", height: "48px",
              border: "4px solid #e9ecef", borderTopColor: "#3B5BDB",
              borderRadius: "50%", animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }} />
            <p style={{ color: "#868e96" }}>예약 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>❌</p>
            <h2 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.5rem" }}>예약을 찾을 수 없습니다</h2>
            <p style={{ color: "#868e96", marginBottom: "1.5rem" }}>{error}</p>
            <Link href="/kiosk" className="btn-primary">다시 조회</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!reservation) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Status Banner */}
          {checkInDone && (
            <div style={{
              background: "linear-gradient(135deg, #2b8a3e, #37b24d)",
              borderRadius: "12px", padding: "1.25rem",
              color: "white", textAlign: "center", marginBottom: "1.5rem",
            }}>
              <p style={{ fontSize: "2rem" }}>🎉</p>
              <p style={{ fontWeight: "700", fontSize: "1.1rem" }}>체크인 완료!</p>
              <p style={{ opacity: 0.9, fontSize: "0.9rem" }}>환영합니다. 즐거운 관람 되세요.</p>
            </div>
          )}

          {reservation.status === "CHECKED_IN" && !checkInDone && (
            <div style={{
              background: "#d3f9d8", border: "1px solid #51CF66",
              borderRadius: "12px", padding: "1rem",
              color: "#2b8a3e", textAlign: "center", marginBottom: "1.5rem",
            }}>
              이미 체크인된 입장권입니다.
            </div>
          )}

          {reservation.status === "CANCELLED" && (
            <div style={{
              background: "#ffe3e3", border: "1px solid #FF6B6B",
              borderRadius: "12px", padding: "1rem",
              color: "#c92a2a", textAlign: "center", marginBottom: "1.5rem",
            }}>
              취소된 예약입니다.
            </div>
          )}

          <Ticket reservation={reservation} />

          {reservation.status === "CONFIRMED" && (
            <div className="no-print" style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                style={{
                  backgroundColor: "#51CF66", color: "white",
                  border: "none", borderRadius: "10px",
                  padding: "1rem 2.5rem", fontSize: "1.1rem",
                  fontWeight: "700", cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(81,207,102,0.4)",
                }}>
                {checkingIn ? "처리 중..." : "✅ 체크인 확인"}
              </button>
            </div>
          )}

          <div className="no-print" style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/kiosk" style={{ color: "#3B5BDB", textDecoration: "none", fontSize: "0.9rem" }}>
              ← 다시 조회
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
