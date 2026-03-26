"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/admin/StatsCard";
import ReservationTable from "@/components/admin/ReservationTable";

interface Stats {
  totalEvents: number;
  activeEvents: number;
  totalReservations: number;
  confirmedReservations: number;
  checkedInReservations: number;
  cancelledReservations: number;
  todayReservations: number;
  recentReservations: Array<{
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
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setStats(data);
        setLoading(false);
      })
      .catch(() => { router.push("/admin/login"); });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleCheckIn = async (ticketNumber: string) => {
    await fetch(`/api/kiosk/${ticketNumber}`, { method: "POST" });
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0F172A",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1rem",
      }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59,91,219,0.3)", borderTopColor: "#3B5BDB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>로딩 중...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "white", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px", flexShrink: 0, background: "#0F172A",
        borderRight: "1px solid #1E293B", padding: "1.5rem 1rem",
        display: "flex", flexDirection: "column", gap: "0.375rem",
        minHeight: "100vh", position: "sticky", top: 0, alignSelf: "flex-start",
      }} className="hide-mobile">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--color-primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800" }}>R</div>
          <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "white" }}>관리자 패널</span>
        </div>

        <Link href="/admin/dashboard" className="admin-nav-item active" style={{
          background: "rgba(59,91,219,0.2)", color: "white",
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none",
          fontSize: "0.875rem", fontWeight: "600",
        }}>
          <span>📊</span> 대시보드
        </Link>
        <Link href="/admin/events" style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none",
          fontSize: "0.875rem", fontWeight: "500", color: "#94A3B8",
          transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; }}
        >
          <span>🏢</span> 행사 관리
        </Link>
        <Link href="/events" target="_blank" style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none",
          fontSize: "0.875rem", fontWeight: "500", color: "#94A3B8",
          transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; }}
        >
          <span>↗</span> 사이트 보기
        </Link>

        <div style={{ flex: 1 }} />

        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.75rem 1rem", borderRadius: "8px",
          background: "transparent", border: "none", cursor: "pointer",
          fontSize: "0.875rem", fontWeight: "500", color: "#94A3B8",
          width: "100%", textAlign: "left", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,107,107,0.1)"; (e.currentTarget as HTMLElement).style.color = "#FF6B6B"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; }}
        >
          <span>🚪</span> 로그아웃
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          background: "#0F172A", borderBottom: "1px solid #1E293B",
          padding: "0 1.5rem", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontWeight: "700", fontSize: "1rem", color: "white" }}>대시보드</h1>
            <p style={{ color: "#64748B", fontSize: "0.75rem" }}>{today}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/admin/events" style={{
              padding: "0.4rem 1rem", borderRadius: "6px",
              background: "rgba(59,91,219,0.2)", color: "#93C5FD",
              textDecoration: "none", fontSize: "0.8rem", fontWeight: "600",
            }}>
              행사 관리
            </Link>
            <button onClick={handleLogout} style={{
              background: "none", border: "1px solid #334155",
              color: "#94A3B8", padding: "0.4rem 1rem",
              borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "500",
            }}>
              로그아웃
            </button>
          </div>
        </header>

        <main style={{ padding: "2rem 1.5rem", maxWidth: "1200px" }}>
          {stats && (
            <>
              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatBlock title="전체 행사" value={stats.totalEvents} subtitle={`진행중 ${stats.activeEvents}개`} accent="#3B5BDB" icon="🏢" />
                <StatBlock title="오늘 예약" value={stats.todayReservations} subtitle="신규 예약" accent="#51CF66" icon="📅" />
                <StatBlock title="총 예약" value={stats.totalReservations} subtitle={`확정 ${stats.confirmedReservations}건`} accent="#FFD43B" icon="🎫" />
                <StatBlock title="체크인 완료" value={stats.checkedInReservations} subtitle="입장 완료" accent="#51CF66" icon="✅" />
                <StatBlock title="취소" value={stats.cancelledReservations} subtitle="취소된 예약" accent="#FF6B6B" icon="❌" />
              </div>

              {/* Quick stats summary bar */}
              <div style={{
                background: "#1E293B", borderRadius: "12px", padding: "1rem 1.5rem",
                marginBottom: "1.5rem", border: "1px solid #334155",
                display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center",
              }}>
                <div>
                  <p style={{ color: "#64748B", fontSize: "0.75rem", marginBottom: "0.25rem" }}>체크인율</p>
                  <p style={{ fontWeight: "800", fontSize: "1.25rem", color: "#51CF66" }}>
                    {stats.totalReservations > 0
                      ? Math.round((stats.checkedInReservations / stats.totalReservations) * 100)
                      : 0}%
                  </p>
                </div>
                <div style={{ width: "1px", height: "40px", background: "#334155" }} />
                <div>
                  <p style={{ color: "#64748B", fontSize: "0.75rem", marginBottom: "0.25rem" }}>취소율</p>
                  <p style={{ fontWeight: "800", fontSize: "1.25rem", color: "#FF6B6B" }}>
                    {stats.totalReservations > 0
                      ? Math.round((stats.cancelledReservations / stats.totalReservations) * 100)
                      : 0}%
                  </p>
                </div>
                <div style={{ width: "1px", height: "40px", background: "#334155" }} />
                <div>
                  <p style={{ color: "#64748B", fontSize: "0.75rem", marginBottom: "0.25rem" }}>대기중</p>
                  <p style={{ fontWeight: "800", fontSize: "1.25rem", color: "#93C5FD" }}>
                    {stats.confirmedReservations}건
                  </p>
                </div>
              </div>

              {/* Recent Reservations */}
              <div style={{
                background: "#1E293B",
                borderRadius: "12px",
                border: "1px solid #334155",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #334155",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <h2 style={{ fontWeight: "700", fontSize: "0.95rem", color: "white" }}>최근 예약 내역</h2>
                    <p style={{ color: "#64748B", fontSize: "0.75rem", marginTop: "0.125rem" }}>최근 접수된 예약 목록</p>
                  </div>
                  <Link href="/admin/events" style={{ color: "#93C5FD", fontSize: "0.8rem", textDecoration: "none", fontWeight: "600" }}>
                    전체 보기 →
                  </Link>
                </div>
                <ReservationTable
                  reservations={stats.recentReservations.map((r) => ({
                    ...r,
                    checkedInAt: r.checkedInAt ?? null,
                  }))}
                  onCheckIn={handleCheckIn}
                />
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatBlock({ title, value, subtitle, accent, icon }: { title: string; value: number; subtitle: string; accent: string; icon: string }) {
  return (
    <div style={{
      background: "#1E293B", borderRadius: "12px", padding: "1.25rem",
      border: "1px solid #334155", transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <p style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: "600" }}>{title}</p>
        <span style={{ fontSize: "1.25rem" }}>{icon}</span>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: "800", color: "white", lineHeight: "1" }}>{value}</p>
      <p style={{ fontSize: "0.75rem", color: accent, marginTop: "0.375rem", fontWeight: "600" }}>{subtitle}</p>
    </div>
  );
}
