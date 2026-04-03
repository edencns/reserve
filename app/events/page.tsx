'use client'
import Link from 'next/link'
import { mockEvents } from '../../src/app/mockData';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';

type Tab = 'upcoming' | 'ended';

export default function EventsListPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const today = new Date().toISOString().slice(0, 10);

  const allEvents = mockEvents.filter((e) => e.status === 'active' || e.status === 'confirmed' || e.status === 'completed');

  const upcomingEvents = allEvents.filter((e) => e.dates[e.dates.length - 1] >= today);
  const endedEvents    = allEvents.filter((e) => e.dates[e.dates.length - 1] < today);

  const displayed = tab === 'upcoming' ? upcomingEvents : endedEvents;

  return (
    <div className="min-h-screen bg-[#e8eef4] text-[#0f1f3d]">

      {/* ── Header ── */}
      <header
        className="flex items-center justify-between border-b border-[#0f1f3d]"
        style={{ height: '81px', paddingLeft: '160px', paddingRight: '160px' }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          style={{ fontSize: '12px', letterSpacing: '1.8px', textTransform: 'uppercase' }}
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로
        </Link>
        <div className="flex items-center gap-8">
          <span style={{ fontSize: '12px', letterSpacing: '1.8px', textTransform: 'uppercase' }}>
            EDEN-FAIR LINK
          </span>
          <Link
            href="/admin/login"
            className="hover:opacity-60 transition-opacity"
            style={{ fontSize: '12px', letterSpacing: '1.8px', textTransform: 'uppercase' }}
          >
            관리자 페이지
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="flex flex-col items-center justify-center text-center border-b border-[#0f1f3d]"
        style={{ paddingTop: '40px', paddingBottom: '40px', gap: '16px' }}
      >
        <h1 className="font-serif font-medium" style={{ fontSize: '72px', lineHeight: '72px' }}>
          모든 이벤트
        </h1>
        <p style={{ fontSize: '18px', lineHeight: '28px', opacity: 0.7 }}>
          {upcomingEvents.length}개의 박람회가 예약을 기다립니다
        </p>
      </section>

      {/* ── Tabs ── */}
      <div
        className="flex border-b border-[#0f1f3d]"
        style={{ paddingLeft: '160px' }}
      >
        {(['upcoming', 'ended'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '16px 32px',
              fontSize: '13px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              borderBottom: tab === t ? '2px solid #0f1f3d' : '2px solid transparent',
              fontWeight: tab === t ? 600 : 400,
              opacity: tab === t ? 1 : 0.45,
              marginBottom: '-1px',
            }}
          >
            {t === 'upcoming' ? '진행 예정' : '종료'}
          </button>
        ))}
      </div>

      {/* ── Cards Grid ── */}
      <section style={{ paddingTop: '64px', paddingBottom: '120px', paddingLeft: '160px', paddingRight: '160px' }}>
        {displayed.length === 0 ? (
          <p className="text-center opacity-40" style={{ fontSize: '14px', paddingTop: '60px' }}>
            {tab === 'ended' ? '종료된 행사가 없습니다.' : '예정된 행사가 없습니다.'}
          </p>
        ) : (
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '40px' }}
          >
            {displayed.map((event) => {
              const name = event.title.split(' 입주박람회')[0];
              return (
                <article key={event.id} className="flex flex-col items-center text-center">
                  {/* Circle image */}
                  <Link href={`/e/${event.slug}`} className="mb-4">
                    <div
                      className="overflow-hidden bg-[#0f1f3d] rounded-full hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ width: '200px', height: '200px', flexShrink: 0 }}
                    >
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        style={{ opacity: tab === 'ended' ? 0.5 : 0.9 }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <h3
                    className="font-serif font-medium"
                    style={{ fontSize: '18px', lineHeight: '28px', marginBottom: '8px' }}
                  >
                    {name}
                  </h3>

                  <div className="flex items-center justify-center gap-1.5 mb-1" style={{ opacity: 0.6 }}>
                    <Calendar style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px' }}>
                      {event.dates[0]}{event.dates.length > 1 ? ` ~ ${event.dates[event.dates.length - 1]}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mb-4" style={{ opacity: 0.6 }}>
                    <MapPin style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px' }}>{event.venue}</span>
                  </div>

                  {tab === 'upcoming' && (
                    <Link href={`/e/${event.slug}`} className="w-full">
                      <button
                        className="w-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{
                          height: '44px',
                          backgroundColor: '#0f1f3d',
                          color: '#e8eef4',
                          fontSize: '12px',
                          letterSpacing: '0.7px',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                        }}
                      >
                        예약하기
                      </button>
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t border-[#0f1f3d] text-center"
        style={{ paddingTop: '65px', paddingBottom: '65px' }}
      >
        <p style={{ fontSize: '12px', letterSpacing: '1.8px', textTransform: 'uppercase' }}>
          © 2026 EDEN-Fair Link
        </p>
      </footer>

    </div>
  );
}
