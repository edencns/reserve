"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", icon: "⊞", label: "대시보드" },
  { href: "/admin/events", icon: "◫", label: "이벤트 관리" },
  { href: "/admin/reservations", icon: "≡", label: "예약 관리" },
  { href: "/admin/vendors", icon: "◈", label: "업체 관리" },
  { href: "/admin/contracts", icon: "⊟", label: "계약 관리" },
  { href: "/admin/stats", icon: "↗", label: "통계" },
  { href: "/admin/settlement", icon: "◎", label: "정산 관리" },
  { href: "/admin/company", icon: "◻", label: "회사 정보" },
];

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--brand-lime)", fontFamily: "var(--font-serif)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "230px", flexShrink: 0,
        background: "var(--brand-dark)",
        display: "flex", flexDirection: "column",
        minHeight: "100vh", position: "sticky", top: 0, alignSelf: "flex-start",
      }}>
        {/* Brand */}
        <div style={{ padding: "1.75rem 1.5rem", borderBottom: "1px solid rgba(232,238,244,0.1)" }}>
          <p style={{ color: "var(--brand-lime)", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.02em", marginBottom: "0.2rem" }}>
            Aura Fairs
          </p>
          <p style={{ color: "var(--brand-accent)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7 }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1.25rem 0.75rem", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.7rem 1rem",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: active ? 600 : 400,
                background: active ? "rgba(168,196,220,0.15)" : "transparent",
                color: active ? "var(--brand-lime)" : "rgba(232,238,244,0.55)",
                borderLeft: active ? "2px solid var(--brand-accent)" : "2px solid transparent",
                transition: "all 0.15s",
                letterSpacing: "0.02em",
              }}>
                <span style={{ fontSize: "0.9rem", width: "1.25rem", textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(232,238,244,0.1)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.7rem 1rem",
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: "0.85rem", fontWeight: 400,
              color: "rgba(232,238,244,0.45)", transition: "all 0.15s",
              fontFamily: "var(--font-serif)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand-lime)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(232,238,244,0.45)"; }}
          >
            <span>→</span> 로그아웃
          </button>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 1rem", textDecoration: "none", fontSize: "0.75rem", color: "rgba(232,238,244,0.3)", letterSpacing: "0.06em" }}>
            <span>↗</span> 사이트 보기
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{
          background: "white",
          borderBottom: "1px solid var(--brand-dark)",
          padding: "0 2rem", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <h1 style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--brand-dark)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {title || "Admin"}
          </h1>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
