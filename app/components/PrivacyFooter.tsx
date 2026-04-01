'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function PrivacyFooter() {
  const pathname = usePathname()

  // 키오스크 페이지에서는 숨김
  if (pathname?.startsWith('/kiosk')) return null

  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm py-4 px-6 text-center text-xs text-gray-500">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span>&copy; {new Date().getFullYear()} EDEN-Fair Link</span>
        <span className="text-gray-300">|</span>
        <Link
          href="/privacy-policy"
          className="underline underline-offset-2 hover:text-gray-800 transition-colors"
        >
          개인정보처리방침
        </Link>
      </div>
    </footer>
  )
}
