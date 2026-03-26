"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

interface Reservation {
  id: string;
  ticketNumber: string;
  name: string;
  phone: string;
  email: string;
  address: string | null;
  partySize: number;
  status: string;
  createdAt: string;
  checkedInAt: string | null;
  event: { title: string };
  timeSlot: { date: string; startTime: string; endTime: string };
}

const statusBadge = (status: string) => {
  if (status === "CHECKED_IN") return { label: "방문완료", color: "#2F9E44", bg: "#D3F9D8" };
  if (status === "CONFIRMED") return { label: "확정", color: "#3B5BDB", bg: "#DBE4FF" };
  return { label: "취소", color: "#C92A2A", bg: "#FFE3E3" };
};

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/reservations?${params}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setReservations(data.reservations ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [router, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCheckIn = async (ticketNumber: string) => {
    await fetch(`/api/kiosk/${ticketNumber}`, { method: "POST" });
    load();
  };

  const displayed = search
    ? reservations.filter((r) =>
        r.name.includes(search) || r.phone.includes(search) || r.ticketNumber.includes(search)
      )
    : reservations;

  const inputStyle: React.CSSProperties = {
    padding: "0.5rem 0.875rem", border: "1.5px solid #E9ECEF",
    borderRadius: "8px", outline: "none", fontSize: "0.875rem", color: "#1A1F36",
  };

  return (
    <AdminLayout title="예약 관리">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#1A1F36" }}>예약 관리</h2>
        <button style={{ ...inputStyle, background: "white", cursor: "pointer", fontWeight: "600" }}>↓ 엑셀</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름, 전화번호, 티켓번호 검색" style={{ ...inputStyle, flex: 1, minWidth: "200px", background: "white" }} />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ ...inputStyle, background: "white" }}>
          <option value="">전체 상태</option>
          <option value="CONFIRMED">확정</option>
          <option value="CHECKED_IN">방문완료</option>
          <option value="CANCELLED">취소</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", overflow: "hidden" }}>
        <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #E9ECEF" }}>
          <p style={{ fontSize: "0.85rem", color: "#868E96" }}>총 <strong style={{ color: "#1A1F36" }}>{total}건</strong></p>
        </div>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#868E96" }}>로딩 중...</div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#868E96" }}>예약이 없습니다</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
              <thead>
                <tr style={{ background: "#F8F9FA" }}>
                  {["예약자", "연락처", "행사", "방문일시", "상태", "관리"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.775rem", fontWeight: "700", color: "#868E96" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((r, idx) => {
                  const badge = statusBadge(r.status);
                  return (
                    <tr key={r.id} style={{ borderTop: idx > 0 ? "1px solid #F1F3F5" : "none" }}>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <p style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A1F36" }}>{r.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#868E96" }}>{r.partySize}명</p>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "#1A1F36" }}>{r.phone}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <p style={{ fontSize: "0.8rem", color: "#1A1F36", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.event.title}</p>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <p style={{ fontSize: "0.8rem", color: "#1A1F36" }}>{new Date(r.timeSlot.date).toLocaleDateString("ko-KR")}</p>
                        <p style={{ fontSize: "0.75rem", color: "#868E96" }}>{r.timeSlot.startTime}~{r.timeSlot.endTime}</p>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{ padding: "0.2rem 0.625rem", borderRadius: "20px", fontSize: "0.725rem", fontWeight: "700", color: badge.color, background: badge.bg }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        {r.status === "CONFIRMED" && (
                          <button onClick={() => handleCheckIn(r.ticketNumber)} style={{ padding: "0.3rem 0.75rem", border: "none", borderRadius: "6px", background: "#D3F9D8", color: "#2F9E44", fontWeight: "600", fontSize: "0.75rem", cursor: "pointer" }}>
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
        )}
        {/* Pagination */}
        {total > pageSize && (
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #E9ECEF", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #E9ECEF",
                background: page === p ? "#3B5BDB" : "white", color: page === p ? "white" : "#1A1F36",
                cursor: "pointer", fontWeight: "600", fontSize: "0.8rem",
              }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
