'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { mockEvents } from '../../../src/app/mockData';
import { Check, X, Keyboard, RefreshCw, Settings, Maximize } from 'lucide-react';
import { toast } from 'sonner';

type TicketData = {
  customer_name: string;
  event_title: string;
  venue: string;
  date: string;
  time: string;
  unit_number: string;
  id: string;
};

export default function KioskPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const event = mockEvents.find((e) => e.slug === slug);
  const [input, setInput] = useState('');
  const [checkedInName, setCheckedInName] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 전체화면 진입/해제 감지
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // F11 / Escape 키 방지
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') { e.preventDefault(); enterFullscreen(); }
      if (e.key === 'Escape' && !document.fullscreenElement) setTimeout(enterFullscreen, 300);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function enterFullscreen() {
    const el = containerRef.current ?? document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
  }
  function exitFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }


  const [showFab, setShowFab] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [failCount, setFailCount] = useState(() => {
    const key = `kiosk_fail_${slug}`;
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return 0;
      const { count, until } = JSON.parse(stored) as { count: number; until: number };
      if (Date.now() > until) { sessionStorage.removeItem(key); return 0; }
      return count;
    } catch { return 0; }
  });
  const [lockedUntil, setLockedUntil] = useState<number>(() => {
    const key = `kiosk_fail_${slug}`;
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return 0;
      const { until } = JSON.parse(stored) as { count: number; until: number };
      return Date.now() > until ? 0 : until;
    } catch { return 0; }
  });

  const MAX_FAIL = 5;
  const LOCK_MS = 5 * 60 * 1000;

  function recordFail() {
    const key = `kiosk_fail_${slug}`;
    const newCount = failCount + 1;
    const until = newCount >= MAX_FAIL ? Date.now() + LOCK_MS : 0;
    sessionStorage.setItem(key, JSON.stringify({ count: newCount, until }));
    setFailCount(newCount);
    if (until) setLockedUntil(until);
  }

  function resetFail() {
    const key = `kiosk_fail_${slug}`;
    sessionStorage.removeItem(key);
    setFailCount(0);
    setLockedUntil(0);
  }

  const isLocked = lockedUntil > 0 && Date.now() < lockedUntil;

  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--brand-dark)] text-[var(--brand-lime)] flex items-center justify-center">
        <h1 className="font-serif text-4xl">Event Not Found</h1>
      </div>
    );
  }

  // 이벤트 타이틀 분리: "Oasis Heights 입주박람회" → ["Oasis Heights", "입주박람회"]
  const titleParts = event.title.endsWith('입주박람회')
    ? [event.title.replace('입주박람회', '').trim(), '입주박람회']
    : [event.title];

  const handleNumber = (num: string) => {
    if (input.length < 20) setInput(input + num);
  };
  const handleDong = () => {
    if (!input.includes('동')) setInput(input + '동 ');
  };
  const handleHo = () => {
    if (input.includes('동') && !input.includes('호')) setInput(input + '호');
  };
  const handleClear = () => {
    setInput('');
    setCheckedInName(null);
    setTicketData(null);
  };

  const handleCheckIn = async () => {
    if (submitting) return;

    if (isLocked) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 60000);
      toast.error(`시도 횟수 초과. ${remaining}분 후 다시 시도하세요.`);
      return;
    }

    if (!input.includes('동') || !input.includes('호')) {
      toast.error('동호수 형식을 확인해주세요 (예: 101동 1001호)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, unitNumber: input }),
      });
      const data = await res.json();

      if (!res.ok) {
        recordFail();
        const remaining = MAX_FAIL - (failCount + 1);
        const errMsg = data.error === '예약을 찾을 수 없습니다.'
          ? '예약된 번호가 아닙니다.'
          : (data.error || '예약된 번호가 아닙니다.');
        toast.error(
          remaining > 0
            ? `${errMsg} (남은 시도: ${remaining}회)`
            : '시도 횟수 초과. 5분 후 다시 시도하세요.'
        );
        return;
      }

      resetFail();
      const reservation = data.reservation as TicketData;
      setCheckedInName(reservation?.customer_name ?? '고객');
      setTicketData(reservation ?? null);

      printTicket(reservation, titleParts);

      setTimeout(() => { handleClear(); }, 4000);

    } catch {
      toast.error('서버 오류가 발생했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  // iframe 프린트: 티켓 HTML만 독립된 iframe에서 출력 → 중복/레이아웃 문제 완전 차단
  const printTicket = useCallback((ticket: TicketData, parts: string[]) => {
    const dateStr = ticket.date
      ? new Date(ticket.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

    const logoImg = `<img src="data:image/png;base64,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" alt="EDEN-FAIR LINK" style="width:16mm;height:16mm;display:block;margin:0 auto 2mm">`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      @page { size: 80mm auto; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; width: 80mm; font-family: "Apple SD Gothic Neo","Malgun Gothic","맑은 고딕",sans-serif; font-size: 12pt; line-height: 1.6; }
      .wrap { width: 72mm; padding: 2.5mm 6mm 5mm; }
      .logo { text-align: center; margin-bottom: 4mm; }
      .brand { font-size: 8pt; letter-spacing: 2px; color: #444; }
      .title-box { border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 3mm 0; margin-bottom: 4mm; text-align: center; }
      .title-main { font-size: 16pt; font-weight: 700; line-height: 1.3; }
      .title-sub { font-size: 14pt; font-weight: 700; }
      .badge { font-size: 11pt; letter-spacing: 4px; margin-top: 1.5mm; color: #333; }
      table { width: 100%; font-size: 11pt; border-collapse: collapse; }
      td { vertical-align: top; }
      td:first-child { color: #555; padding-right: 3mm; white-space: nowrap; width: 14mm; padding-bottom: 2.5mm; }
      td:last-child { font-weight: 600; padding-bottom: 2.5mm; }
      .ref { border-top: 1px dashed #999; margin-top: 4mm; padding-top: 2.5mm; font-size: 8pt; text-align: center; color: #777; letter-spacing: 1px; }
    </style></head><body>
    <div class="wrap">
      <div class="logo">${logoImg}<div class="brand">EDEN-FAIR LINK</div></div>
      <div class="title-box">
        <div class="title-main">${parts[0]}</div>
        ${parts[1] ? `<div class="title-sub">${parts[1]}</div>` : ''}
        <div class="badge">입  장  권</div>
      </div>
      <table><tbody>
        <tr><td>성명</td><td>${ticket.customer_name}</td></tr>
        <tr><td>동호수</td><td>${ticket.unit_number}</td></tr>
        <tr><td>장소</td><td style="font-weight:400">${ticket.venue}</td></tr>
        <tr><td>일시</td><td style="font-weight:400">${dateStr} ${ticket.time}</td></tr>
      </tbody></table>
      <div class="ref">REF: ${ticket.id.slice(0, 8).toUpperCase()}</div>
    </div>
    <script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); }; };<\/script>
    </body></html>`;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:80mm;height:1px;border:none;visibility:hidden;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
    // iframe 내부 onload에서 print 실행 후 정리
    iframe.onload = () => {
      setTimeout(() => { document.body.removeChild(iframe); }, 5000);
    };
  }, []);

  const handleRefresh = () => window.location.reload();
  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
    toast.info(showKeyboard ? '화상 키보드 끄기' : '화상 키보드 켜기');
  };


  return (
    <>

      {/* 키오스크 메인 UI */}
      <div ref={containerRef} className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center p-8 relative print:hidden">
        {/* 전체화면 아닐 때 상단 배너 */}
        {!isFullscreen && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--brand-dark)] text-[var(--brand-lime)] flex items-center justify-between px-6 py-3">
            <span className="text-sm">키오스크 전체화면 모드를 사용하세요</span>
            <button
              onClick={enterFullscreen}
              className="flex items-center gap-2 px-4 py-1.5 border border-[var(--brand-lime)] text-sm hover:bg-[var(--brand-lime)] hover:text-[var(--brand-dark)] transition-colors"
            >
              <Maximize className="w-4 h-4" />
              전체화면으로 전환
            </button>
          </div>
        )}

        <div className="w-full max-w-2xl" style={!isFullscreen ? { marginTop: '52px' } : {}}>
          {/* Event Header - 줄바꿈 처리 */}
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-2">
              입주박람회 현장 키오스크
            </div>
            <h1 className="font-serif text-6xl mb-4 leading-tight">
              {titleParts.map((part, i) => (
                <span key={i} className="block">{part}</span>
              ))}
            </h1>
            <p className="text-lg opacity-70">{event.venue}</p>
          </div>

          {/* Kiosk Interface */}
          <div className="bg-white border-2 border-[var(--brand-dark)] p-8 shadow-xl">
            {/* Screen */}
            <div className="bg-[var(--brand-lime)] border-2 border-[var(--brand-dark)] p-12 mb-8 min-h-[280px] flex flex-col items-center justify-center">
              {checkedInName ? (
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--brand-dark)] flex items-center justify-center mx-auto mb-6">
                    <Check className="w-12 h-12 text-[var(--brand-lime)]" />
                  </div>
                  <div className="font-serif text-5xl mb-3">입장권 출력 완료</div>
                  <div className="text-xl opacity-70">환영합니다, {checkedInName}님!</div>
                </div>
              ) : (
                <>
                  <div className="text-base uppercase tracking-[0.15em] mb-8 opacity-70">
                    예약하신 동호수를 입력하고 확인 버튼을 눌러주세요
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <div className="font-serif text-7xl text-center min-h-[100px] flex items-center justify-center px-8">
                      {input || <span className="opacity-20 text-5xl">예: 101동 1001호</span>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumber(num.toString())}
                  className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-8 text-4xl font-serif hover:bg-[#1a2f5a] transition-colors border-2 border-[var(--brand-dark)] hover:scale-105 active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleDong}
                className={`${input.includes('동') ? 'bg-[var(--brand-accent)]' : 'bg-white'} text-[var(--brand-dark)] border-2 border-[var(--brand-dark)] p-8 text-xl font-serif uppercase tracking-wider hover:bg-[var(--brand-accent)] transition-colors hover:scale-105 active:scale-95`}
              >
                동
              </button>
              <button
                onClick={() => handleNumber('0')}
                className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-8 text-4xl font-serif hover:bg-[#1a2f5a] transition-colors border-2 border-[var(--brand-dark)] hover:scale-105 active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleHo}
                className={`${input.includes('호') ? 'bg-[var(--brand-accent)]' : 'bg-white'} text-[var(--brand-dark)] border-2 border-[var(--brand-dark)] p-8 text-xl font-serif uppercase tracking-wider hover:bg-[var(--brand-accent)] transition-colors hover:scale-105 active:scale-95`}
              >
                호
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={handleClear}
                className="bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] p-6 text-xl uppercase tracking-wider hover:bg-[var(--brand-lime)] transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-6 h-6" />
                초기화
              </button>
              <button
                onClick={handleCheckIn}
                disabled={submitting}
                className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-6 text-xl uppercase tracking-wider hover:bg-[#1a2f5a] transition-colors flex items-center justify-center gap-2 border-2 border-[var(--brand-dark)] disabled:opacity-50"
              >
                <Check className="w-6 h-6" />
                {submitting ? '확인 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>

        {/* FAB */}
        <button
          onClick={() => setShowFab(!showFab)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[var(--brand-dark)] text-[var(--brand-lime)] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#1a2f5a] transition-all hover:scale-110 border-2 border-[var(--brand-accent)] z-50"
        >
          <Settings className={`w-7 h-7 transition-transform ${showFab ? 'rotate-90' : ''}`} />
        </button>

        {showFab && (
          <div className="fixed bottom-28 right-8 flex flex-col gap-3 z-40">
            <button
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="w-14 h-14 bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
              title={isFullscreen ? '전체화면 해제' : '전체화면'}
            >
              <Maximize className="w-6 h-6" />
            </button>
            <button
              onClick={handleKeyboardToggle}
              className="w-14 h-14 bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
              title="화상 키보드"
            >
              <Keyboard className="w-6 h-6" />
            </button>
            <button
              onClick={handleRefresh}
              className="w-14 h-14 bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
              title="새로고침"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

    </>
  );
}
