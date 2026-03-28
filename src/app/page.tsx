import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#E8EEF4" }}>
      <Header />

      <main style={{ flex: 1 }}>

        {/* ── Hero ── */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "85vh",
          borderBottom: "1px solid #0F1F3D",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
        }}>
          {/* Left: content */}
          <div style={{
            padding: "8rem 2rem 8rem 0",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem" }}>
              <span className="label-text" style={{ color: "#0F1F3D" }}>입주박람회 예약 서비스</span>
              <span className="label-text" style={{ color: "#5a7a9a" }}>Est. 2024</span>
            </div>

            <h1 className="display-title" style={{ color: "#0F1F3D", fontFamily: "'Playfair Display', serif" }}>
              It&apos;s Okay{" "}
              <span style={{ display: "inline-block", color: "#A8C4DC", margin: "0 0.5rem", fontFamily: "sans-serif" }}>✦</span>
              <br />
              To Expect More
            </h1>

            <p style={{
              marginTop: "2rem", maxWidth: "420px",
              fontSize: "1rem", color: "#0F1F3D", opacity: 0.75, lineHeight: 1.7,
            }}>
              원하는 아파트 박람회를 선택하고 편리하게 예약하세요.
              QR 입장권으로 현장에서 빠르게 입장할 수 있습니다.
            </p>

            <div style={{ marginTop: "2.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/events" className="btn-primary" style={{ padding: "0.9rem 2rem" }}>
                행사 예약하기
              </Link>
              <Link href="/kiosk" className="btn-secondary" style={{ padding: "0.9rem 2rem" }}>
                QR 체크인
              </Link>
            </div>
          </div>

          {/* Right: arch image */}
          <div style={{
            padding: "4rem 0 0 4rem",
            display: "flex", alignItems: "flex-end",
          }}>
            <div style={{
              width: "100%", height: "90%",
              borderRadius: "500px 500px 0 0",
              overflow: "hidden",
              background: "#0F1F3D",
            }}>
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80"
                alt="Beautiful minimal interior"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, filter: "grayscale(0.3) brightness(0.9)" }}
              />
            </div>
          </div>
        </section>

        {/* ── Upcoming Events preview ── */}
        <section style={{ padding: "8rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem" }}>
            <span className="label-text" style={{ color: "#0F1F3D" }}>Directory</span>
            <span className="label-text" style={{ color: "#5a7a9a" }}>행사 선택하기</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.5rem", fontWeight: 400,
            color: "#0F1F3D", marginBottom: "4rem",
          }}>
            Upcoming Fairs
          </h2>

          {/* 3-col cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4rem" }}>
            {[
              {
                img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
                title: "행사 목록 보기",
                sub: "예약 가능한 모든 행사",
                href: "/events",
                btn: "전체 행사 →",
              },
              {
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
                title: "빠른 예약",
                sub: "2분 안에 예약 완료",
                href: "/events",
                btn: "지금 예약하기 →",
              },
              {
                img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
                title: "QR 체크인",
                sub: "현장 입장 키오스크",
                href: "/kiosk",
                btn: "키오스크 →",
              },
            ].map((card) => (
              <article key={card.title} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{
                  width: "100%", aspectRatio: "3/4",
                  borderRadius: "500px 500px 0 0",
                  overflow: "hidden",
                  background: "#0F1F3D",
                }}>
                  <img
                    src={card.img} alt={card.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, filter: "grayscale(0.3)" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 400, color: "#0F1F3D" }}>
                      {card.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#5a7a9a", marginBottom: "1rem" }}>{card.sub}</p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={card.href} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                      {card.btn}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── The Standard (info section) ── */}
        <section style={{ backgroundColor: "#0F1F3D", padding: "8rem 2rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem", fontWeight: 400,
              color: "#A8C4DC", marginBottom: "4rem",
            }}>
              The Aura Standard
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
              {[
                { num: "01", title: "간편한 예약", desc: "3단계 예약 프로세스로 2분 안에 예약 완료. 별도 회원가입 없이 바로 예약하세요." },
                { num: "02", title: "QR 입장권", desc: "예약 완료 시 즉시 QR 코드 입장권 발급. PDF 저장 및 프린트 가능합니다." },
                { num: "03", title: "키오스크 체크인", desc: "QR 코드 스캔 한 번으로 빠른 체크인. 대기줄 없이 신속하게 입장하세요." },
                { num: "04", title: "개인정보 보호", desc: "암호화로 개인정보를 안전하게 보호합니다. 개인정보보호법 완전 준수." },
              ].map((item) => (
                <div key={item.num} style={{ borderTop: "1px solid rgba(168,196,220,0.3)", paddingTop: "2rem" }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3rem", color: "#A8C4DC",
                    display: "block", marginBottom: "1rem",
                  }}>
                    {item.num}
                  </span>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem", fontWeight: 400,
                    color: "#E8EEF4", marginBottom: "0.5rem",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#E8EEF4", opacity: 0.75, lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Kiosk section ── */}
        <section style={{ padding: "8rem 2rem", borderTop: "1px solid #0F1F3D", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 400, color: "#0F1F3D", marginBottom: "0.75rem" }}>
              On-Site Kiosk Experience
            </h2>
            <p className="label-text" style={{ color: "#5a7a9a" }}>동호수로 빠른 입장</p>
          </div>

          <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "#0F1F3D", padding: "2rem" }}>
            <div style={{
              backgroundColor: "#E8EEF4", color: "#0F1F3D",
              padding: "2rem", textAlign: "center",
              minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center",
              marginBottom: "2rem", borderRadius: "4px",
            }}>
              <p className="label-text" style={{ marginBottom: "0.5rem", color: "#0F1F3D" }}>Enter Unit Number</p>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "3rem", letterSpacing: "0.1em",
                borderBottom: "2px solid #0F1F3D",
                width: "80%", margin: "0 auto",
                minHeight: "4rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                402<span style={{ animation: "blink 1s step-end infinite" }}>|</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(168,196,220,0.2)", border: "1px solid rgba(168,196,220,0.2)" }}>
              {["1","2","3","4","5","6","7","8","9","CLR","0","↵"].map((k) => (
                <div key={k} style={{
                  backgroundColor: "#0F1F3D",
                  color: k === "↵" ? "#0F1F3D" : "#A8C4DC",
                  backgroundColor2: k === "↵" ? "#A8C4DC" : "#0F1F3D",
                  background: k === "↵" ? "#A8C4DC" : "#0F1F3D",
                  padding: "1.5rem 0",
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: k === "CLR" || k === "↵" ? "0.65rem" : "1.5rem",
                  letterSpacing: k === "CLR" || k === "↵" ? "0.1em" : "0",
                  cursor: "pointer",
                }}>
                  {k}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link href="/kiosk" className="btn-primary" style={{ width: "100%", justifyContent: "center", backgroundColor: "#A8C4DC", color: "#0F1F3D", borderColor: "#A8C4DC" }}>
                키오스크 바로가기
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}
