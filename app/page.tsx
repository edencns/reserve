'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../src/app/components/Button';
import { mockEvents } from '../src/app/mockData';
import { useState } from 'react';

const KIOSK_PASSWORD = 'aaaa4799!';

export default function HomePage() {
  const router = useRouter();
  const [modal, setModal] = useState<{ slug: string; name: string } | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const nextYear = currentYear + 1;

  const sortByDate = (events: typeof mockEvents) =>
    [...events].sort((a, b) => a.dates[0].localeCompare(b.dates[0]));

  const getYear = (event: typeof mockEvents[0]) =>
    parseInt(event.dates[0].slice(0, 4), 10);

  const lastYearEvents  = sortByDate(mockEvents.filter((e) => getYear(e) === lastYear));
  const thisYearEvents  = sortByDate(mockEvents.filter((e) => getYear(e) === currentYear));
  const nextYearEvents  = sortByDate(mockEvents.filter((e) => getYear(e) === nextYear));

  const formatDate = (dateStr: string) => {
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m)}월 ${parseInt(d)}일`;
  };

  const openModal = (slug: string, name: string) => {
    setModal({ slug, name });
    setInput('');
    setError(false);
  };

  const closeModal = () => {
    setModal(null);
    setInput('');
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === KIOSK_PASSWORD) {
      router.push(`/kiosk/${modal!.slug}`);
    } else {
      setError(true);
      setInput('');
    }
  };

  const EventColumn = ({ year, events }: { year: number; events: typeof mockEvents }) => (
    <div className="flex flex-col">
      <div className="mb-6 pb-4 border-b border-[#0f1f3d]">
        <span className="text-sm font-semibold tracking-[0.2em] uppercase opacity-70">{year}</span>
      </div>
      {events.length === 0 ? (
        <p className="text-xs opacity-30">행사 없음</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {events.map((event) => {
            const name = event.title.split(' 입주박람회')[0];
            return (
              <li key={event.id}>
                <button
                  onClick={() => openModal(event.slug, name)}
                  className="group block text-left"
                >
                  <p
                    className="font-serif group-hover:text-[var(--brand-accent)] transition-colors"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {name}
                  </p>
                  <p className="text-xs opacity-50 mt-0.5">
                    {formatDate(event.dates[0])}
                    {event.dates.length > 1 && ` – ${formatDate(event.dates[event.dates.length - 1])}`}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] text-[var(--brand-dark)]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 sm:px-20 py-5 border-b border-[#0f1f3d]">
        <span className="text-sm font-semibold tracking-[0.15em] uppercase">EDEN-FAIR LINK</span>
        <nav className="flex gap-8 text-xs"></nav>
      </header>

      {/* ── Hero ── */}
      <section
        className="text-center px-6 sm:px-10 border-b border-[#0f1f3d]"
        style={{ paddingTop: '88px', paddingBottom: '88px' }}
      >
        <h1
          className="font-serif leading-[1.05] mb-10"
          style={{ fontSize: 'clamp(32px, 4.7vw, 72px)', letterSpacing: '-1.8px' }}
        >
          입주박람회{' '}
          <span className="text-[var(--brand-accent)]">예약 시스템</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button variant="solid" size="lg" className="w-full sm:w-[200px]">이벤트 보기</Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" size="lg" className="w-full sm:w-[200px]">관리자 페이지</Button>
          </Link>
        </div>
      </section>

      {/* ── Event List ── */}
      <section
        className="px-8 sm:px-20"
        style={{ paddingTop: '80px', paddingBottom: '80px' }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-12">
          <EventColumn year={lastYear}    events={lastYearEvents} />
          <EventColumn year={currentYear} events={thisYearEvents} />
          <EventColumn year={nextYear}    events={nextYearEvents} />
        </div>
      </section>

      {/* ── Password Modal ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(15, 31, 61, 0.55)' }}
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-sm flex flex-col"
            style={{ padding: '48px 44px 40px', boxShadow: '0 8px 40px rgba(15,31,61,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-10">
              <h3 className="font-serif mb-1.5" style={{ fontSize: '24px' }}>{modal.name}</h3>
              <p className="text-xs tracking-widest uppercase opacity-40">현장 키오스크</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="px-2">
                <input
                  type="password"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  placeholder="비밀번호 입력"
                  autoFocus
                  className="w-full bg-transparent py-3 text-sm text-center outline-none placeholder:opacity-30"
                  style={{ borderBottom: '1px solid #0f1f3d' }}
                />
                {error && (
                  <p className="text-xs mt-3 text-center" style={{ color: '#d4183d' }}>비밀번호가 올바르지 않습니다.</p>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  style={{ flex: 1, backgroundColor: '#0f1f3d', color: '#fff', padding: '12px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ flex: 1, border: '1px solid #0f1f3d', background: 'transparent', padding: '12px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
