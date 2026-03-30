"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1755624222023-621f7718950b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1758977404510-6ab7e07ff1fe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1652882861012-95f3263cab63?auto=format&fit=crop&q=80&w=800",
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % HERO_IMAGES.length);
        setFading(false);
      }, 1500);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: "100%", height: "90%",
      borderRadius: "500px 500px 0 0",
      overflow: "hidden",
      background: "#0F1F3D",
      position: "relative",
    }}>
      {HERO_IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            filter: "grayscale(0.35) brightness(0.9)",
            opacity: i === current ? (fading ? 0 : 0.9) : 0,
            transition: i === current ? "opacity 1.5s ease-in-out" : "opacity 1.5s ease-in-out",
          }}
        />
      ))}
      {/* Dots */}
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "0.5rem",
      }}>
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(false); setCurrent(i); }}
            style={{
              width: i === current ? "1.5rem" : "0.4rem",
              height: "0.4rem",
              borderRadius: "999px",
              background: i === current ? "var(--brand-lime)" : "rgba(232,238,244,0.4)",
              border: "none", cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--brand-lime)" }}>
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
          <div style={{ padding: "8rem 2rem 8rem 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem" }}>
              <span className="label-text" style={{ color: "#0F1F3D" }}>입주박람회 예약 서비스</span>
              <span className="label-text" style={{ color: "#5a7a9a" }}>Est. 2024</span>
            </div>

            <h1 className="display-title" style={{ color: "#0F1F3D" }}>
              It&apos;s Okay{" "}
              <span style={{ display: "inline-block", color: "#A8C4DC", margin: "0 0.5rem" }}>✦</span>
              <br />
              To Expect More
            </h1>

            <p style={{ marginTop: "2rem", maxWidth: "420px", fontSize: "1rem", color: "#0F1F3D", opacity: 0.75, lineHeight: 1.7 }}>
              원하는 아파트 박람회를 선택하고 편리하게 예약하세요.
              QR 입장권으로 현장에서 빠르게 입장할 수 있습니다.
            </p>

            <div style={{ marginTop: "2.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/events" className="btn-primary" style={{ padding: "0.9rem 2rem" }}>
                행사 예약하기
              </Link>
              <Link href="/my-tickets" className="btn-secondary" style={{ padding: "0.9rem 2rem" }}>
                내 예약 조회
              </Link>
            </div>
          </div>

          {/* Right: slideshow */}
          <div style={{ padding: "4rem 0 0 4rem", display: "flex", alignItems: "flex-end" }}>
            <HeroSlideshow />
          </div>
        </section>

        {/* ── Upcoming Events preview ── */}
        <section style={{ padding: "8rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem" }}>
            <span className="label-text" style={{ color: "#0F1F3D" }}>Directory</span>
            <span className="label-text" style={{ color: "#5a7a9a" }}>행사 선택하기</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 600, color: "#0F1F3D", marginBottom: "4rem" }}>
            Upcoming Fairs
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4rem" }}>
            {[
              { img: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?auto=format&fit=crop&q=80&w=600", title: "행사 목록 보기", sub: "예약 가능한 모든 행사", href: "/events", btn: "전체 행사 →" },
              { img: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?auto=format&fit=crop&q=80&w=600", title: "빠른 예약", sub: "2분 안에 예약 완료", href: "/events", btn: "지금 예약하기 →" },
              { img: "https://images.unsplash.com/photo-1652882861012-95f3263cab63?auto=format&fit=crop&q=80&w=600", title: "내 예약 조회", sub: "예약번호로 확인", href: "/my-tickets", btn: "예약 조회 →" },
            ].map((card) => (
              <article key={card.title} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: "500px 500px 0 0", overflow: "hidden", background: "#0F1F3D" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, filter: "grayscale(0.3)" }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 600, color: "#0F1F3D", marginBottom: "0.5rem" }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#5a7a9a", marginBottom: "1rem" }}>{card.sub}</p>
                  <Link href={card.href} className="btn-primary" style={{ display: "inline-flex" }}>
                    {card.btn}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── The Aura Standard ── */}
        <section style={{ backgroundColor: "#0F1F3D", padding: "8rem 2rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 600, color: "#A8C4DC", marginBottom: "4rem" }}>
              The Aura Standard
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
              {[
                { num: "01", title: "간편한 예약", desc: "4단계 예약 프로세스로 3분 안에 예약 완료. 별도 회원가입 없이 바로 예약하세요." },
                { num: "02", title: "QR 입장권", desc: "예약 완료 시 즉시 QR 코드 입장권 발급. PDF 저장 및 프린트 가능합니다." },
                { num: "03", title: "동호수 체크인", desc: "동호수 입력 한 번으로 빠른 체크인. 대기줄 없이 신속하게 입장하세요." },
                { num: "04", title: "개인정보 보호", desc: "AES 암호화로 개인정보를 안전하게 보호합니다. 개인정보보호법 완전 준수." },
              ].map((item) => (
                <div key={item.num} style={{ borderTop: "1px solid rgba(168,196,220,0.3)", paddingTop: "2rem" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", color: "#A8C4DC", display: "block", marginBottom: "1rem" }}>
                    {item.num}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, color: "#E8EEF4", marginBottom: "0.5rem" }}>
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

        {/* ── Kiosk CTA ── */}
        <section style={{ padding: "8rem 2rem", borderTop: "1px solid #0F1F3D", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 600, color: "#0F1F3D", marginBottom: "0.75rem" }}>
              On-Site Kiosk Experience
            </h2>
            <p className="label-text" style={{ color: "#5a7a9a" }}>동호수로 빠른 입장</p>
          </div>

          <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "#0F1F3D", padding: "2rem" }}>
            <div style={{ background: "var(--brand-lime)", padding: "2rem", textAlign: "center", minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: "2rem" }}>
              <p className="label-text" style={{ marginBottom: "0.5rem", color: "#0F1F3D" }}>Enter Unit Number</p>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", letterSpacing: "0.1em", borderBottom: "2px solid #0F1F3D", width: "80%", margin: "0 auto", minHeight: "4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                101동 402<span style={{ animation: "blink 1s step-end infinite" }}>|</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(168,196,220,0.2)" }}>
              {["1","2","3","4","5","6","7","8","9","동","0","호"].map((k) => (
                <div key={k} style={{
                  color: k === "동" || k === "호" ? "#0F1F3D" : "#A8C4DC",
                  background: k === "동" || k === "호" ? "var(--brand-accent)" : "#0F1F3D",
                  padding: "1.25rem 0", textAlign: "center",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem", cursor: "pointer",
                }}>
                  {k}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Link href="/kiosk" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
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
