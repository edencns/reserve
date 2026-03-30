'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: '#E8EEF4',
      borderBottom: '1px solid #0F1F3D',
      boxShadow: scrolled ? '0 2px 12px rgba(15,31,61,0.08)' : 'none',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="label-text" style={{ color: '#0F1F3D', fontSize: '0.85rem', letterSpacing: '0.12em' }}>
            Aura Fairs
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hide-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/events" className="label-text" style={{
            color: pathname === '/events' ? '#0F1F3D' : '#5a7a9a',
            textDecoration: 'none', transition: 'color 0.2s',
          }}>
            Events
          </Link>
          <Link href="/my-tickets" className="label-text" style={{
            color: pathname === '/my-tickets' ? '#0F1F3D' : '#5a7a9a',
            textDecoration: 'none', transition: 'color 0.2s',
          }}>
            My Tickets
          </Link>
          <Link href="/kiosk" className="label-text" style={{
            color: pathname === '/kiosk' ? '#0F1F3D' : '#5a7a9a',
            textDecoration: 'none', transition: 'color 0.2s',
          }}>
            Kiosk
          </Link>
          <Link href="/events" className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Reserve Now
          </Link>
          <Link href="/admin/login" className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
            Admin
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hide-desktop"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F1F3D', fontSize: '1.4rem', padding: '0.25rem' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: '#E8EEF4',
          borderTop: '1px solid #0F1F3D',
          padding: '1.5rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {[
            { href: '/events', label: 'Events' },
            { href: '/kiosk', label: 'Kiosk' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              className="label-text"
              style={{ color: '#0F1F3D', textDecoration: 'none', padding: '0.5rem 0' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/events" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
            Reserve Now
          </Link>
          <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}
