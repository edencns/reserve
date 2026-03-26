export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A1F36", color: "#adb5bd", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontWeight: "700", color: "white", marginBottom: "0.5rem" }}>
          입주박람회 방문 예약 서비스
        </p>
        <p style={{ fontSize: "0.875rem" }}>
          문의: 1234-5678 | 이메일: info@fairreserve.kr
        </p>
        <p style={{ fontSize: "0.75rem", marginTop: "1rem" }}>
          © 2024 입주박람회 예약 서비스. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
