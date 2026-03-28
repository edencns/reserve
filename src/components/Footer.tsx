export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #0F1F3D",
      padding: "4rem 2rem",
      textAlign: "center",
      backgroundColor: "#E8EEF4",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p className="label-text" style={{ color: "#0F1F3D", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
          Aura Move-in Fairs
        </p>
        <p className="label-text" style={{ color: "#5a7a9a", fontSize: "0.7rem", marginBottom: "0.5rem" }}>
          문의: 1234-5678 &nbsp;|&nbsp; info@aura-fairs.kr
        </p>
        <p className="label-text" style={{ color: "#5a7a9a", fontSize: "0.65rem" }}>
          © 2024 Aura Move-in Fairs. Not a straight line.
        </p>
      </div>
    </footer>
  );
}
