interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
  return (
    <div style={{
      background: "#1e2342",
      borderRadius: "12px",
      padding: "1.25rem",
      border: "1px solid #2d3561",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "#adb5bd", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{title}</p>
          <p style={{ color: "white", fontSize: "2rem", fontWeight: "700", lineHeight: "1" }}>{value}</p>
          {subtitle && (
            <p style={{ color: "#868e96", fontSize: "0.75rem", marginTop: "0.375rem" }}>{subtitle}</p>
          )}
        </div>
        <div style={{
          width: "48px", height: "48px",
          backgroundColor: color + "20",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
