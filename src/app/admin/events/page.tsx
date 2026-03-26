"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReservationTable from "@/components/admin/ReservationTable";

interface Event {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  status: string;
  _count: { reservations: number; timeSlots: number };
}

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

interface NewEventForm {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxCapacity: string;
  status: string;
  imageUrl: string;
}

interface NewSlotForm {
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: string;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: "", description: "", location: "",
    startDate: "", endDate: "", maxCapacity: "100",
    status: "UPCOMING", imageUrl: "",
  });

  const [newSlot, setNewSlot] = useState<NewSlotForm>({
    date: "", startTime: "10:00", endTime: "11:00", maxCapacity: "20",
  });

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setEvents(data);
        setLoading(false);
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  useEffect(() => {
    if (!selectedEvent) return;
    fetch(`/api/admin/reservations?eventId=${selectedEvent}`)
      .then((r) => r.json())
      .then((data) => setReservations(data.reservations || []));
  }, [selectedEvent]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newEvent, maxCapacity: Number(newEvent.maxCapacity) }),
    });

    const data = await res.json();
    if (!res.ok) {
      setCreateError(data.error || "생성 실패");
      setCreating(false);
      return;
    }

    setEvents([data, ...events]);
    setShowCreateForm(false);
    setNewEvent({ title: "", description: "", location: "", startDate: "", endDate: "", maxCapacity: "100", status: "UPCOMING", imageUrl: "" });
    setCreating(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("이 행사를 삭제하시겠습니까? 관련 예약도 모두 삭제됩니다.")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents(events.filter((e) => e.id !== id));
    if (selectedEvent === id) setSelectedEvent(null);
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const res = await fetch(`/api/events/${selectedEvent}/timeslots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlot, maxCapacity: Number(newSlot.maxCapacity) }),
    });

    if (res.ok) {
      setShowSlotForm(false);
      setNewSlot({ date: "", startTime: "10:00", endTime: "11:00", maxCapacity: "20" });
      // Refresh events
      const evRes = await fetch("/api/admin/events");
      const evData = await evRes.json();
      setEvents(evData);
    }
  };

  const handleCheckIn = async (ticketNumber: string) => {
    await fetch(`/api/kiosk/${ticketNumber}`, { method: "POST" });
    if (!selectedEvent) return;
    const res = await fetch(`/api/admin/reservations?eventId=${selectedEvent}`);
    const data = await res.json();
    setReservations(data.reservations || []);
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: "진행중", UPCOMING: "예정", CLOSED: "종료",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#13172b", color: "white" }}>
      <header style={{ backgroundColor: "#1e2342", borderBottom: "1px solid #2d3561", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>🏢 관리자 대시보드</span>
            <nav style={{ display: "flex", gap: "1.25rem" }}>
              <Link href="/admin/dashboard" style={{ color: "#adb5bd", textDecoration: "none", fontSize: "0.9rem" }}>대시보드</Link>
              <Link href="/admin/events" style={{ color: "#3B5BDB", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>행사 관리</Link>
            </nav>
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid #4a5568", color: "#adb5bd", padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem" }}>
            로그아웃
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontWeight: "700", fontSize: "1.5rem" }}>행사 관리</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ backgroundColor: "#3B5BDB", color: "white", border: "none", borderRadius: "8px", padding: "0.625rem 1.25rem", fontWeight: "600", cursor: "pointer" }}>
            + 새 행사 등록
          </button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div style={{ background: "#1e2342", border: "1px solid #2d3561", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontWeight: "700", marginBottom: "1.25rem" }}>새 행사 등록</h2>
            <form onSubmit={handleCreateEvent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="행사명">
                  <input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    style={inputStyle} placeholder="2024 강남 아파트 입주박람회" required />
                </FormField>
                <FormField label="장소">
                  <input value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    style={inputStyle} placeholder="COEX 전시관 A홀" required />
                </FormField>
                <FormField label="시작일">
                  <input type="datetime-local" value={newEvent.startDate} onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    style={inputStyle} required />
                </FormField>
                <FormField label="종료일">
                  <input type="datetime-local" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    style={inputStyle} required />
                </FormField>
                <FormField label="최대 수용인원">
                  <input type="number" value={newEvent.maxCapacity} onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: e.target.value })}
                    style={inputStyle} min="1" required />
                </FormField>
                <FormField label="상태">
                  <select value={newEvent.status} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                    style={inputStyle}>
                    <option value="UPCOMING">예정</option>
                    <option value="ACTIVE">진행중</option>
                    <option value="CLOSED">종료</option>
                  </select>
                </FormField>
                <FormField label="이미지 URL (선택)">
                  <input value={newEvent.imageUrl} onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                    style={inputStyle} placeholder="https://..." />
                </FormField>
              </div>
              <FormField label="행사 설명">
                <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                  placeholder="행사 설명을 입력해주세요..." required />
              </FormField>

              {createError && (
                <p style={{ color: "#FF6B6B", fontSize: "0.875rem", marginBottom: "1rem" }}>{createError}</p>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" disabled={creating}
                  style={{ backgroundColor: "#3B5BDB", color: "white", border: "none", borderRadius: "8px", padding: "0.625rem 1.25rem", fontWeight: "600", cursor: "pointer" }}>
                  {creating ? "등록 중..." : "등록"}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)}
                  style={{ background: "none", border: "1px solid #4a5568", color: "#adb5bd", borderRadius: "8px", padding: "0.625rem 1.25rem", cursor: "pointer" }}>
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" }}>
          {/* Event List */}
          <div style={{ background: "#1e2342", borderRadius: "16px", border: "1px solid #2d3561", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #2d3561" }}>
              <h2 style={{ fontWeight: "700", fontSize: "0.95rem" }}>행사 목록 ({events.length})</h2>
            </div>
            {loading ? (
              <p style={{ padding: "1.5rem", color: "#adb5bd" }}>로딩 중...</p>
            ) : events.length === 0 ? (
              <p style={{ padding: "1.5rem", color: "#adb5bd" }}>등록된 행사가 없습니다</p>
            ) : (
              <div>
                {events.map((event) => (
                  <div key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid #1a1f36",
                      cursor: "pointer",
                      background: selectedEvent === event.id ? "#252b4a" : "transparent",
                      transition: "background 0.15s",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ fontWeight: "600", fontSize: "0.9rem", flex: 1, marginRight: "0.5rem", lineHeight: "1.3" }}>
                        {event.title}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                        style={{ background: "none", border: "none", color: "#FF6B6B", cursor: "pointer", fontSize: "0.8rem", flexShrink: 0 }}>
                        삭제
                      </button>
                    </div>
                    <p style={{ color: "#868e96", fontSize: "0.75rem", marginTop: "0.25rem" }}>{event.location}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", color: event.status === "ACTIVE" ? "#51CF66" : event.status === "UPCOMING" ? "#74c0fc" : "#868e96" }}>
                        {statusLabel[event.status]}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#868e96" }}>
                        예약 {event._count.reservations}건
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Detail & Reservations */}
          <div>
            {selectedEvent ? (
              <>
                <div style={{ background: "#1e2342", borderRadius: "16px", border: "1px solid #2d3561", marginBottom: "1rem", overflow: "hidden" }}>
                  <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #2d3561", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontWeight: "700", fontSize: "0.95rem" }}>시간대 관리</h2>
                    <button onClick={() => setShowSlotForm(!showSlotForm)}
                      style={{ backgroundColor: "#2d3561", color: "white", border: "none", borderRadius: "6px", padding: "0.375rem 0.875rem", cursor: "pointer", fontSize: "0.8rem" }}>
                      + 시간대 추가
                    </button>
                  </div>

                  {showSlotForm && (
                    <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #2d3561" }}>
                      <form onSubmit={handleCreateSlot}>
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                          <div>
                            <label style={{ display: "block", color: "#adb5bd", fontSize: "0.75rem", marginBottom: "0.25rem" }}>날짜</label>
                            <input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                              style={{ ...inputStyle, padding: "0.4rem 0.6rem" }} required />
                          </div>
                          <div>
                            <label style={{ display: "block", color: "#adb5bd", fontSize: "0.75rem", marginBottom: "0.25rem" }}>시작</label>
                            <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                              style={{ ...inputStyle, padding: "0.4rem 0.6rem" }} required />
                          </div>
                          <div>
                            <label style={{ display: "block", color: "#adb5bd", fontSize: "0.75rem", marginBottom: "0.25rem" }}>종료</label>
                            <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                              style={{ ...inputStyle, padding: "0.4rem 0.6rem" }} required />
                          </div>
                          <div>
                            <label style={{ display: "block", color: "#adb5bd", fontSize: "0.75rem", marginBottom: "0.25rem" }}>최대</label>
                            <input type="number" value={newSlot.maxCapacity} onChange={(e) => setNewSlot({ ...newSlot, maxCapacity: e.target.value })}
                              style={{ ...inputStyle, padding: "0.4rem 0.6rem", width: "80px" }} min="1" required />
                          </div>
                          <button type="submit" style={{ backgroundColor: "#3B5BDB", color: "white", border: "none", borderRadius: "6px", padding: "0.4rem 0.875rem", cursor: "pointer", fontWeight: "600", fontSize: "0.875rem" }}>
                            추가
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                <div style={{ background: "#1e2342", borderRadius: "16px", border: "1px solid #2d3561", overflow: "hidden" }}>
                  <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #2d3561" }}>
                    <h2 style={{ fontWeight: "700", fontSize: "0.95rem" }}>예약 목록 ({reservations.length})</h2>
                  </div>
                  <ReservationTable reservations={reservations} onCheckIn={handleCheckIn} />
                </div>
              </>
            ) : (
              <div style={{
                background: "#1e2342", borderRadius: "16px", border: "1px solid #2d3561",
                padding: "4rem", textAlign: "center", color: "#868e96",
              }}>
                <p style={{ fontSize: "2rem" }}>👈</p>
                <p>왼쪽에서 행사를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.625rem 0.875rem",
  background: "#13172b", border: "1px solid #2d3561",
  borderRadius: "8px", color: "white", fontSize: "0.9rem",
  outline: "none", boxSizing: "border-box",
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", color: "#adb5bd", fontSize: "0.8rem", marginBottom: "0.375rem" }}>{label}</label>
      {children}
    </div>
  );
}
