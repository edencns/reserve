"use client";

import AdminLayout from "@/components/admin/AdminLayout";

export default function CompanyPage() {
  return (
    <AdminLayout title="회사 정보">
      <div style={{ maxWidth: "800px" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.25rem", color: "#1A1F36", marginBottom: "0.5rem" }}>회사 정보</h2>
        <p style={{ color: "#868E96", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          회사 기본 정보 및 설정을 관리할 수 있습니다
        </p>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E9ECEF", padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "#868E96", fontSize: "0.9rem" }}>준비 중입니다</p>
        </div>
      </div>
    </AdminLayout>
  );
}
