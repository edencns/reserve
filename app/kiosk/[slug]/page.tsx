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

    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110" style="width:16mm;height:15mm;display:block;margin:0 auto 2mm">
      <polygon points="8,48 60,4 112,48" fill="#2B5BA7"/>
      <rect x="8" y="46" width="104" height="60" fill="#2B5BA7"/>
      <rect x="20" y="58" width="50" height="10" fill="white" rx="1"/>
      <rect x="20" y="73" width="38" height="10" fill="white" rx="1"/>
      <rect x="20" y="88" width="50" height="10" fill="white" rx="1"/>
      <rect x="82" y="62" width="18" height="44" fill="white" rx="1"/>
    </svg>`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      @page { size: 80mm auto; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; width: 80mm; font-family: "Apple SD Gothic Neo","Malgun Gothic","맑은 고딕",sans-serif; font-size: 12pt; line-height: 1.6; }
      .wrap { width: 72mm; padding: 5mm 6mm; }
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
      <div class="logo">${logoSvg}<div class="brand">EDEN-FAIR LINK</div></div>
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
