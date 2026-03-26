"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

interface MonthStat { label: string; reservations: number; visitors: number }
interface TimeStat  { time: string; count: number }
interface EventStat { id: string; title: string; totalCapacity: number | null; reservations: number; visitors: number; visitRate: number }

interface MonthlyData {
  months: MonthStat[];
  timeStats: TimeStat[];
  eventStats: EventStat[];
}

function BarChart({ data, valueKey, color, maxVal }: { data: MonthStat[]; valueKey: "reservations" | "visitors"; color: string; maxVal: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.375rem", height: "160px", padding: "0 0.5rem" }}>
      {data.map((d) => {
        const val = d[valueKey];
        const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
        return (
          <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", height: "100%", justifyContent: "flex-end" }}>
            {val > 0 && <span style={{ fontSize: "0.7rem", color: "#1A1F36", fontWeight: "700" }}>{val}</span>}
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: color,
              height: pct > 0 ? `${Math.max(pct, 4)}%` : "4px",
              transition: "height 0.4s ease",
            }} />
            <span style={{ fontSize: "0.7rem", color: "#868E96" }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const [data, setData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/admin/monthly-stats")
      .then((r) => { if (r.status === 401) { router.push("/admin/login"); return null; } return r.json(); })
      .then((d) => { if (d) setData(d); setLoading(false); })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  if (loading) return (
    <AdminLayout title="통계">
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #DBE4FF", borderTopColor: "#3B5BDB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </AdminLayout>
  );

  const maxRes = Math.max(...(data?.months.map((m) => m.reservations) ?? [0]), 1);
  const maxVis = Math.max(...(data?.months.map((m) => m.visitors) ?? [0]), 1);
  const maxTime = Math.max(...(data?.timeStats.map((t) => t.count) ?? [0]), 1);

  const filteredEvents = selectedEvent === "ALL"
    ? data?.eventStats
    : data?.eventStats.filter((e) => e.id === selectedEvent);

  return (
    <AdminLayout title="통계">
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#1A1F36" }}>통계</h2>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            style={{ padding: "0.4rem 0.875rem", border: "1.5px solid #E9ECEF", borderRadius: "8px", fontSize: "0.875rem", color: "#1A1F36", outline: "none" }}>
            <option value="ALL">전체 행사</option>
            {data?.eventStats.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          <button style={{ padding: "0.4rem 1rem", border: "1.5px solid #E9ECEF", borderRadius: "8px", background: "white", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600", color: "#1A1F36" }}>
            ↓ 엑셀
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Monthly Reservations */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "1.25rem" }}>
          <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#1A1F36", marginBottom: "1.25rem" }}>월별 예약 건수</h3>
          <BarChart data={data?.months ?? []} valueKey="reservations" color="#3B5BDB" maxVal={maxRes} />
        </div>

        {/* Monthly Visitors */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "1.25rem" }}>
          <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#1A1F36", marginBottom: "1.25rem" }}>월별 방문 인원</h3>
          <BarChart data={data?.months ?? []} valueKey="visitors" color="#BEC8FF" maxVal={maxVis} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {/* Event visit stats */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "1.25rem" }}>
            <p style={{ fontWeight: "700", fontSize: "1rem", color: "#1A1F36", marginBottom: "0.375rem" }}>행사별 방문 현황</p>
            <p style={{ fontSize: "0.75rem", color: "#868E96", marginBottom: "1rem" }}>행사명을 클릭하면 방문자 목록을 볼 수 있습니다</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(filteredEvents ?? []).map((e, idx) => {
                const pct = e.totalCapacity ? Math.round((e.reservations / e.totalCapacity) * 100) : 0;
                return (
                  <div key={e.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#868E96", marginRight: "0.5rem" }}>{idx + 1}</span>
                        <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#3B5BDB", cursor: "pointer" }}>{e.title}</span>
                      </div>
                      <button style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem", border: "1px solid #E9ECEF", borderRadius: "4px", background: "white", cursor: "pointer", color: "#1A1F36" }}>
                        총 가구수
                      </button>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#F1F3F5", borderRadius: "3px", marginBottom: "0.5rem" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#3B5BDB", borderRadius: "3px", transition: "width 0.4s" }} />
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                      {[
                        { label: "총 가구수", value: e.totalCapacity ? `${e.totalCapacity}` : "-" },
                        { label: "예약건수", value: String(e.reservations), color: "#3B5BDB" },
                        { label: "예약%", value: e.totalCapacity ? `${pct}%` : "-" },
                        { label: "방문건수", value: String(e.visitors), color: "#3B5BDB" },
                        { label: "방문%", value: e.visitRate ? `${e.visitRate}%` : "0%", color: "#3B5BDB" },
                      ].map((item) => (
                        <div key={item.label} style={{ textAlign: "center" }}>
                          <p style={{ fontSize: "0.875rem", fontWeight: "700", color: item.color ?? "#1A1F36" }}>{item.value}</p>
                          <p style={{ fontSize: "0.7rem", color: "#868E96" }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {(filteredEvents ?? []).length === 0 && (
                <p style={{ color: "#868E96", fontSize: "0.875rem", textAlign: "center", padding: "2rem 0" }}>데이터가 없습니다</p>
              )}
            </div>
          </div>

          {/* Time stats */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "1.25rem" }}>
            <p style={{ fontWeight: "700", fontSize: "1rem", color: "#1A1F36", marginBottom: "0.375rem" }}>시간대별 방문 인원</p>
            <p style={{ fontSize: "0.75rem", color: "#868E96", marginBottom: "1rem" }}>시간대를 클릭하면 방문자 목록을 볼 수 있습니다</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(data?.timeStats ?? []).map((t) => {
                const pct = (t.count / maxTime) * 100;
                return (
                  <div key={t.time} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1A1F36", minWidth: "50px" }}>{t.time}</span>
                    <div style={{ flex: 1, height: "20px", background: "#F1F3F5", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#BEC8FF", borderRadius: "4px", transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#1A1F36", fontWeight: "600", minWidth: "60px", textAlign: "right" }}>
                      {t.count}명 ({t.count}건)
                    </span>
                  </div>
                );
              })}
              {(data?.timeStats ?? []).length === 0 && (
                <p style={{ color: "#868E96", fontSize: "0.875rem", textAlign: "center", padding: "2rem 0" }}>방문 데이터가 없습니다</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
