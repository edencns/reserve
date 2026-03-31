'use client'
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockEvents, mockReservations, checkInReservation } from '../../../src/app/mockData';
import { Check, X, Power, Keyboard, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function KioskPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const event = mockEvents.find((e) => e.slug === slug);
  const [input, setInput] = useState('');
  const [checkedInId, setCheckedInId] = useState<string | null>(null);
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

  const handleNumber = (num: string) => {
    if (input.length < 20) {
      setInput(input + num);
    }
  };

  const handleDong = () => {
    // Add "동 " (with space) if not already present
    if (!input.includes('동')) {
      setInput(input + '동 ');
    }
  };

  const handleHo = () => {
    // Add "호" if not already present and "동" exists
    if (input.includes('동') && !input.includes('호')) {
      setInput(input + '호');
    }
  };

  const handleClear = () => {
    setInput('');
    setCheckedInId(null);
  };

  const handleCheckIn = () => {
    if (isLocked) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 60000);
      toast.error(`시도 횟수 초과. ${remaining}분 후 다시 시도하세요.`);
      return;
    }

    // Check if input follows format "XXX동 XXX호"
    if (!input.includes('동') || !input.includes('호')) {
      toast.error('동호수 형식을 확인해주세요 (예: 101동 1001호)');
      return;
    }

    const unitNumber = input;

    // Find reservation by unit number
    const reservation = mockReservations.find(
      (r) =>
        r.eventId === event.id &&
        r.extraFields.unitNumber === unitNumber
    );

    if (!reservation) {
      recordFail();
      const remaining = MAX_FAIL - (failCount + 1);
      toast.error(remaining > 0 ? `예약을 찾을 수 없습니다 (남은 시도: ${remaining}회)` : '시도 횟수 초과. 5분 후 다시 시도하세요.');
      return;
    }

    if (reservation.checkedIn) {
      toast.error('이미 체크인된 예약입니다');
      return;
    }

    const success = checkInReservation(reservation.id);
    if (success) {
      resetFail();
      setCheckedInId(reservation.id);
      toast.success('입장권 출력 중입니다...');
      setTimeout(() => {
        handleClear();
      }, 4000);
    }
  };

  const handlePowerOff = () => {
    if (window.confirm('키오스크를 종료하시겠습니까?')) {
      window.close();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
    toast.info(showKeyboard ? '화상 키보드 끄기' : '화상 키보드 켜기');
  };

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center p-8 relative">
      <div className="w-full max-w-2xl">
        {/* Event Header */}
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-2">
            입주박람회 현장 키오스크
          </div>
          <h1 className="font-serif text-6xl mb-4">{event.title}</h1>
          <p className="text-lg opacity-70">{event.venue}</p>
        </div>

        {/* Kiosk Interface */}
        <div className="bg-white border-2 border-[var(--brand-dark)] p-8 shadow-xl">
          {/* Screen */}
          <div className="bg-[var(--brand-lime)] border-2 border-[var(--brand-dark)] p-12 mb-8 min-h-[280px] flex flex-col items-center justify-center">
            {checkedInId ? (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[var(--brand-dark)] flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-[var(--brand-lime)]" />
                </div>
                <div className="font-serif text-5xl mb-3">
                  입장권 출력 완료
                </div>
                <div className="text-xl opacity-70">환영합니다!</div>
              </div>
            ) : (
              <>
                <div className="text-sm uppercase tracking-[0.15em] mb-8 opacity-70">
                  동호수를 입력해주세요
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
              className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-6 text-xl uppercase tracking-wider hover:bg-[#1a2f5a] transition-colors flex items-center justify-center gap-2 border-2 border-[var(--brand-dark)]"
            >
              <Check className="w-6 h-6" />
              확인
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-base opacity-70">
          <p>예약하신 동호수를 입력하고 확인 버튼을 눌러주세</p>
        </div>
      </div>

      {/* FAB - Settings Button */}
      <button
        onClick={() => setShowFab(!showFab)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[var(--brand-dark)] text-[var(--brand-lime)] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#1a2f5a] transition-all hover:scale-110 border-2 border-[var(--brand-accent)] z-50"
      >
        <Settings className={`w-7 h-7 transition-transform ${showFab ? 'rotate-90' : ''}`} />
      </button>

      {/* FAB Menu */}
      {showFab && (
        <div className="fixed bottom-28 right-8 flex flex-col gap-3 z-40">
          <button
            onClick={handleKeyboardToggle}
            className="w-14 h-14 bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all group"
            title="화상 키보드"
          >
            <Keyboard className="w-6 h-6" />
          </button>
          <button
            onClick={handleRefresh}
            className="w-14 h-14 bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all group"
            title="새로고침"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
          <button
            onClick={handlePowerOff}
            className="w-14 h-14 bg-white border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all group"
            title="종료"
          >
            <Power className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
