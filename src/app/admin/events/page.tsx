"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

interface Event {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  status: string;
  _count: { reservations: number };
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:   { label: "오픈",    color: "#2F9E44", bg: "#D3F9D8" },
  UPCOMING: { label: "예정",    color: "#3B5BDB", bg: "#DBE4FF" },
  CLOSED:   { label: "마감",    color: "#868E96", bg: "#F1F3F5" },
  DRAFT:    { label: "임시저장", color: "#F59F00", bg: "#FFF9DB" },
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", description: "", location: "", address: "",
    startDate: "", endDate: "", maxCapacity: "100", status: "UPCOMING", imageUrl: "",
    startHour: "10", startMin: "00", endHour: "18", endMin: "00",
  });

  const loadEvents = useCallback(async () => {
    const res = await fetch("/api/admin/events");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  useEffect(() => {
    let list = events;
    if (statusFilter !== "ALL") list = list.filter((e) => e.status === statusFilter);
    if (search) list = list.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [events, statusFilter, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        address: newEvent.address,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        maxCapacity: Number(newEvent.maxCapacity),
        status: newEvent.status,
        imageUrl: newEvent.imageUrl || null,
      }),
    });
    if (res.ok) {
      await loadEvents();
      setShowCreate(false);
      setNewEvent({ title: "", description: "", location: "", address: "", startDate: "", endDate: "", maxCapacity: "100", status: "UPCOMING", imageUrl: "", startHour: "10", startMin: "00", endHour: "18", endMin: "00" });
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 행사를 삭제하시겠습니까?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const filterBtns = [
    { key: "ALL", label: "전체" },
    { key: "ACTIVE", label: "오픈" },
    { key: "CLOSED", label: "마감" },
    { key: "DRAFT", label: "임시저장" },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.625rem 0.875rem",
    background: "white", border: "1.5px solid #E9ECEF",
    borderRadius: "8px", color: "#1A1F36", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <AdminLayout title="이벤트 관리">
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#1A1F36" }}>행사 관리</h2>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button style={{
            padding: "0.5rem 1rem", borderRadius: "8px",
            border: "1.5px solid #E9ECEF", background: "white",
            color: "#1A1F36", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.375rem",
          }}>
            ↓ 엑셀
          </button>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px",
              border: "none", background: "#3B5BDB",
              color: "white", fontSize: "0.875rem", fontWeight: "700", cursor: "pointer",
            }}>
            + 새 행사 등록
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#868E96", fontSize: "1rem" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="행사명, 장소 검색"
            style={{ ...inputStyle, paddingLeft: "2.5rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          {filterBtns.map((b) => (
            <button key={b.key} onClick={() => setStatusFilter(b.key)} style={{
              padding: "0.4rem 0.875rem", borderRadius: "6px",
              border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600",
              background: statusFilter === b.key ? "#3B5BDB" : "#F1F3F5",
              color: statusFilter === b.key ? "white" : "#868E96",
              transition: "all 0.15s",
            }}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", overflow: "hidden" }}>
        <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #E9ECEF" }}>
          <p style={{ fontSize: "0.85rem", color: "#868E96" }}>총 <strong style={{ color: "#1A1F36" }}>{filtered.length}건</strong></p>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#868E96" }}>로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#868E96" }}>등록된 행사가 없습니다</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8F9FA" }}>
                {["행사명", "기간", "예약 수", "상태", "관리"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.8rem", fontWeight: "700", color: "#868E96", letterSpacing: "0.03em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => {
                const badge = statusMap[event.status] ?? statusMap.UPCOMING;
                const start = new Date(event.startDate).toLocaleDateString("ko-KR", { year: "numeric", month: "numeric", day: "numeric", weekday: "short" });
                const end   = new Date(event.endDate  ).toLocaleDateString("ko-KR", { year: "numeric", month: "numeric", day: "numeric", weekday: "short" });
                return (
                  <tr key={event.id} style={{ borderTop: idx > 0 ? "1px solid #F1F3F5" : "none", transition: "background 0.1s" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <Link href={`/admin/events/${event.id}/edit`} style={{ fontWeight: "600", fontSize: "0.9rem", color: "#3B5BDB", textDecoration: "none" }}>
                        {event.title}
                      </Link>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <p style={{ fontSize: "0.8rem", color: "#1A1F36" }}>{start}</p>
                      <p style={{ fontSize: "0.8rem", color: "#868E96" }}>~ {end}</p>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ fontWeight: "700", color: "#3B5BDB", fontSize: "0.9rem" }}>{event._count.reservations}건</span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.775rem", fontWeight: "700", color: badge.color, background: badge.bg }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <Link href={`/events/${event.id}`} target="_blank" title="사이트 보기" style={{ color: "#868E96", fontSize: "1rem", textDecoration: "none" }}>↗</Link>
                        <Link href={`/admin/events/${event.id}/edit`} title="편집" style={{ color: "#868E96", fontSize: "1rem", textDecoration: "none" }}>✏️</Link>
                        <button onClick={() => handleDelete(event.id)} title="삭제" style={{ background: "none", border: "none", cursor: "pointer", color: "#868E96", fontSize: "1rem", padding: 0 }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "1rem",
        }}>
          <div style={{
            background: "white", borderRadius: "16px",
            width: "100%", maxWidth: "640px", maxHeight: "90vh",
            overflowY: "auto", padding: "1.5rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: "700", fontSize: "1.1rem", color: "#1A1F36" }}>새 행사 등록</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "#868E96" }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Field label="행사명 *"><input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} style={inputStyle} required /></Field>
                <Field label="장소명 *"><input value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} style={inputStyle} required /></Field>
                <Field label="주소"><input value={newEvent.address} onChange={(e) => setNewEvent({ ...newEvent, address: e.target.value })} style={inputStyle} /></Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="시작일 *"><input type="datetime-local" value={newEvent.startDate} onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })} style={inputStyle} required /></Field>
                  <Field label="종료일 *"><input type="datetime-local" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })} style={inputStyle} required /></Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="최대 수용인원"><input type="number" value={newEvent.maxCapacity} onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: e.target.value })} style={inputStyle} min="1" /></Field>
                  <Field label="상태">
                    <select value={newEvent.status} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })} style={inputStyle}>
                      <option value="UPCOMING">예정</option>
                      <option value="ACTIVE">오픈</option>
                      <option value="CLOSED">마감</option>
                    </select>
                  </Field>
                </div>
                <Field label="행사 안내">
                  <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                </Field>
                <Field label="배너 이미지 URL">
                  <input value={newEvent.imageUrl} onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })} style={inputStyle} placeholder="https://..." />
                </Field>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "0.75rem", border: "1.5px solid #E9ECEF", borderRadius: "8px", background: "white", cursor: "pointer", fontWeight: "600", color: "#1A1F36" }}>취소</button>
                <button type="submit" disabled={creating} style={{ flex: 2, padding: "0.75rem", border: "none", borderRadius: "8px", background: "#3B5BDB", color: "white", fontWeight: "700", cursor: "pointer" }}>
                  {creating ? "등록 중..." : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#1A1F36", marginBottom: "0.375rem" }}>{label}</label>
      {children}
    </div>
  );
}
