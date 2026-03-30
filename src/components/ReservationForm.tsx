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

const INTEREST_OPTIONS = [
  "가구", "방충망",
  "에어컨/냉난방", "입주청소",
  "이사", "인테리어",
  "전동커튼/블라인드", "조명",
  "보안/방범", "주방기기",
  "욕실/위생", "홈네트워크",
  "기타",
];

function groupByDate(slots: TimeSlot[]) {
  const map = new Map<string, TimeSlot[]>();
  for (const s of slots) {
    const dateKey = new Date(s.date).toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "short",
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
    name: "",
    phone: "",
    email: "",
    address: "",
    interests: [] as string[],
    timeSlotId: "",
    privacyConsent: false,
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedSlot = event.timeSlots.find((s) => s.id === formData.timeSlotId);
  const slotsByDate = groupByDate(event.timeSlots);

  function validate1() {
    const e: Record<string, string> = {};
    if (!formData.timeSlotId) e.timeSlotId = "방문 시간대를 선택해주세요";
    return e;
  }

  function validate2() {
    const e: Record<string, string> = {};
    if (!formData.name || formData.name.length < 2) e.name = "이름을 2자 이상 입력해주세요";
    if (!formData.phone || !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(formData.phone.replace(/-/g, "")))
      e.phone = "올바른 휴대폰 번호를 입력해주세요 (예: 01012345678)";
    if (!formData.address) e.address = "동호수를 입력해주세요";
    if (!formData.privacyConsent) e.privacyConsent = "개인정보 수집에 동의해주세요";
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
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          unitAddress: formData.address,
          interests: formData.interests.join(","),
          partySize: 1,
          timeSlotId: formData.timeSlotId,
          privacyConsent: formData.privacyConsent,
          marketingConsent: formData.marketingConsent,
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
    { num: 1, label: "날짜 선택" },
    { num: 2, label: "예약자 정보" },
    { num: 3, label: "예약 확인" },
  ];

  const toggleInterest = (item: string) => {
    const cur = formData.interests;
    if (cur.includes(item)) {
      setFormData({ ...formData, interests: cur.filter((i) => i !== item) });
    } else if (cur.length < 5) {
      setFormData({ ...formData, interests: [...cur, item] });
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", fontFamily: "var(--font-serif)" }}>
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "3rem" }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 700,
                background: step > s.num ? "var(--brand-dark)" : step === s.num ? "var(--brand-dark)" : "transparent",
                color: step >= s.num ? "var(--brand-lime)" : "var(--brand-dark)",
                border: "2px solid var(--brand-dark)",
              }}>
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="label-text" style={{
                color: step === s.num ? "var(--brand-dark)" : "rgba(15,31,61,0.45)",
                whiteSpace: "nowrap",
              }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "1px",
                background: step > s.num ? "var(--brand-dark)" : "rgba(15,31,61,0.2)",
                margin: "0 0.5rem", marginBottom: "1.5rem",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: 날짜/시간 선택 */}
      {step === 1 && (
        <div>
          <p className="label-text" style={{ color: "var(--brand-dark)", marginBottom: "0.5rem" }}>
            📍 {event.location}
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "2rem", color: "var(--brand-dark)" }}>
            방문 일시를 선택해주세요
          </h2>

          {event.timeSlots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px solid var(--brand-dark)" }}>
              <p className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>등록된 시간대가 없습니다</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {Array.from(slotsByDate.entries()).map(([date, slots]) => (
                <div key={date}>
                  <div style={{ borderBottom: "1px solid var(--brand-dark)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                    <span className="label-text" style={{ color: "var(--brand-dark)" }}>{date}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                    {slots.map((slot) => {
                      const available = slot.maxCapacity - slot.currentCount;
                      const isFull = available <= 0;
                      const isSelected = formData.timeSlotId === slot.id;
                      return (
                        <button key={slot.id}
                          disabled={isFull}
                          onClick={() => setFormData({ ...formData, timeSlotId: slot.id })}
                          style={{
                            padding: "1rem",
                            border: isSelected ? "2px solid var(--brand-dark)" : "1px solid var(--brand-dark)",
                            background: isSelected ? "var(--brand-dark)" : isFull ? "rgba(15,31,61,0.05)" : "white",
                            cursor: isFull ? "not-allowed" : "pointer",
                            opacity: isFull ? 0.4 : 1,
                            textAlign: "center",
                            fontFamily: "var(--font-serif)",
                          }}>
                          <p style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--brand-lime)" : "var(--brand-dark)" }}>
                            {slot.startTime}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: isSelected ? "var(--brand-accent)" : "rgba(15,31,61,0.5)" }}>~ {slot.endTime}</p>
                          <p style={{ fontSize: "0.7rem", marginTop: "0.375rem", color: isFull ? "var(--color-error)" : isSelected ? "var(--brand-accent)" : "var(--color-success)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
            <p style={{ color: "var(--color-error)", fontSize: "0.825rem", marginTop: "1rem" }}>
              ⚠ {errors.timeSlotId}
            </p>
          )}

          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: "2rem", padding: "1rem" }}
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

      {/* Step 2: 예약자 정보 */}
      {step === 2 && (
        <div>
          {selectedSlot && (
            <div style={{ borderLeft: "2px solid var(--brand-accent)", paddingLeft: "1rem", marginBottom: "2rem" }}>
              <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>선택된 방문 일시</span>
              <p style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--brand-dark)", marginTop: "0.25rem" }}>
                {new Date(selectedSlot.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" })} {selectedSlot.startTime}~{selectedSlot.endTime}
              </p>
            </div>
          )}

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "2rem", color: "var(--brand-dark)" }}>
            예약자 정보를 입력하세요
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">이름 <span className="required">*</span></label>
              <input
                type="text"
                className={`form-input${errors.name ? " error" : ""}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">휴대폰 번호 <span className="required">*</span></label>
              <input
                type="tel"
                className={`form-input${errors.phone ? " error" : ""}`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01012345678"
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">이메일</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">동호수 <span className="required">*</span></label>
              <input
                type="text"
                className={`form-input${errors.address ? " error" : ""}`}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="101동 501호"
              />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>

            {/* 관심 서비스 */}
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>관심 서비스</span>
                <span style={{ fontWeight: 400, opacity: 0.6 }}>{formData.interests.length}/5</span>
              </label>
              <div style={{
                border: "1px solid var(--brand-dark)", padding: "1rem",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem",
              }}>
                {INTEREST_OPTIONS.map((item) => {
                  const selected = formData.interests.includes(item);
                  const disabled = !selected && formData.interests.length >= 5;
                  return (
                    <label key={item} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.4 : 1,
                    }}>
                      <div
                        onClick={() => !disabled && toggleInterest(item)}
                        style={{
                          width: "16px", height: "16px", flexShrink: 0,
                          background: selected ? "var(--brand-dark)" : "white",
                          border: `1px solid var(--brand-dark)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}>
                        {selected && <span style={{ color: "var(--brand-lime)", fontSize: "10px", fontWeight: 700 }}>✓</span>}
                      </div>
                      <span
                        onClick={() => !disabled && toggleInterest(item)}
                        style={{ fontSize: "0.875rem", color: "var(--brand-dark)", userSelect: "none" }}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 개인정보 동의 */}
            <div style={{
              border: errors.privacyConsent ? "2px solid var(--color-error)" : "1px solid var(--brand-dark)",
              padding: "1.25rem",
            }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <div
                  style={{
                    width: "18px", height: "18px", flexShrink: 0, marginTop: "2px",
                    background: formData.privacyConsent ? "var(--brand-dark)" : "white",
                    border: `1px solid var(--brand-dark)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setFormData({ ...formData, privacyConsent: !formData.privacyConsent })}>
                  {formData.privacyConsent && <span style={{ color: "var(--brand-lime)", fontSize: "11px", fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <span style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--brand-dark)" }}>
                    개인정보 수집 및 이용에 동의합니다. <span style={{ color: "var(--color-error)" }}>*</span>{" "}
                    <button type="button" onClick={() => setPrivacyOpen(true)}
                      style={{ color: "var(--brand-dark)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "inherit", padding: 0, fontFamily: "var(--font-serif)" }}>
                      내용보기
                    </button>
                  </span>
                  <p style={{ fontSize: "0.75rem", color: "rgba(15,31,61,0.55)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                    수집 항목: 이름, 연락처, 이메일(선택), 동호수 / 목적: 방문 예약 확인 / 보유: 행사 종료 후 1개월
                  </p>
                </div>
              </label>
              {errors.privacyConsent && (
                <p className="form-error" style={{ marginTop: "0.5rem" }}>{errors.privacyConsent}</p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: "1rem" }}
              onClick={() => { setStep(1); setErrors({}); }}>
              ← 이전
            </button>
            <button
              className="btn-primary"
              style={{ flex: 2, padding: "1rem" }}
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

      {/* Step 3: 최종 확인 */}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.375rem", color: "var(--brand-dark)" }}>
            예약 정보 확인
          </h2>
          <p className="label-text" style={{ color: "rgba(15,31,61,0.5)", marginBottom: "2rem" }}>
            아래 정보를 확인하고 예약을 확정해주세요
          </p>

          <div style={{ border: "1px solid var(--brand-dark)", marginBottom: "1.5rem" }}>
            <div style={{ borderBottom: "1px solid var(--brand-dark)", padding: "1rem 1.25rem", background: "var(--brand-dark)" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--brand-lime)" }}>{event.title}</p>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              <InfoRow label="예약자" value={formData.name} />
              <InfoRow label="연락처" value={formData.phone} />
              {formData.email && <InfoRow label="이메일" value={formData.email} />}
              <InfoRow label="동호수" value={formData.address} />
              {formData.interests.length > 0 && (
                <InfoRow label="관심 서비스" value={formData.interests.join(", ")} />
              )}
              {selectedSlot && (
                <>
                  <InfoRow label="방문일" value={new Date(selectedSlot.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" })} />
                  <InfoRow label="방문시간" value={`${selectedSlot.startTime} ~ ${selectedSlot.endTime}`} />
                </>
              )}
              <InfoRow label="장소" value={event.location} />
            </div>
          </div>

          <div style={{ borderLeft: "2px solid var(--brand-accent)", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--brand-dark)", lineHeight: 1.6, opacity: 0.75 }}>
              예약 확정 후 QR 입장권이 발급됩니다. 현장에서 QR 코드를 제시해 주세요.
            </p>
          </div>

          {errors.submit && (
            <div style={{
              border: "1px solid var(--color-error)",
              padding: "1rem",
              color: "var(--color-error)", marginBottom: "1rem", fontSize: "0.875rem",
            }}>
              ⚠ {errors.submit}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: "1rem" }}
              onClick={() => { setStep(2); setErrors({}); }}>
              ← 이전
            </button>
            <button
              className="btn-primary"
              style={{ flex: 2, padding: "1rem" }}
              disabled={loading}
              onClick={handleSubmit}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span style={{ width: "14px", height: "14px", border: "2px solid rgba(232,238,244,0.3)", borderTopColor: "var(--brand-lime)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  예약 처리 중...
                </span>
              ) : "예약 완료하기"}
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.625rem 1.25rem", borderBottom: "1px solid rgba(15,31,61,0.1)" }}>
      <span className="label-text" style={{ color: "rgba(15,31,61,0.5)", minWidth: "80px" }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--brand-dark)" }}>{value}</span>
    </div>
  );
}
