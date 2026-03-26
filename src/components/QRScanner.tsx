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

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "2rem",
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        textAlign: "center",
      }}>
        {/* QR Icon */}
        <div style={{
          width: "80px", height: "80px",
          background: "linear-gradient(135deg, #3B5BDB, #6b8de8)",
          borderRadius: "20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.5rem",
          margin: "0 auto 1.5rem",
        }}>
          📷
        </div>

        <h2 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          QR 체크인
        </h2>
        <p style={{ color: "#868e96", marginBottom: "2rem", fontSize: "0.95rem" }}>
          QR 코드를 스캔하거나 예약번호를 직접 입력해주세요
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => {
                setTicketNumber(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="TK20240101XXXX"
              className="form-input"
              style={{ textAlign: "center", fontSize: "1.1rem", letterSpacing: "0.05em" }}
            />
            {error && (
              <p style={{ color: "#FF6B6B", fontSize: "0.875rem", marginTop: "0.5rem" }}>{error}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", fontSize: "1rem" }}>
            입장권 조회
          </button>
        </form>

        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "0.875rem",
          color: "#868e96",
        }}>
          💡 예약 완료 시 발급된 QR 코드를 키오스크에 스캔하거나,<br />
          예약 확인 페이지에서 예약번호를 확인하세요.
        </div>
      </div>
    </div>
  );
}
