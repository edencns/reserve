import { Link } from 'react-router';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="font-serif text-xl tracking-tight">EDEN-Fair Link</Link>
          <Link to="/" className="text-xs uppercase tracking-[0.15em] hover:opacity-60 transition-opacity">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-5xl mb-3">개인정보처리방침</h1>
          <p className="text-sm opacity-60">최종 수정일: 2026년 3월 31일</p>
        </div>

        <div className="bg-white border-2 border-[var(--brand-dark)] p-8 space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold mb-3">제1조 (개인정보 수집 항목 및 목적)</h2>
            <p className="mb-3">EDEN-Fair Link(이하 "회사")는 다음과 같이 개인정보를 수집·이용합니다.</p>
            <table className="w-full border border-[var(--brand-dark)]/20 text-xs">
              <thead className="bg-[var(--brand-lime)]">
                <tr>
                  <th className="border border-[var(--brand-dark)]/20 px-3 py-2 text-left">수집 목적</th>
                  <th className="border border-[var(--brand-dark)]/20 px-3 py-2 text-left">수집 항목</th>
                  <th className="border border-[var(--brand-dark)]/20 px-3 py-2 text-left">보유 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--brand-dark)]/20 px-3 py-2">행사 예약 및 입장 확인</td>
                  <td className="border border-[var(--brand-dark)]/20 px-3 py-2">이름, 전화번호, 이메일(선택), 동호수</td>
                  <td className="border border-[var(--brand-dark)]/20 px-3 py-2">행사 종료 후 2년</td>
                </tr>
                <tr>
                  <td className="border border-[var(--brand-dark)]/20 px-3 py-2">계약서 접수 및 본인 확인</td>
                  <td className="border border-[var(--brand-dark)]/20 px-3 py-2">이름, 전화번호, 계약서 파일</td>
                  <td className="border border-[var(--brand-dark)]/20 px-3 py-2">5년 (전자상거래법 제6조)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제2조 (개인정보의 보유 및 이용 기간)</h2>
            <p>수집된 개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보존합니다.</p>
            <ul className="list-disc ml-5 mt-2 space-y-1 opacity-70">
              <li>소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
              <li>계약 또는 청약철회에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 공급 기록: 5년 (전자상거래법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제3조 (개인정보의 제3자 제공)</h2>
            <p>회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.</p>
            <ul className="list-disc ml-5 mt-2 space-y-1 opacity-70">
              <li>정보주체가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제4조 (정보주체의 권리)</h2>
            <p className="mb-2">정보주체는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc ml-5 space-y-1 opacity-70">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-2">권리 행사는 아래 개인정보 보호책임자에게 서면 또는 이메일로 요청하시면 지체 없이 조치하겠습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제5조 (개인정보 보호책임자)</h2>
            <div className="bg-[var(--brand-lime)] p-4 space-y-1 text-xs">
              <div><span className="font-semibold">회사명:</span> (주)이든씨앤에스</div>
              <div><span className="font-semibold">담당부서:</span> 개인정보 보호팀</div>
              <div><span className="font-semibold">이메일:</span> privacy@edencns.com</div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제6조 (개인정보처리방침의 변경)</h2>
            <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침 변경에 따른 내용의 추가·삭제·정정이 있는 경우에는 변경 사항 시행 7일 전부터 공지합니다.</p>
          </section>

          <div className="border-t border-[var(--brand-dark)]/20 pt-4 text-xs opacity-50 text-center">
            본 방침은 2026년 3월 31일부터 시행됩니다.
          </div>
        </div>
      </main>
    </div>
  );
}
