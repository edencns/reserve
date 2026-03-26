import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRScanner from "@/components/QRScanner";

export default function KioskPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "3rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontWeight: "800", fontSize: "2rem", marginBottom: "0.5rem" }}>
            키오스크 체크인
          </h1>
          <p style={{ color: "#868e96", marginBottom: "2.5rem", fontSize: "1rem" }}>
            QR 코드를 스캔하거나 예약번호를 입력하여 입장을 확인합니다
          </p>

          <QRScanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
