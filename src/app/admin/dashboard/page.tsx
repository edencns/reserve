"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

interface OngoingEvent {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  _count: { reservations: number };
}

interface Reservation {
  id: string;
  ticketNumber: string;
  name: string;
  phone: string;
  partySize: number;
  status: string;
  createdAt: string;
  checkedInAt?: string | null;
  event: { title: string };
  timeSlot: { date: string; startTime: string; endTime: string };
}

interface Stats {
  totalReservations: number;
  todayReservations: number;
  checkedInReservations: number;
  totalEvents: number;
  recentReservations: Reservation[];
  ongoingEvents: OngoingEvent[];
}

const statusBadge = (status: string) => {
  if (status === "CHECKED_IN") return { label: "방문완료", color: "#2F9E44", bg: "#D3F9D8" };
  if (status === "CONFIRMED") return { label: "확정", color: "#3B5BDB", bg: "#DBE4FF" };
  if (status === "CANCELLED") return { label: "취소", color: "#C92A2A", bg: "#FFE3E3" };
  return { label: status, color: "#868E96", bg: "#F1F3F5" };
};

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
      .then((data) => { if (data) setStats(data); setLoading(false); })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid #DBE4FF", borderTopColor: "#3B5BDB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const statCards = [
    { label: "총 예약", value: stats?.totalReservations ?? 0, icon: "🎫", color: "#3B5BDB", bg: "#EEF2FF" },
    { label: "이번 달 예약", value: stats?.todayReservations ?? 0, icon: "📅", color: "#0CA678", bg: "#E6FCF5" },
    { label: "오늘 방문 예약", value: 0, icon: "🕐", color: "#F59F00", bg: "#FFF9DB" },
    { label: "총 방문 인원", value: stats?.checkedInReservations ?? 0, icon: "👥", color: "#E64980", bg: "#FFE0EB" },
  ];

  return (
    <AdminLayout title="대시보드">
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: "white", borderRadius: "12px", padding: "1.25rem",
            border: "1px solid #E9ECEF", display: "flex", alignItems: "center", gap: "1rem",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: card.bg, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: "0.775rem", color: "#868E96", fontWeight: "500", marginBottom: "0.25rem" }}>{card.label}</p>
              <p style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1A1F36", lineHeight: "1" }}>
                {card.value.toLocaleString()}<span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#868E96" }}>건</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Recent Reservations + Ongoing Events */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Recent Reservations */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E9ECEF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#1A1F36" }}>최근 예약</h2>
            <Link href="/admin/reservations" style={{ fontSize: "0.8rem", color: "#3B5BDB", textDecoration: "none", fontWeight: "600" }}>
              전체 보기
            </Link>
          </div>
          {(stats?.recentReservations ?? []).length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#868E96" }}>예약이 없습니다</div>
          ) : (
            <div>
              {(stats?.recentReservations ?? []).map((r, idx) => {
                const badge = statusBadge(r.status);
                return (
                  <div key={r.id} style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: idx < (stats?.recentReservations.length ?? 0) - 1 ? "1px solid #F1F3F5" : "none",
                    display: "flex", alignItems: "center", gap: "0.875rem",
                  }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#3B5BDB", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "700", fontSize: "0.875rem", flexShrink: 0,
                    }}>
                      {r.partySize}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A1F36", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.event.title}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.125rem" }}>
                        {r.ticketNumber.slice(0, 16)}... · {r.timeSlot?.date ? new Date(r.timeSlot.date).toLocaleDateString("ko-KR") : "시간 미지정"}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.775rem", fontWeight: "600", color: "#1A1F36" }}>{r.partySize}명</span>
                      <span style={{
                        padding: "0.2rem 0.5rem", borderRadius: "4px",
                        fontSize: "0.7rem", fontWeight: "700",
                        color: badge.color, background: badge.bg,
                      }}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ongoing Events */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E9ECEF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#1A1F36" }}>진행 중 행사</h2>
            <Link href="/admin/events" style={{ fontSize: "0.8rem", color: "#3B5BDB", textDecoration: "none", fontWeight: "600" }}>
              전체 보기
            </Link>
          </div>
          {(stats?.ongoingEvents ?? []).length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#868E96" }}>진행 중인 행사가 없습니다</div>
          ) : (
            <div>
              {(stats?.ongoingEvents ?? []).map((e, idx) => {
                const days = Math.ceil((new Date(e.endDate).getTime() - new Date(e.startDate).getTime()) / 86400000);
                return (
                  <div key={e.id} style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: idx < (stats?.ongoingEvents.length ?? 0) - 1 ? "1px solid #F1F3F5" : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A1F36", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.title}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.125rem" }}>
                          {e.location}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.125rem" }}>
                          {days}일 운영
                        </p>
                      </div>
                      <span style={{ padding: "0.2rem 0.625rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", color: "#2F9E44", background: "#D3F9D8", flexShrink: 0, marginLeft: "0.5rem" }}>
                        오픈
                      </span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#3B5BDB", marginTop: "0.375rem" }}>
                      예약 {e._count.reservations}건 · {e._count.reservations}명
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
}
