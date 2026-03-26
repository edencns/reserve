"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", icon: "⊞", label: "대시보드" },
  { href: "/admin/events", icon: "📅", label: "이벤트 관리" },
  { href: "/admin/reservations", icon: "📋", label: "예약 관리" },
  { href: "/admin/qr", icon: "⬛", label: "QR 체크인" },
  { href: "/admin/stats", icon: "📊", label: "통계" },
  { href: "/admin/visits", icon: "👥", label: "방문 현황" },
  { href: "/admin/vendors", icon: "🏪", label: "입점 업체 관리" },
  { href: "/admin/contracts", icon: "📄", label: "계약 관리" },
  { href: "/admin/company", icon: "🏢", label: "회사 정보" },
];

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8F9FF" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px", flexShrink: 0,
        background: "#3B5BDB",
        display: "flex", flexDirection: "column",
        minHeight: "100vh", position: "sticky", top: 0, alignSelf: "flex-start",
      }}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: "32px", height: "32px", background: "white",
              borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#3B5BDB", fontWeight: "800", fontSize: "1rem",
            }}>⊞</div>
            <div>
              <p style={{ color: "white", fontWeight: "800", fontSize: "0.9rem", lineHeight: "1.2" }}>관리자 패널</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem" }}>ReserveTicket Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.7rem 1rem", borderRadius: "8px", textDecoration: "none",
                fontSize: "0.875rem", fontWeight: active ? "700" : "500",
                background: active ? "rgba(255,255,255,0.2)" : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.7rem 1rem", borderRadius: "8px",
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: "0.875rem", fontWeight: "500",
              color: "rgba(255,255,255,0.75)", transition: "all 0.15s",
            }}>
            <span>🚪</span> 로그아웃
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{
          background: "white", borderBottom: "1px solid #E9ECEF",
          padding: "0 1.5rem", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <h1 style={{ fontWeight: "700", fontSize: "1rem", color: "#1A1F36" }}>
            {title || "관리자 패널"}
          </h1>
          <Link href="/events" target="_blank" style={{
            color: "#3B5BDB", fontSize: "0.8rem", textDecoration: "none",
            fontWeight: "600", display: "flex", alignItems: "center", gap: "0.25rem",
          }}>
            사이트 보기 →
          </Link>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
