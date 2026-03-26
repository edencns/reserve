"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  maxCapacity: number;
  status: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem",
  background: "white", border: "1.5px solid #E9ECEF",
  borderRadius: "8px", color: "#1A1F36", fontSize: "0.9rem",
  outline: "none", boxSizing: "border-box",
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINS = ["00", "15", "30", "45"];

export default function EventEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    title: "", description: "", location: "", address: "",
    imageUrl: "", status: "ACTIVE",
    startDate: "", endDate: "",
    startHour: "10", startMin: "00",
    endHour: "18", endMin: "00",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) { router.push("/admin/events"); return; }
    const data: Event = await res.json();
    const sd = new Date(data.startDate);
    const ed = new Date(data.endDate);
    setForm({
      title: data.title,
      description: data.description,
      location: data.location,
      address: "",
      imageUrl: data.imageUrl ?? "",
      status: data.status,
      startDate: data.startDate.split("T")[0],
      endDate: data.endDate.split("T")[0],
      startHour: String(sd.getHours()).padStart(2, "0"),
      startMin: String(sd.getMinutes()).padStart(2, "0"),
      endHour: String(ed.getHours()).padStart(2, "0"),
      endMin: String(ed.getMinutes()).padStart(2, "0"),
    });
    setLoading(false);
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/events/${id}`);
    }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const startDate = `${form.startDate}T${form.startHour}:${form.startMin}:00`;
    const endDate   = `${form.endDate}T${form.endHour}:${form.endMin}:00`;
    await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        location: form.location,
        imageUrl: form.imageUrl || null,
        status: form.status,
        startDate, endDate,
      }),
    });
    setSaving(false);
    router.push("/admin/events");
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <AdminLayout title="행사 수정">
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #DBE4FF", borderTopColor: "#3B5BDB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </AdminLayout>
  );

  const days = form.startDate && form.endDate
    ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1
    : 0;

  return (
    <AdminLayout title="관리자">
      <form onSubmit={handleSave}>
        {/* Back + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <Link href="/admin/events" style={{ color: "#868E96", textDecoration: "none", fontSize: "1.25rem" }}>←</Link>
          <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#1A1F36" }}>행사 수정</h2>
        </div>

        <div style={{ maxWidth: "700px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* 기본 정보 */}
          <Section title="기본 정보">
            <Field label="행사명" required>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} required />
            </Field>

            <Field label="배너 이미지 URL">
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} style={inputStyle} placeholder="예) https://example.com/banner.jpg" />
              <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.375rem" }}>행사 페이지 상단에 표시될 이미지 URL을 입력하세요. 비워두면 기본 이미지가 표시됩니다.</p>
            </Field>

            <Field label="행사 안내">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
            </Field>

            <Field label="장소명" required>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} required />
            </Field>

            <Field label="주소">
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} placeholder="경기도 성남시 분당구..." />
            </Field>

            <Field label="행사 진행 시간">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#868E96" }}>시작</span>
                <select value={form.startHour} onChange={(e) => setForm({ ...form, startHour: e.target.value })} style={{ ...inputStyle, width: "80px" }}>
                  {HOURS.map((h) => <option key={h}>{h}</option>)}
                </select>
                <span>:</span>
                <select value={form.startMin} onChange={(e) => setForm({ ...form, startMin: e.target.value })} style={{ ...inputStyle, width: "70px" }}>
                  {MINS.map((m) => <option key={m}>{m}</option>)}
                </select>
                <span style={{ color: "#868E96" }}>—</span>
                <span style={{ fontSize: "0.8rem", color: "#868E96" }}>종료</span>
                <select value={form.endHour} onChange={(e) => setForm({ ...form, endHour: e.target.value })} style={{ ...inputStyle, width: "80px" }}>
                  {HOURS.map((h) => <option key={h}>{h}</option>)}
                </select>
                <span>:</span>
                <select value={form.endMin} onChange={(e) => setForm({ ...form, endMin: e.target.value })} style={{ ...inputStyle, width: "70px" }}>
                  {MINS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </Field>

            <Field label="상태">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="ACTIVE">예약 오픈</option>
                <option value="UPCOMING">예약 예정</option>
                <option value="CLOSED">예약 마감</option>
              </select>
            </Field>

            <Field label="예약 공유 URL">
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input readOnly value={shareUrl} style={{ ...inputStyle, flex: 1, color: "#868E96" }} />
                <button type="button" onClick={copyUrl} style={{
                  padding: "0 1rem", borderRadius: "8px", border: "none",
                  background: "#3B5BDB", color: "white", fontWeight: "600",
                  cursor: "pointer", fontSize: "0.875rem", whiteSpace: "nowrap",
                }}>
                  {copied ? "✓ 복사됨" : "🔗 URL 복사"}
                </button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.375rem" }}>링크를 클릭하면 예약 페이지로 이동합니다</p>
            </Field>
          </Section>

          {/* 예약 기간 */}
          <Section title="예약 기간">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="시작일" required>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} required />
              </Field>
              <Field label="종료일" required>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inputStyle} required />
              </Field>
            </div>
            {days > 0 && (
              <p style={{ fontSize: "0.8rem", color: "#868E96", marginTop: "0.5rem" }}>총 {days}일간 예약 운영</p>
            )}
          </Section>

          {/* 예약 정보 필드 */}
          <Section title="예약 정보 필드" subtitle="방문자에게 수집할 정보를 설정하세요">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "이름", type: "텍스트", required: true },
                { label: "연락처", type: "전화번호", required: true },
                { label: "이메일", type: "이메일", required: false },
                { label: "동호수", type: "텍스트", required: true },
                { label: "관심 서비스", type: "단일 선택", required: false, desc: "선택지: 인테리어, 가구-가전, 이사 서비스, 청소-입주 서비스, 기타" },
              ].map((f) => (
                <div key={f.label} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.75rem 1rem", borderRadius: "8px",
                  border: "1.5px solid #E9ECEF", background: "#FAFAFA",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1A1F36" }}>{f.label}</span>
                      <span style={{ fontSize: "0.75rem", color: "#868E96" }}>{f.type}</span>
                    </div>
                    {f.desc && <p style={{ fontSize: "0.75rem", color: "#868E96", marginTop: "0.2rem" }}>{f.desc}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                    <span style={{
                      padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700",
                      color: f.required ? "#3B5BDB" : "#868E96",
                      background: f.required ? "#DBE4FF" : "#F1F3F5",
                    }}>
                      {f.required ? "필수" : "선택"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", paddingBottom: "2rem" }}>
            <Link href="/admin/events" style={{
              flex: 1, padding: "0.875rem", borderRadius: "8px",
              border: "1.5px solid #E9ECEF", background: "white",
              color: "#1A1F36", fontWeight: "600", textDecoration: "none",
              textAlign: "center", fontSize: "0.9rem",
            }}>
              취소
            </Link>
            <button type="submit" disabled={saving} style={{
              flex: 2, padding: "0.875rem", borderRadius: "8px",
              border: "none", background: "#3B5BDB",
              color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem",
            }}>
              {saving ? "저장 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ borderBottom: "1px solid #E9ECEF", paddingBottom: "0.75rem" }}>
        <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#1A1F36" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: "0.8rem", color: "#868E96", marginTop: "0.2rem" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#1A1F36", marginBottom: "0.375rem" }}>
        {label}{required && <span style={{ color: "#FA5252" }}> *</span>}
      </label>
      {children}
    </div>
  );
}
