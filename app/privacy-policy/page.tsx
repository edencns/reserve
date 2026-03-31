'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <Link href="/" className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-xs uppercase tracking-[0.15em]">EDEN-Fair Link</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="font-serif text-5xl mb-8">개인정보 처리방침</h1>
        <div className="prose prose-sm max-w-none space-y-6 opacity-80">
          <p>
            EDEN-Fair Link(이하 "회사")는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고
            개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
          </p>
          <h2 className="font-serif text-2xl mt-8 mb-4">1. 개인정보의 처리목적</h2>
          <p>
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
            용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의
            동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>입주박람회 예약 접수 및 관리</li>
            <li>현장 체크인 서비스 제공</li>
            <li>계약서 업로드 및 확인 서비스</li>
          </ul>
          <h2 className="font-serif text-2xl mt-8 mb-4">2. 개인정보의 처리 및 보유기간</h2>
          <p>
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
            개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <h2 className="font-serif text-2xl mt-8 mb-4">3. 정보주체의 권리·의무 및 행사방법</h2>
          <p>
            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다: 개인정보 열람요구,
            오류 등이 있을 경우 정정 요구, 삭제요구, 처리정지 요구.
          </p>
          <h2 className="font-serif text-2xl mt-8 mb-4">4. 문의처</h2>
          <p>
            개인정보와 관련한 문의사항은 아래 연락처로 문의하시기 바랍니다.<br />
            이메일: contact@eden-fairlink.com
          </p>
        </div>
      </main>

      <footer className="border-t border-[var(--brand-dark)] py-16 text-center">
        <p className="text-xs uppercase tracking-[0.15em]">
          © 2026 EDEN-Fair Link. Not a straight line.
        </p>
      </footer>
    </div>
  )
}
