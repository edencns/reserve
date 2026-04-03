'use client'
import Link from 'next/link'
import { Button } from '../src/app/components/Button';
import { mockEvents } from '../src/app/mockData';
import { Monitor, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function HomePage() {
  const activeEvents = mockEvents.filter((e) => e.status === 'active');

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = 280;
  const gap = 24;

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeEvents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= activeEvents.length - 1 ? 0 : prev + 1));
  };

  const translateX = -(currentIndex * (cardWidth + gap));

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* Header */}
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex justify-between items-center">
          <div className="text-xs uppercase tracking-[0.15em]">EDEN-Fair Link</div>
          <nav className="flex gap-4 sm:gap-8 text-xs uppercase tracking-[0.15em]">
            <Link href="/events" className="hover:text-[var(--brand-accent)] transition-colors">
              이벤트
            </Link>
            <Link href="/my-tickets" className="hover:text-[var(--brand-accent)] transition-colors whitespace-nowrap">
              내 예약
            </Link>
            <Link href="/admin/login" className="hover:text-[var(--brand-accent)] transition-colors">
              관리자
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-6 sm:pb-10">
          <div className="text-center mb-7 sm:mb-9">
            <h1 className="font-serif uppercase leading-[1.1] tracking-tight mb-5 sm:mb-7 text-[clamp(40px,8vw,72px)]">
              입주박람회 <span className="text-[var(--brand-accent)]">예약 시스템</span>
            </h1>
            <p className="opacity-80 max-w-2xl mx-auto mb-7 sm:mb-10 text-base sm:text-lg">
              프리미엄 가구, 가전, 디자인 서비스를<br />
              한 곳에서 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button variant="solid" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  이벤트 보기
                </Button>
              </Link>
              <Link href="/my-tickets">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  내 예약 확인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">진행 중인 박람회</h2>
            <p className="text-base opacity-70">{activeEvents.length}개의 이벤트</p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                ref={carouselRef}
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${translateX}px)` }}
              >
                {[...activeEvents, ...activeEvents, ...activeEvents].map((event, index) => {
                  const apartmentName = event.title.split(' 입주박람회')[0];
                  return (
                    <Link
                      key={`${event.id}-${index}`}
                      href={`/e/${event.slug}`}
                      className="group flex-shrink-0 w-[280px]"
                    >
                      <article className="flex flex-col gap-3">
                        <div className="w-full aspect-[10/13] rounded-t-[200px] bg-[var(--brand-dark)] overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover opacity-90 grayscale-[0.3] group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                          />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl mb-2">{apartmentName}</h3>
                          <div className="flex flex-col gap-1 text-xs opacity-80 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>{event.dates[0]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          <Button variant="solid" size="md" className="w-full">
                            예약하기
                          </Button>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute top-[40%] -translate-y-1/2 -left-6 sm:-left-14 bg-[var(--brand-dark)] hover:bg-[var(--brand-accent)] text-white p-3 rounded-full transition-colors shadow-lg z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-[40%] -translate-y-1/2 -right-6 sm:-right-14 bg-[var(--brand-dark)] hover:bg-[var(--brand-accent)] text-white p-3 rounded-full transition-colors shadow-lg z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--brand-dark)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Kiosk Mode Access */}
          <div className="mb-12 text-center border-2 border-[var(--brand-dark)] p-8 bg-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Monitor className="w-8 h-8" />
              <h3 className="font-serif text-3xl">현장 키오스크</h3>
            </div>
            <p className="text-sm opacity-70 mb-6">
              박람회 현장에서 동호수로 빠르게 체크인
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {activeEvents.map((event) => {
                const apartmentName = event.title.split(' 입주박람회')[0];
                return (
                  <Link key={event.id} href={`/kiosk/${event.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      {apartmentName}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.15em] text-center">
            © 2026 EDEN-Fair Link
          </p>
        </div>
      </footer>
    </div>
  );
}
