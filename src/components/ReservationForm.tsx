"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
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
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  timeSlots: TimeSlot[];
}

interface ReservationFormProps {
  event: Event;
}

type Step = 1 | 2 | 3 | 4;

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function ReservationForm({ event }: ReservationFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

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

  function validate2() {
    const e: Record<string, string> = {};
    if (!formData.timeSlotId) e.timeSlotId = "방문 시간대를 선택해주세요";
    return e;
  }

  function validate3() {
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

      setTicketNumber(data.ticketNumber);
      setStep(4);
    } catch {
      setErrors({ submit: "네트워크 오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { num: 1, label: "행사 정보" },
    { num: 2, label: "날짜 선택" },
    { num: 3, label: "예약자 정보" },
    { num: 4, label: "예약 완료" },
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
                width: "2rem", height: "2rem", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 700,
                background: step > s.num ? "var(--brand-dark)" : step === s.num ? "var(--brand-dark)" : "transparent",
                color: step >= s.num ? "var(--brand-lime)" : "var(--brand-dark)",
                border: "2px solid var(--brand-dark)",
              }}>
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="label-text" style={{
                color: step === s.num ? "var(--brand-dark)" : "rgba(15,31,61,0.35)",
                whiteSpace: "nowrap", fontSize: "0.6rem",
              }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "1px",
                background: step > s.num ? "var(--brand-dark)" : "rgba(15,31,61,0.15)",
                margin: "0 0.375rem", marginBottom: "1.5rem",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: 행사 정보 ── */}
      {step === 1 && (
        <div>
          {/* Hero image */}
          {event.imageUrl && (
            <div style={{
              width: "100%", aspectRatio: "16/7",
              borderRadius: "500px 500px 0 0",
              overflow: "hidden",
              background: "var(--brand-dark)",
              marginBottom: "2rem",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.imageUrl} alt={event.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, filter: "grayscale(0.2)" }} />
            </div>
          )}

          <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>행사 안내</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 600, color: "var(--brand-dark)", margin: "0.5rem 0 1.5rem" }}>
            {event.title}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0", borderTop: "1px solid var(--brand-dark)" }}>
            {[
              { label: "장소", value: event.location },
              { label: "기간", value: `${formatDate(event.startDate)} – ${formatDate(event.endDate)}` },
              { label: "예약 가능 슬롯", value: `${event.timeSlots.length}개` },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex", gap: "2rem", padding: "0.875rem 0",
                borderBottom: "1px solid rgba(15,31,61,0.1)",
              }}>
                <span className="label-text" style={{ color: "rgba(15,31,61,0.45)", minWidth: "80px" }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: "var(--brand-dark)", fontSize: "0.9rem" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {event.description && (
            <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(15,31,61,0.7)", lineHeight: 1.8 }}>
              {event.description}
            </p>
          )}

          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: "2.5rem", padding: "1rem" }}
            onClick={() => setStep(2)}>
            예약 시작하기 →
          </button>
        </div>
      )}

      {/* ── Step 2: 날짜/시간 선택 ── */}
      {step === 2 && (
        <div>
          <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>Step 2 / 4</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, margin: "0.5rem 0 2rem", color: "var(--brand-dark)" }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
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
                            background: isSelected ? "var(--brand-dark)" : isFull ? "rgba(15,31,61,0.04)" : "white",
                            cursor: isFull ? "not-allowed" : "pointer",
                            opacity: isFull ? 0.4 : 1,
                            textAlign: "center",
                            fontFamily: "var(--font-serif)",
                          }}>
                          <p style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--brand-lime)" : "var(--brand-dark)" }}>
                            {slot.startTime}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: isSelected ? "var(--brand-accent)" : "rgba(15,31,61,0.5)" }}>
                            ~ {slot.endTime}
                          </p>
                          <p style={{
                            fontSize: "0.68rem", marginTop: "0.375rem", fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.04em",
                            color: isFull ? "var(--color-error)" : isSelected ? "var(--brand-accent)" : "var(--color-success)",
                          }}>
                            {isFull ? "마감" : `잔여 ${available}`}
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
            <p style={{ color: "var(--color-error)", fontSize: "0.825rem", marginTop: "1rem" }}>⚠ {errors.timeSlotId}</p>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button className="btn-secondary" style={{ flex: 1, padding: "1rem" }} onClick={() => setStep(1)}>← 이전</button>
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

      {/* ── Step 3: 예약자 정보 ── */}
      {step === 3 && (
        <div>
          {selectedSlot && (
            <div style={{ borderLeft: "2px solid var(--brand-accent)", paddingLeft: "1rem", marginBottom: "2rem" }}>
              <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>선택된 방문 일시</span>
              <p style={{ fontWeight: 600, color: "var(--brand-dark)", marginTop: "0.25rem" }}>
                {new Date(selectedSlot.date).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })} {selectedSlot.startTime}~{selectedSlot.endTime}
              </p>
            </div>
          )}

          <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>Step 3 / 4</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, margin: "0.5rem 0 2rem", color: "var(--brand-dark)" }}>
            예약자 정보를 입력하세요
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">이름 <span className="required">*</span></label>
              <input type="text" className={`form-input${errors.name ? " error" : ""}`}
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동" />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">휴대폰 번호 <span className="required">*</span></label>
              <input type="tel" className={`form-input${errors.phone ? " error" : ""}`}
                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01012345678" />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">이메일</label>
              <input type="email" className="form-input"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com" />
            </div>

            <div className="form-group">
              <label className="form-label">동호수 <span className="required">*</span></label>
              <input type="text" className={`form-input${errors.address ? " error" : ""}`}
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="101동 501호" />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>관심 서비스</span>
                <span style={{ fontWeight: 400, opacity: 0.5 }}>{formData.interests.length}/5</span>
              </label>
              <div style={{ border: "1px solid var(--brand-dark)", padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {INTEREST_OPTIONS.map((item) => {
                  const selected = formData.interests.includes(item);
                  const disabled = !selected && formData.interests.length >= 5;
                  return (
                    <label key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1 }}>
                      <div onClick={() => !disabled && toggleInterest(item)} style={{
                        width: "16px", height: "16px", flexShrink: 0,
                        background: selected ? "var(--brand-dark)" : "white",
                        border: "1px solid var(--brand-dark)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}>
                        {selected && <span style={{ color: "var(--brand-lime)", fontSize: "10px", fontWeight: 700 }}>✓</span>}
                      </div>
                      <span onClick={() => !disabled && toggleInterest(item)} style={{ fontSize: "0.875rem", color: "var(--brand-dark)", userSelect: "none" }}>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ border: errors.privacyConsent ? "2px solid var(--color-error)" : "1px solid var(--brand-dark)", padding: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <div
                  style={{ width: "18px", height: "18px", flexShrink: 0, marginTop: "2px", background: formData.privacyConsent ? "var(--brand-dark)" : "white", border: "1px solid var(--brand-dark)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
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
              {errors.privacyConsent && <p className="form-error" style={{ marginTop: "0.5rem" }}>{errors.privacyConsent}</p>}
            </div>
          </div>

          {errors.submit && (
            <div style={{ border: "1px solid var(--color-error)", padding: "1rem", color: "var(--color-error)", marginTop: "1.5rem", fontSize: "0.875rem" }}>
              ⚠ {errors.submit}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button className="btn-secondary" style={{ flex: 1, padding: "1rem" }} onClick={() => { setStep(2); setErrors({}); }}>← 이전</button>
            <button
              className="btn-primary"
              style={{ flex: 2, padding: "1rem" }}
              disabled={loading}
              onClick={async () => {
                const e = validate3();
                if (Object.keys(e).length > 0) { setErrors(e); return; }
                setErrors({});
                await handleSubmit();
              }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span style={{ width: "14px", height: "14px", border: "2px solid rgba(232,238,244,0.3)", borderTopColor: "var(--brand-lime)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  처리 중...
                </span>
              ) : "예약 완료하기"}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: QR 티켓 ── */}
      {step === 4 && ticketNumber && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="label-text" style={{ color: "rgba(15,31,61,0.5)" }}>예약 완료</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 600, margin: "0.5rem 0 0.375rem", color: "var(--brand-dark)" }}>
              입장권이 발급되었습니다
            </h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(15,31,61,0.6)" }}>현장 키오스크 또는 QR 스캔으로 체크인하세요</p>
          </div>

          {/* Ticket */}
          <div style={{ border: "1px solid var(--brand-dark)" }}>
            {/* Header */}
            <div style={{ background: "var(--brand-dark)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p className="label-text" style={{ color: "rgba(232,238,244,0.5)", marginBottom: "0.5rem" }}>입장권</p>
                <p style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "1.1rem", color: "var(--brand-lime)" }}>{event.title}</p>
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "0.8rem", color: "var(--brand-accent)", letterSpacing: "0.05em" }}>
                {ticketNumber}
              </p>
            </div>

            {/* QR Code */}
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem", background: "white", borderBottom: "1px dashed rgba(15,31,61,0.2)" }}>
              <QRCodeSVG value={ticketNumber} size={180} fgColor="#0F1F3D" bgColor="#ffffff" />
            </div>

            {/* Details */}
            <div style={{ padding: "0 0 0.5rem" }}>
              {[
                { label: "예약자", value: formData.name },
                { label: "연락처", value: formData.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3") },
                { label: "동호수", value: formData.address },
                selectedSlot ? { label: "방문일시", value: `${new Date(selectedSlot.date).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })} ${selectedSlot.startTime}` } : null,
                { label: "장소", value: event.location },
              ].filter(Boolean).map((row) => row && (
                <div key={row.label} style={{ display: "flex", gap: "1.5rem", padding: "0.625rem 1.5rem", borderBottom: "1px solid rgba(15,31,61,0.08)" }}>
                  <span className="label-text" style={{ color: "rgba(15,31,61,0.4)", minWidth: "60px" }}>{row.label}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--brand-dark)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }} className="no-print">
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: "0.875rem" }}
              onClick={() => window.print()}>
              프린트
            </button>
            <a href="/events" className="btn-primary" style={{ flex: 1, padding: "0.875rem", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              다른 행사 보기
            </a>
          </div>

          <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "rgba(15,31,61,0.5)", textAlign: "center", lineHeight: 1.6 }}>
            입장권 분실 시 <a href="/my-tickets" style={{ color: "var(--brand-dark)", fontWeight: 600, textDecoration: "underline" }}>내 예약 조회</a>에서 다시 확인하세요
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
