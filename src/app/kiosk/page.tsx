"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NUMPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["동", "0", "호"],
];

export default function KioskPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [hasDong, setHasDong] = useState(false);
  const [hasHo, setHasHo] = useState(false);

  useEffect(() => {
    setHasDong(input.includes("동"));
    setHasHo(input.includes("호"));
  }, [input]);

  const handleKey = (k: string) => {
    setError("");
    if (k === "←") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    if (k === "↵") {
      handleSubmit();
      return;
    }
    if (k === "동") {
      if (hasDong) return;
      setInput((prev) => prev + "동 ");
      return;
    }
    if (k === "호") {
      if (!hasDong || hasHo) return;
      setInput((prev) => prev + "호");
      return;
    }
    if (input.length >= 20) return;
    setInput((prev) => prev + k);
  };

  const handleSubmit = async () => {
    const clean = input.trim();
    if (!clean) { setError("동호수를 입력해주세요"); return; }
    if (!hasDong || !hasHo) { setError("'동'과 '호'를 모두 입력해주세요 (예: 101동 1001호)"); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/kiosk/lookup?unit=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "예약을 찾을 수 없습니다"); }
      else { router.push(`/kiosk/${data.ticketNumber}`); }
    } catch {
      setError("네트워크 오류가 발생했습니다");
    }
    setLoading(false);
  };

  const displayText = input || "";
  const placeholder = !input ? "동호수를 입력하세요" : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--brand-lime)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      fontFamily: "var(--font-serif)",
    }}>
      {/* Brand */}
      <div style={{
        position: "absolute", top: "2.5rem", left: "50%", transform: "translateX(-50%)",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--brand-dark)", opacity: 0.5, fontWeight: 600,
        }}>
          Aura Move-in Fairs
        </p>
      </div>

      {/* Main content */}
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 600,
          color: "var(--brand-dark)",
          lineHeight: 1.1,
          marginBottom: "0.5rem",
          textAlign: "center",
        }}>
          체크인
        </h1>
        <p style={{
          fontSize: "0.8rem", color: "var(--brand-dark)", opacity: 0.5,
          letterSpacing: "0.06em", textAlign: "center", marginBottom: "2.5rem",
        }}>
          입주 동호수를 입력해주세요
        </p>

        {/* Display */}
        <div style={{
          border: "2px solid var(--brand-dark)",
          background: "white",
          padding: "1.5rem 2rem",
          marginBottom: "0.75rem",
          minHeight: "5rem",
          display: "flex", alignItems: "center",
        }}>
          <span style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 600,
            color: displayText ? "var(--brand-dark)" : "transparent",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}>
            {displayText || (
              <span style={{ color: "var(--brand-dark)", opacity: 0.25, fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                {placeholder}
              </span>
            )}
          </span>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            fontSize: "0.8rem", color: "#c0392b",
            letterSpacing: "0.03em", marginBottom: "0.75rem",
            padding: "0.5rem 0",
          }}>
            {error}
          </p>
        )}

        {/* Numpad grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", background: "var(--brand-dark)",
          border: "2px solid var(--brand-dark)",
          marginBottom: "1px",
        }}>
          {NUMPAD.map((row, ri) =>
            row.map((k) => {
              const isDong = k === "동";
              const isHo = k === "호";
              const isActive = (isDong && hasDong) || (isHo && hasHo);
              const isDisabled = (isDong && hasDong) || (isHo && (!hasDong || hasHo));

              return (
                <button
                  key={`${ri}-${k}`}
                  onClick={() => handleKey(k)}
                  disabled={isDisabled}
                  style={{
                    padding: "clamp(1rem, 3vw, 1.75rem)",
                    fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                    fontWeight: 600,
                    fontFamily: "var(--font-serif)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    border: "none",
                    background: isActive
                      ? "var(--brand-accent)"
                      : isDong || isHo
                        ? "var(--brand-lime)"
                        : "white",
                    color: "var(--brand-dark)",
                    transition: "all 0.15s",
                    opacity: isDisabled ? 0.3 : 1,
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) => { if (!isDisabled) (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = isDisabled ? "0.3" : "1"; }}
                  onMouseDown={(e) => { if (!isDisabled) (e.currentTarget as HTMLElement).style.transform = "scale(0.95)"; }}
                  onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  {k}
                </button>
              );
            })
          )}
        </div>

        {/* Bottom row: backspace + enter */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr",
          gap: "1px", background: "var(--brand-dark)",
          border: "2px solid var(--brand-dark)",
          borderTop: "none",
        }}>
          <button
            onClick={() => handleKey("←")}
            style={{
              padding: "clamp(0.9rem, 2.5vw, 1.5rem)",
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              fontWeight: 600, cursor: "pointer", border: "none",
              background: "#f0f2f5", color: "var(--brand-dark)",
              fontFamily: "var(--font-serif)",
            }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.95)"; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            ←
          </button>
          <button
            onClick={() => handleKey("↵")}
            disabled={loading}
            style={{
              padding: "clamp(0.9rem, 2.5vw, 1.5rem)",
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
              fontWeight: 600, cursor: loading ? "wait" : "pointer", border: "none",
              background: "var(--brand-dark)", color: "var(--brand-lime)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-serif)",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseDown={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.opacity = loading ? "0.7" : "1"; }}
          >
            {loading ? "조회 중..." : "조회"}
          </button>
        </div>
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: "2rem", right: "2rem" }}>
        <button
          onClick={() => setShowFab((p) => !p)}
          style={{
            width: "56px", height: "56px",
            borderRadius: "50%",
            background: "var(--brand-dark)",
            color: "var(--brand-lime)",
            border: "none", cursor: "pointer",
            fontSize: "1.25rem",
            boxShadow: "0 4px 20px rgba(15,31,61,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ⚙
        </button>

        {showFab && (
          <div style={{
            position: "absolute", bottom: "68px", right: 0,
            background: "white", border: "1px solid var(--brand-dark)",
            minWidth: "160px", boxShadow: "0 4px 20px rgba(15,31,61,0.15)",
          }}>
            {[
              { label: "새로고침", icon: "↺", action: () => { window.location.reload(); } },
              { label: "관리자", icon: "⊞", action: () => { router.push("/admin"); } },
              { label: "종료", icon: "⏻", action: () => { window.close(); } },
            ].map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  width: "100%", padding: "0.875rem 1.25rem",
                  background: "transparent", border: "none",
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  cursor: "pointer", fontSize: "0.85rem",
                  color: "var(--brand-dark)", fontFamily: "var(--font-serif)",
                  borderBottom: "1px solid var(--brand-lime)",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-lime)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center" }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
