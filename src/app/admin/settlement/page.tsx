"use client";

import AdminLayout from "@/components/admin/AdminLayout";

const mockSettlements = [
  { vendor: "삼성전자", event: "래미안 포레스트 2026", amount: 5000000, commission: 10, status: "pending", date: "2026-10-15" },
  { vendor: "한샘", event: "래미안 포레스트 2026", amount: 8000000, commission: 12, status: "completed", date: "2026-10-15" },
  { vendor: "LG전자", event: "래미안 포레스트 2026", amount: 6500000, commission: 10, status: "paid", date: "2026-10-15" },
  { vendor: "현대리바트", event: "헤리티지 팰리스 2026", amount: 4200000, commission: 12, status: "pending", date: "2026-11-01" },
  { vendor: "에넥스", event: "헤리티지 팰리스 2026", amount: 3100000, commission: 12, status: "completed", date: "2026-11-01" },
];

const statusStyle: Record<string, { text: string; color: string }> = {
  pending: { text: "정산 대기", color: "#F59F00" },
  completed: { text: "정산 완료", color: "#2F9E44" },
  paid: { text: "지급 완료", color: "#3B5BDB" },
};

export default function SettlementPage() {
  const totalAmount = mockSettlements.reduce((s, r) => s + r.amount, 0);
  const totalCommission = mockSettlements.reduce((s, r) => s + Math.round(r.amount * r.commission / 100), 0);

  return (
    <AdminLayout title="정산 관리">
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "총 매출", value: `${totalAmount.toLocaleString()}원` },
          { label: "총 수수료", value: `${totalCommission.toLocaleString()}원` },
          { label: "정산 건수", value: `${mockSettlements.length}건` },
          { label: "지급 완료", value: `${mockSettlements.filter(s => s.status === "paid").length}건` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--brand-dark)", color: "var(--brand-lime)", padding: "1.25rem 1.5rem", border: "1px solid var(--brand-dark)" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.5rem" }}>{label}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-serif)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "white", border: "1px solid var(--brand-dark)", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--brand-dark)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-dark)" }}>정산 내역</h2>
          <button className="btn-secondary" style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}>
            엑셀 다운로드
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--brand-dark)", background: "var(--brand-lime)" }}>
              {["업체명", "행사", "매출액", "수수료율", "수수료", "정산일", "상태"].map((col) => (
                <th key={col} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand-dark)", opacity: 0.6 }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockSettlements.map((row, i) => {
              const commission = Math.round(row.amount * row.commission / 100);
              const st = statusStyle[row.status];
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <td style={{ padding: "0.9rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--brand-dark)" }}>{row.vendor}</td>
                  <td style={{ padding: "0.9rem 1rem", fontSize: "0.8rem", color: "var(--brand-dark)", opacity: 0.7 }}>{row.event}</td>
                  <td style={{ padding: "0.9rem 1rem", fontSize: "0.875rem", fontWeight: 600 }}>{row.amount.toLocaleString()}원</td>
                  <td style={{ padding: "0.9rem 1rem", fontSize: "0.875rem" }}>{row.commission}%</td>
                  <td style={{ padding: "0.9rem 1rem", fontSize: "0.875rem", fontWeight: 600 }}>{commission.toLocaleString()}원</td>
                  <td style={{ padding: "0.9rem 1rem", fontSize: "0.8rem", opacity: 0.7 }}>{row.date}</td>
                  <td style={{ padding: "0.9rem 1rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: st.color, border: `1px solid ${st.color}`, padding: "0.2rem 0.5rem" }}>
                      {st.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
