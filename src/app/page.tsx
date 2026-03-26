import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero-gradient" style={{
          padding: "7rem 1.5rem 6rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background decorative elements */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(59,91,219,0.08)", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(59,91,219,0.06)", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", borderRadius: "50%", background: "rgba(107,141,232,0.05)", filter: "blur(50px)" }} />
            {/* Star dots */}
            {[
              { top: "15%", left: "12%", size: "4px" },
              { top: "25%", left: "85%", size: "3px" },
              { top: "65%", left: "8%", size: "3px" },
              { top: "72%", left: "90%", size: "4px" },
              { top: "45%", left: "3%", size: "2px" },
              { top: "30%", left: "95%", size: "2px" },
              { top: "80%", left: "20%", size: "3px" },
              { top: "20%", left: "70%", size: "2px" },
            ].map((dot, i) => (
              <div key={i} style={{
                position: "absolute", top: dot.top, left: dot.left,
                width: dot.size, height: dot.size,
                borderRadius: "50%", background: "rgba(255,255,255,0.4)",
              }} />
            ))}
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              backgroundColor: "rgba(59,91,219,0.25)",
              border: "1px solid rgba(59,91,219,0.4)",
              padding: "0.4rem 1.1rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              marginBottom: "1.75rem",
              color: "#93c5fd",
              fontWeight: "600",
            }}>
              <span>🏢</span> 아파트 입주박람회 예약 서비스
            </div>

            <h1 style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: "800",
              lineHeight: "1.15",
              marginBottom: "1.5rem",
              color: "white",
              letterSpacing: "-0.02em",
            }}>
              스마트한 입주 박람회<br />
              <span style={{ color: "#93C5FD" }}>방문 예약</span> 서비스
            </h1>

            <p style={{
              fontSize: "1.15rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.75",
              marginBottom: "3rem",
              maxWidth: "600px",
              margin: "0 auto 3rem",
            }}>
              원하는 아파트 박람회를 선택하고, 편리하게 예약하세요.<br />
              QR 입장권으로 현장에서 빠르게 입장할 수 있습니다.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/events" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.25rem", borderRadius: "10px" }}>
                행사 예약하기 →
              </Link>
              <Link href="/kiosk" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.9rem 2.25rem", borderRadius: "10px" }}>
                QR 체크인
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "3.5rem", flexWrap: "wrap" }}>
              {[
                { icon: "🔒", text: "개인정보 보호" },
                { icon: "⚡", text: "2분 내 예약 완료" },
                { icon: "🎫", text: "즉시 QR 발급" },
              ].map((badge) => (
                <div key={badge.text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: "6rem 1.5rem", backgroundColor: "#F8F9FA" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p style={{ color: "var(--color-primary)", fontWeight: "700", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                서비스 특징
              </p>
              <h2 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", marginBottom: "0.75rem", color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                복잡한 절차 없이 간편하게
              </h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto" }}>
                예약부터 입장까지 모든 과정을 스마트하게 처리하세요
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {[
                {
                  icon: "📱",
                  title: "간편한 예약",
                  desc: "3단계 예약 프로세스로 2분 안에 예약 완료. 별도 회원가입 없이 바로 예약하세요.",
                  color: "#EEF2FF",
                  iconColor: "#3B5BDB",
                },
                {
                  icon: "🎫",
                  title: "QR 입장권",
                  desc: "예약 완료 시 즉시 QR 코드 입장권 발급. PDF 저장 및 프린트 가능합니다.",
                  color: "#F0FFF4",
                  iconColor: "#2F9E44",
                },
                {
                  icon: "⚡",
                  title: "키오스크 체크인",
                  desc: "QR 코드 스캔 한 번으로 빠른 체크인. 대기줄 없이 신속하게 입장하세요.",
                  color: "#FFF9DB",
                  iconColor: "#E67700",
                },
                {
                  icon: "🔒",
                  title: "개인정보 보호",
                  desc: "암호화로 개인정보를 안전하게 보호합니다. 개인정보보호법 완전 준수.",
                  color: "#FFF0F6",
                  iconColor: "#C2255C",
                },
              ].map((f) => (
                <div key={f.title} className="card" style={{
                  padding: "2rem",
                  border: "1px solid #E9ECEF",
                }}>
                  <div style={{
                    width: "56px", height: "56px",
                    background: f.color, borderRadius: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.75rem", marginBottom: "1.25rem",
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "0.625rem", color: "var(--color-text-primary)" }}>{f.title}</h3>
                  <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.7", fontSize: "0.9rem" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "6rem 1.5rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p style={{ color: "var(--color-primary)", fontWeight: "700", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                이용 방법
              </p>
              <h2 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                4단계로 완성하는 예약
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", textAlign: "center" }}>
              {[
                { step: "01", icon: "🔍", title: "행사 선택", desc: "관심 있는 입주박람회를 선택합니다" },
                { step: "02", icon: "📝", title: "정보 입력", desc: "방문자 정보와 방문 시간을 선택합니다" },
                { step: "03", icon: "✅", title: "예약 확정", desc: "예약이 완료되면 QR 입장권이 발급됩니다" },
                { step: "04", icon: "🚪", title: "현장 입장", desc: "QR 코드로 빠르게 체크인하고 입장합니다" },
              ].map((s, i) => (
                <div key={s.step} style={{ position: "relative" }}>
                  {i < 3 && (
                    <div style={{
                      position: "absolute", top: "30px", left: "calc(50% + 32px)", right: "-50%",
                      height: "2px", background: "linear-gradient(to right, #DBE4FF, transparent)",
                    }} className="hide-mobile" />
                  )}
                  <div style={{
                    width: "64px", height: "64px",
                    background: "linear-gradient(135deg, #3B5BDB, #6B8DE8)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.75rem",
                    margin: "0 auto 1.25rem",
                    boxShadow: "0 4px 20px rgba(59,91,219,0.3)",
                    position: "relative",
                  }}>
                    {s.icon}
                    <div style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "#1A1F36", border: "2px solid white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.6rem", fontWeight: "800", color: "white",
                    }}>
                      {s.step}
                    </div>
                  </div>
                  <h3 style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "0.5rem", color: "var(--color-text-primary)" }}>{s.title}</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: "6rem 1.5rem",
          background: "linear-gradient(135deg, #1A1F36 0%, #2D3561 50%, #1A1F36 100%)",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "rgba(59,91,219,0.1)", filter: "blur(80px)" }} />
          </div>
          <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "20px",
              background: "linear-gradient(135deg, #3B5BDB, #6B8DE8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", margin: "0 auto 1.75rem",
              boxShadow: "0 8px 32px rgba(59,91,219,0.4)",
            }}>
              🏢
            </div>
            <h2 style={{ fontWeight: "800", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
              지금 바로 예약하세요
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "2.5rem", fontSize: "1.05rem", lineHeight: "1.75" }}>
              원하는 날짜와 시간을 선택하여<br />편리하게 방문 예약을 완료하세요.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/events" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.25rem", borderRadius: "10px" }}>
                행사 목록 보기
              </Link>
              <Link href="/kiosk" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0.9rem 2.25rem", borderRadius: "10px",
                border: "2px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)",
                textDecoration: "none", fontWeight: "600", fontSize: "1rem",
                transition: "all 0.2s",
              }}>
                QR 체크인
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
