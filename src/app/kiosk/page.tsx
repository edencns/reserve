import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRScanner from "@/components/QRScanner";

export default function KioskPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--brand-lime)" }}>
      <Header />

      <main style={{ flex: 1, padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{
              fontSize: "0.7rem",
              fontWeight: "600",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--brand-dark)",
              opacity: 0.5,
              marginBottom: "0.75rem",
            }}>
              Kiosk Check-in
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "var(--brand-dark)",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}>
              키오스크<br />체크인
            </h1>
            <p style={{
              fontSize: "0.9rem",
              color: "var(--brand-dark)",
              opacity: 0.6,
              lineHeight: 1.6,
              letterSpacing: "0.02em",
            }}>
              예약번호를 입력하여 입장을 확인합니다
            </p>
          </div>

          <QRScanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
