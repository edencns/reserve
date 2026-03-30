"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QRScanner() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      setError("예약번호를 입력해주세요");
      return;
    }
    router.push(`/kiosk/${ticketNumber.trim().toUpperCase()}`);
  };

  const handleKeypad = (key: string) => {
    if (key === "←") {
      setTicketNumber((prev) => prev.slice(0, -1));
      setError("");
    } else if (key === "↵") {
      if (!ticketNumber.trim()) {
        setError("예약번호를 입력해주세요");
        return;
      }
      router.push(`/kiosk/${ticketNumber.trim().toUpperCase()}`);
    } else {
      setTicketNumber((prev) => (prev + key).toUpperCase());
      setError("");
    }
  };

  const keys = [
    ["1","2","3"],
    ["4","5","6"],
    ["7","8","9"],
    ["←","0","↵"],
  ];

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      {/* Input display */}
      <div style={{
        border: "1px solid var(--brand-dark)",
        background: "white",
        padding: "1.25rem 1.5rem",
        marginBottom: "1rem",
        position: "relative",
      }}>
        <label style={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: "600",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--brand-dark)",
          marginBottom: "0.5rem",
          opacity: 0.6,
        }}>
          예약번호 입력
        </label>
        <input
          type="text"
          value={ticketNumber}
          onChange={(e) => {
            setTicketNumber(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="TK20240101XXXX"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "1.4rem",
            fontWeight: "600",
            letterSpacing: "0.08em",
            background: "transparent",
            color: "var(--brand-dark)",
            fontFamily: "var(--font-sans)",
          }}
        />
        {error && (
          <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "0.5rem", letterSpacing: "0.04em" }}>{error}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={() => handleKeypad("↵")}
        className="btn-primary"
        style={{ width: "100%", fontSize: "0.9rem", padding: "1rem", marginBottom: "1.5rem" }}
      >
        입장권 조회
      </button>

      {/* Numpad */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        border: "1px solid var(--brand-dark)",
        background: "var(--brand-dark)",
      }}>
        {keys.flat().map((k) => (
          <button
            key={k}
            onClick={() => handleKeypad(k)}
            style={{
              padding: "1.25rem",
              fontSize: k === "↵" ? "1rem" : "1.3rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: k === "↵" ? "var(--brand-dark)" : k === "←" ? "#f0f2f5" : "var(--brand-lime)",
              color: k === "↵" ? "var(--brand-lime)" : "var(--brand-dark)",
              transition: "opacity 0.1s",
              fontFamily: "var(--font-sans)",
              letterSpacing: k === "↵" ? "0.05em" : "0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {k === "↵" ? "조회" : k}
          </button>
        ))}
      </div>

      {/* Hint */}
      <p style={{
        marginTop: "1.5rem",
        fontSize: "0.8rem",
        color: "var(--brand-dark)",
        opacity: 0.5,
        letterSpacing: "0.04em",
        lineHeight: 1.6,
        textAlign: "center",
      }}>
        예약 완료 시 발급된 예약번호를 입력하거나<br />
        QR 코드를 키오스크 리더기에 스캔해주세요.
      </p>
    </div>
  );
}
