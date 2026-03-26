'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  const navItems = [
    { href: '/events', label: '행사 목록' },
    { href: '/kiosk', label: '키오스크 입장' },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid #E9ECEF' : '1px solid transparent',
      transition: 'all 0.3s',
      boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1rem' }}>R</div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: scrolled ? 'var(--color-dark-navy)' : 'white' }}>입주박람회 예약</span>
        </Link>

        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="hide-mobile">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none',
              fontWeight: '600', fontSize: '0.9rem',
              color: pathname === item.href ? 'var(--color-primary)' : (scrolled ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.85)'),
              background: pathname === item.href ? 'rgba(59,91,219,0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {item.label}
            </Link>
          ))}
          <Link href="/events" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
            지금 예약하기
          </Link>
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="hide-desktop" style={{ background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? 'var(--color-text-primary)' : 'white', fontSize: '1.5rem' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #E9ECEF', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ padding: '0.75rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/events" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
            지금 예약하기
          </Link>
        </div>
      )}
    </header>
  )
}
