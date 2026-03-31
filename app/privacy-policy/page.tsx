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
        <h1 className="font-serif text-5xl mb-4">개인정보 처리방침</h1>
        <p className="text-sm opacity-50 mb-12">시행일: 2026년 4월 1일 | 최종 수정일: 2026년 3월 31일</p>

        <div className="prose prose-sm max-w-none space-y-8 text-[var(--brand-dark)]">
          <p className="opacity-80 leading-relaxed">
            주식회사 에덴씨엔에스(이하 &quot;회사&quot;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>

          {/* 제1조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제1조 (개인정보의 처리목적)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등
              필요한 조치를 이행할 예정입니다.
            </p>
            <div className="bg-white border border-[var(--brand-dark)]/20 p-5 space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-1">1. 입주박람회 예약 접수 및 관리</h4>
                <p className="text-sm opacity-70">예약 확인, 방문 일정 관리, 현장 체크인 서비스 제공</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">2. 계약서 업로드 및 확인 서비스</h4>
                <p className="text-sm opacity-70">고객 계약서 접수 확인, 본인 인증을 통한 접수 여부 조회</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">3. 서비스 개선 및 통계</h4>
                <p className="text-sm opacity-70">행사 운영 통계 분석, 서비스 품질 향상</p>
              </div>
            </div>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제2조 (수집하는 개인정보의 항목 및 수집방법)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--brand-dark)] text-white">
                    <th className="px-4 py-3 text-left font-medium">서비스</th>
                    <th className="px-4 py-3 text-left font-medium">필수 항목</th>
                    <th className="px-4 py-3 text-left font-medium">선택 항목</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">행사 예약</td>
                    <td className="px-4 py-3 opacity-70">이름, 전화번호, 동·호수</td>
                    <td className="px-4 py-3 opacity-70">이메일, 관심 서비스</td>
                  </tr>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">계약서 업로드</td>
                    <td className="px-4 py-3 opacity-70">이름, 전화번호 끝 4자리, 비밀번호(해시 저장), 계약서 파일</td>
                    <td className="px-4 py-3 opacity-70">-</td>
                  </tr>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">현장 체크인</td>
                    <td className="px-4 py-3 opacity-70">동·호수</td>
                    <td className="px-4 py-3 opacity-70">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm opacity-60 mt-3">
              ※ 전화번호는 끝 4자리만 보관하며, 나머지 자릿수는 수집 즉시 파기합니다.<br />
              ※ 비밀번호는 bcrypt 알고리즘으로 일방향 암호화하여 저장하며, 원문 복원이 불가능합니다.
            </p>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제3조 (개인정보의 처리 및 보유기간)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--brand-dark)] text-white">
                    <th className="px-4 py-3 text-left font-medium">처리 목적</th>
                    <th className="px-4 py-3 text-left font-medium">보유 기간</th>
                    <th className="px-4 py-3 text-left font-medium">근거</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">행사 예약 정보</td>
                    <td className="px-4 py-3 opacity-70">행사 종료 후 2년</td>
                    <td className="px-4 py-3 opacity-70">정보주체 동의</td>
                  </tr>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">계약서 업로드 기록</td>
                    <td className="px-4 py-3 opacity-70">업로드일로부터 5년</td>
                    <td className="px-4 py-3 opacity-70">전자상거래법 제6조</td>
                  </tr>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">접속 로그 기록</td>
                    <td className="px-4 py-3 opacity-70">3개월</td>
                    <td className="px-4 py-3 opacity-70">통신비밀보호법 제15조의2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm opacity-60 mt-3">
              보유기간 경과 후에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <p className="opacity-80 leading-relaxed">
              회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
              「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
            <p className="opacity-80 leading-relaxed mt-2">
              현재 회사는 이용자의 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 제3자 제공이 필요한 경우,
              정보주체에게 별도의 동의를 받은 후 진행합니다.
            </p>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제5조 (개인정보 처리의 위탁)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--brand-dark)] text-white">
                    <th className="px-4 py-3 text-left font-medium">수탁업체</th>
                    <th className="px-4 py-3 text-left font-medium">위탁 업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">Vercel Inc.</td>
                    <td className="px-4 py-3 opacity-70">웹사이트 호스팅 및 파일 저장(Vercel Blob)</td>
                  </tr>
                  <tr className="border-b border-[var(--brand-dark)]/10">
                    <td className="px-4 py-3 font-medium">Turso (ChiselStrike Inc.)</td>
                    <td className="px-4 py-3 opacity-70">데이터베이스 호스팅 및 관리</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm opacity-60 mt-3">
              회사는 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행 목적 외 개인정보 처리 금지,
              기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을
              계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독합니다.
            </p>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제6조 (개인정보의 파기절차 및 파기방법)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다.
            </p>
            <div className="bg-white border border-[var(--brand-dark)]/20 p-5 space-y-3">
              <div>
                <h4 className="font-bold text-sm mb-1">파기절차</h4>
                <p className="text-sm opacity-70">
                  이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 관련 법령에 따라
                  일정기간 저장된 후 혹은 즉시 파기됩니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는
                  다른 목적으로 이용되지 않습니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">파기방법</h4>
                <p className="text-sm opacity-70">
                  전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
                  종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제7조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              정보주체는 회사에 대해 언제든지 「개인정보 보호법」 제35조 내지 제37조에 따른 다음 각 호의
              개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm opacity-80">
              <li>개인정보 열람 요구 (제35조)</li>
              <li>개인정보 정정·삭제 요구 (제36조)</li>
              <li>개인정보 처리정지 요구 (제37조)</li>
            </ul>
            <p className="opacity-80 leading-relaxed mt-3">
              위 권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해
              지체 없이 조치하겠습니다.
            </p>
            <p className="opacity-80 leading-relaxed mt-2">
              정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를
              완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
            </p>
            <p className="opacity-80 leading-relaxed mt-2">
              만 14세 미만 아동의 경우, 법정대리인이 아동의 개인정보에 대한 열람, 정정·삭제, 처리정지를
              요구할 수 있습니다.
            </p>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제8조 (개인정보의 안전성 확보조치)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 「개인정보 보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적·관리적 및
              물리적 조치를 하고 있습니다.
            </p>
            <div className="bg-white border border-[var(--brand-dark)]/20 p-5 space-y-3">
              <div>
                <h4 className="font-bold text-sm mb-1">1. 비밀번호의 암호화</h4>
                <p className="text-sm opacity-70">
                  이용자의 비밀번호는 bcrypt 알고리즘(cost factor 12)으로 일방향 암호화하여 저장·관리됩니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">2. 접속 기록의 보관</h4>
                <p className="text-sm opacity-70">
                  개인정보 처리시스템에 접속한 기록(웹 로그, 접속 IP 정보 등)을 최소 3개월 이상 보관·관리합니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">3. 개인정보에 대한 접근 제한</h4>
                <p className="text-sm opacity-70">
                  개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여·변경·말소를 통하여
                  개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있습니다. 관리자 접근은 JWT 기반
                  인증 및 서버사이드 미들웨어를 통해 제어됩니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">4. 전송 구간 암호화</h4>
                <p className="text-sm opacity-70">
                  이용자의 개인정보는 HTTPS(TLS) 프로토콜을 통해 암호화되어 전송됩니다.
                  HSTS(HTTP Strict Transport Security) 헤더를 적용하여 비암호화 접속을 차단합니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">5. 해킹 등에 대비한 기술적 대책</h4>
                <p className="text-sm opacity-70">
                  보안 헤더(X-Content-Type-Options, X-Frame-Options, Referrer-Policy 등)를 적용하고,
                  로그인 시도 횟수 제한(5회 실패 시 15분 잠금) 등 무차별 대입 공격 방지 조치를 취하고 있습니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">6. 개인정보의 최소 수집</h4>
                <p className="text-sm opacity-70">
                  전화번호는 끝 4자리만 저장하고, 비밀번호는 일방향 해시로만 저장하는 등
                  필요 최소한의 개인정보만 수집·보관합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제9조 (자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고
              수시로 불러오는 &apos;쿠키(Cookie)&apos;를 사용합니다.
            </p>
            <div className="bg-white border border-[var(--brand-dark)]/20 p-5 space-y-3">
              <div>
                <h4 className="font-bold text-sm mb-1">쿠키의 사용 목적</h4>
                <p className="text-sm opacity-70">
                  관리자 로그인 세션 유지를 위해 httpOnly 보안 쿠키를 사용합니다.
                  이용자의 행태 분석이나 광고 목적의 쿠키는 사용하지 않습니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">쿠키의 설치·운영 및 거부</h4>
                <p className="text-sm opacity-70">
                  이용자는 웹 브라우저의 설정을 통해 쿠키 저장을 거부할 수 있습니다. 다만,
                  쿠키 저장을 거부할 경우 관리자 로그인 등 일부 서비스 이용에 어려움이 있을 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제10조 (개인정보 보호책임자)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
              피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-white border border-[var(--brand-dark)]/20 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="opacity-50">직책</span>
                  <p className="font-medium">대표이사</p>
                </div>
                <div>
                  <span className="opacity-50">연락처</span>
                  <p className="font-medium">contact@eden-fairlink.com</p>
                </div>
              </div>
            </div>
            <p className="text-sm opacity-60 mt-3">
              정보주체는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
              피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
              회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드리겠습니다.
            </p>
          </section>

          {/* 제11조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제11조 (권익침해 구제방법)</h2>
            <p className="opacity-80 leading-relaxed mb-3">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회,
              한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <div className="bg-white border border-[var(--brand-dark)]/20 p-5 space-y-2 text-sm">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-medium min-w-[180px]">개인정보분쟁조정위원회</span>
                <span className="opacity-70">1833-6972 (www.kopico.go.kr)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-medium min-w-[180px]">개인정보침해신고센터</span>
                <span className="opacity-70">118 (privacy.kisa.or.kr)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-medium min-w-[180px]">대검찰청 사이버수사과</span>
                <span className="opacity-70">1301 (www.spo.go.kr)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-medium min-w-[180px]">경찰청 사이버수사국</span>
                <span className="opacity-70">182 (ecrm.cyber.go.kr)</span>
              </div>
            </div>
          </section>

          {/* 제12조 */}
          <section>
            <h2 className="font-serif text-2xl mb-4">제12조 (개인정보 처리방침의 변경)</h2>
            <p className="opacity-80 leading-relaxed">
              이 개인정보 처리방침은 2026년 4월 1일부터 적용됩니다. 개인정보 처리방침의 내용 추가, 삭제 및
              수정이 있을 경우에는 시행일의 7일 전부터 웹사이트 공지사항을 통하여 고지할 것입니다.
              다만, 개인정보의 수집·이용 목적, 제3자 제공 대상 등 중요한 사항이 변경되는 경우에는
              시행일의 30일 전부터 고지합니다.
            </p>
          </section>
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
