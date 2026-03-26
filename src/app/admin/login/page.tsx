"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("네트워크 오류가 발생했습니다");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1A1F36 0%, #2d3561 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "#252b48",
        borderRadius: "20px",
        padding: "3rem 2.5rem",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        border: "1px solid #2d3561",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "60px", height: "60px",
            background: "linear-gradient(135deg, #3B5BDB, #6b8de8)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem",
            margin: "0 auto 1rem",
          }}>
            🔐
          </div>
          <h1 style={{ color: "white", fontWeight: "800", fontSize: "1.5rem", marginBottom: "0.25rem" }}>
            관리자 로그인
          </h1>
          <p style={{ color: "#adb5bd", fontSize: "0.9rem" }}>
            입주박람회 관리 시스템
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: "#adb5bd", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
              아이디
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
              style={{
                width: "100%", padding: "0.875rem 1rem",
                background: "#1e2342", border: "2px solid #2d3561",
                borderRadius: "10px", color: "white", fontSize: "1rem",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B5BDB")}
              onBlur={(e) => (e.target.style.borderColor = "#2d3561")}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "#adb5bd", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
              비밀번호
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "0.875rem 1rem",
                background: "#1e2342", border: "2px solid #2d3561",
                borderRadius: "10px", color: "white", fontSize: "1rem",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B5BDB")}
              onBlur={(e) => (e.target.style.borderColor = "#2d3561")}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.4)",
              borderRadius: "8px", padding: "0.75rem 1rem",
              color: "#FF6B6B", fontSize: "0.875rem",
              marginBottom: "1.25rem",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "1rem",
              background: loading ? "#4a5568" : "linear-gradient(135deg, #3B5BDB, #6b8de8)",
              border: "none", borderRadius: "10px",
              color: "white", fontSize: "1rem", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#868e96", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          기본 계정: admin / admin1234
        </p>
      </div>
    </div>
  );
}
