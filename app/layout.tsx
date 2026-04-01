import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import PrivacyFooter from './components/PrivacyFooter'

export const metadata: Metadata = {
  title: 'EDEN-Fair Link',
  description: '입주박람회 예약 및 관리 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <PrivacyFooter />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
