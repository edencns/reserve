"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PrivacyModal from "./PrivacyModal";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentCount: number;
}

interface Event {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  timeSlots: TimeSlot[];
}

interface ReservationFormProps {
  event: Event;
}

type Step = 1 | 2 | 3;

function groupByDate(slots: TimeSlot[]) {
  const map = new Map<string, TimeSlot[]>();
  for (const s of slots) {
    const dateKey = new Date(s.date).toLocaleDateString("ko-KR", {
      month: "long", day: "numeric", weekday: "short",
    });
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(s);
  }
  return map;
}

export default function ReservationForm({ event }: ReservationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", address: "",
    partySize: 1, timeSlotId: "",
    privacyConsent: false, marketingConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedSlot = event.timeSlots.find((s) => s.id === formData.timeSlotId);
  const slotsByDate = groupByDate(event.timeSlots);

  function validate1() {
    const e: Record<string, string> = {};
    if (!formData.name || formData.name.length < 2) e.name = "이름을 2자 이상 입력해주세요";
    if (!formData.phone || !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(formData.phone)) e.phone = "올바른 휴대폰 번호를 입력해주세요";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "올바른 이메일을 입력해주세요";
    if (!formData.privacyConsent) e.privacyConsent = "개인정보 수집에 동의해주세요";
    return e;
  }

  function validate2() {
    const e: Record<string, string> = {};
    if (!formData.timeSlotId) e.timeSlotId = "방문 시간대를 선택해주세요";
    return e;
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ...formData,
          partySize: Number(formData.partySize),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "예약 중 오류가 발생했습니다" });
        setLoading(false);
        return;
      }

      router.push(`/confirmation/${data.ticketNumber}`);
    } catch {
      setErrors({ submit: "네트워크 오류가 발생했습니다. 다시 시도해주세요." });
      setLoading(false);
    }
  }

  const steps = [
    { num: 1, label: "개인정보" },
    { num: 2, label: "날짜 선택" },
    { num: 3, label: "최종 확인" },
  ];

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0, minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
              <div className={`step-circle ${step > s.num ? "completed" : step === s.num ? "active" : "inactive"}`}>
                {step > s.num ? "✓" : s.num}
              </div>
              <span style={{
                fontSize: "0.72rem", fontWeight: step === s.num ? "700" : "500",
                color: step === s.num ? "var(--color-primary)" : "var(--color-text-secondary)",
                whiteSpace: "nowrap",
              }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "2px",
                background: step > s.num + 1 ? "var(--color-success)" : step > s.num ? "var(--color-primary)" : "var(--color-border)",
                margin: "0 0.5rem", marginBottom: "1.25rem",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: "white", borderRadius: "16px",
        padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid var(--color-border)",
      }}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.375rem", color: "var(--color-text-primary)" }}>
              방문자 정보 입력
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>
              예약에 필요한 기본 정보를 입력해주세요
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="성명" required error={errors.name}>
                <input type="text" className={`form-input${errors.name ? " error" : ""}`} value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동" />
              </Field>

              <Field label="휴대폰 번호" required error={errors.phone}>
                <input type="tel" className={`form-input${errors.phone ? " error" : ""}`} value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678" />
              </Field>

              <Field label="이메일" required error={errors.email}>
                <input type="email" className={`form-input${errors.email ? " error" : ""}`} value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com" />
              </Field>

              <Field label="주소 (선택)">
                <input type="text" className="form-input" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="관심 지역 또는 현재 주소" />
              </Field>

              <Field label="방문 인원" required>
                <select className="form-input" value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}명</option>
                  ))}
                </select>
              </Field>

              {/* Privacy consent */}
              <div style={{
                background: "#F8F9FA", borderRadius: "10px", padding: "1.25rem",
                border: errors.privacyConsent ? "2px solid var(--color-error)" : "1.5px solid var(--color-border)",
                transition: "border-color 0.2s",
              }}>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginBottom: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  개인정보 동의
                </p>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginBottom: "0.875rem" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "1px",
                    background: formData.privacyConsent ? "var(--color-primary)" : "white",
                    border: `2px solid ${formData.privacyConsent ? "var(--color-primary)" : "var(--color-border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", cursor: "pointer",
                  }} onClick={() => setFormData({ ...formData, privacyConsent: !formData.privacyConsent })}>
                    {formData.privacyConsent && <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "var(--color-text-primary)" }}>
                    <strong>[필수]</strong> 개인정보 수집 및 이용에 동의합니다.{" "}
                    <button type="button" onClick={() => setPrivacyOpen(true)}
                      style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "inherit", padding: 0 }}>
                      내용보기
                    </button>
                  </span>
                </label>
                {errors.privacyConsent && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>{errors.privacyConsent}</p>
                )}

                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "1px",
                    background: formData.marketingConsent ? "var(--color-primary)" : "white",
                    border: `2px solid ${formData.marketingConsent ? "var(--color-primary)" : "var(--color-border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", cursor: "pointer",
                  }} onClick={() => setFormData({ ...formData, marketingConsent: !formData.marketingConsent })}>
                    {formData.marketingConsent && <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                    <strong>[선택]</strong> 마케팅 정보 수신에 동의합니다.
                  </span>
                </label>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: "1.75rem", padding: "0.875rem" }}
              onClick={() => {
                const e = validate1();
                if (Object.keys(e).length > 0) { setErrors(e); return; }
                setErrors({});
                setStep(2);
              }}>
              다음 단계 →
            </button>
          </div>
        )}

        {/* Step 2: Time Slot */}
        {step === 2 && (
          <div>
            <h2 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.375rem", color: "var(--color-text-primary)" }}>
              방문 일시 선택
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              📍 {event.location}
            </p>

            {event.timeSlots.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 2rem", color: "var(--color-text-secondary)", background: "#F8F9FA", borderRadius: "10px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📅</div>
                <p style={{ fontWeight: "600" }}>등록된 시간대가 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {Array.from(slotsByDate.entries()).map(([date, slots]) => (
                  <div key={date}>
                    <h3 style={{
                      fontWeight: "700", fontSize: "0.9rem", color: "var(--color-text-secondary)",
                      marginBottom: "0.75rem", padding: "0.5rem 0",
                      borderBottom: "2px solid var(--color-border)",
                      display: "flex", alignItems: "center", gap: "0.5rem",
                    }}>
                      📅 {date}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                      {slots.map((slot) => {
                        const available = slot.maxCapacity - slot.currentCount;
                        const isFull = available < formData.partySize;
                        const isSelected = formData.timeSlotId === slot.id;

                        return (
                          <button key={slot.id}
                            disabled={isFull}
                            onClick={() => setFormData({ ...formData, timeSlotId: slot.id })}
                            style={{
                              padding: "0.875rem",
                              borderRadius: "10px",
                              border: isSelected ? "2px solid var(--color-primary)" : "1.5px solid var(--color-border)",
                              background: isSelected ? "#EEF2FF" : isFull ? "#F8F9FA" : "white",
                              cursor: isFull ? "not-allowed" : "pointer",
                              opacity: isFull ? 0.55 : 1,
                              transition: "all 0.15s",
                              textAlign: "center",
                              boxShadow: isSelected ? "0 0 0 3px rgba(59,91,219,0.15)" : "none",
                            }}>
                            <p style={{ fontWeight: "700", fontSize: "0.9rem", color: isSelected ? "var(--color-primary)" : "var(--color-text-primary)" }}>
                              {slot.startTime}
                            </p>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>~ {slot.endTime}</p>
                            <p style={{ fontSize: "0.72rem", marginTop: "0.375rem", color: isFull ? "var(--color-error)" : "var(--color-success)", fontWeight: "700" }}>
                              {isFull ? "마감" : `잔여 ${available}명`}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.timeSlotId && (
              <p style={{ color: "var(--color-error)", fontSize: "0.875rem", marginTop: "1rem", fontWeight: "500" }}>
                ⚠ {errors.timeSlotId}
              </p>
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
              <button
                style={{
                  flex: 1, padding: "0.875rem", borderRadius: "var(--radius-btn)",
                  border: "1.5px solid var(--color-border)", background: "white",
                  cursor: "pointer", fontWeight: "600", color: "var(--color-text-primary)",
                  fontSize: "0.95rem", transition: "all 0.2s",
                }}
                onClick={() => { setStep(1); setErrors({}); }}>
                ← 이전
              </button>
              <button className="btn-primary" style={{ flex: 2, padding: "0.875rem" }}
                onClick={() => {
                  const e = validate2();
                  if (Object.keys(e).length > 0) { setErrors(e); return; }
                  setErrors({});
                  setStep(3);
                }}>
                다음 단계 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div>
            <h2 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.375rem", color: "var(--color-text-primary)" }}>
              예약 정보 확인
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              아래 정보를 확인하고 예약을 확정해주세요
            </p>

            <div style={{ background: "#F8F9FA", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", border: "1px solid var(--color-border)" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "1rem", color: "var(--color-primary)", fontSize: "1rem" }}>
                {event.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <Row label="예약자" value={`${formData.name} (${formData.partySize}명)`} />
                <Row label="연락처" value={formData.phone} />
                <Row label="이메일" value={formData.email} />
                {formData.address && <Row label="주소" value={formData.address} />}
                {selectedSlot && (
                  <>
                    <Row label="방문일" value={new Date(selectedSlot.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" })} />
                    <Row label="방문시간" value={`${selectedSlot.startTime} ~ ${selectedSlot.endTime}`} />
                  </>
                )}
                <Row label="장소" value={event.location} />
              </div>
            </div>

            <div style={{
              background: "#EEF2FF", borderRadius: "10px", padding: "1rem",
              marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>ℹ️</span>
              <p style={{ fontSize: "0.825rem", color: "#3B5BDB", lineHeight: "1.6" }}>
                예약 확정 후 이메일로 QR 입장권이 발송됩니다. 현장에서 QR 코드를 제시해 주세요.
              </p>
            </div>

            {errors.submit && (
              <div style={{
                background: "#FFE3E3", border: "1px solid var(--color-error)",
                borderRadius: "8px", padding: "0.875rem",
                color: "#C92A2A", marginBottom: "1rem", fontSize: "0.9rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span>⚠</span> {errors.submit}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                style={{
                  flex: 1, padding: "0.875rem", borderRadius: "var(--radius-btn)",
                  border: "1.5px solid var(--color-border)", background: "white",
                  cursor: "pointer", fontWeight: "600", color: "var(--color-text-primary)",
                  fontSize: "0.95rem", transition: "all 0.2s",
                }}
                onClick={() => { setStep(2); setErrors({}); }}>
                ← 이전
              </button>
              <button className="btn-primary" style={{ flex: 2, padding: "0.875rem" }}
                disabled={loading}
                onClick={handleSubmit}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    예약 처리 중...
                  </span>
                ) : "예약 확정"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: "var(--color-error)", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", padding: "0.375rem 0", borderBottom: "1px solid var(--color-border)" }}>
      <span style={{ color: "var(--color-text-secondary)", fontSize: "0.825rem", minWidth: "80px", fontWeight: "500" }}>{label}</span>
      <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "var(--color-text-primary)" }}>{value}</span>
    </div>
  );
}
