'use client'
import Link from 'next/link'
import { Button } from '../src/app/components/Button';
import { mockEvents } from '../src/app/mockData';
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function HomePage() {
  const activeEvents = mockEvents.filter((e) => e.status === 'active');
  const sliderRef = useRef<Slider>(null);

  // Hero image slideshow
  const heroImages = [
    "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzc0NzgyNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0ODQ0NjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc3NDg0NDY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1758977404510-6ab7e07ff1fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYXBhcnRtZW50JTIwZGluaW5nJTIwcm9vbXxlbnwxfHx8fDE3NzQ4NDQ2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1652882861012-95f3263cab63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzc0ODQ0NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        setFadeState('fade-in');
      }, 1500); // Wait for fade-out to complete
    }, 5500); // Change image every 5.5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: activeEvents.length > 3,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* Header */}
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex justify-between items-center">
          <div className="text-xs uppercase tracking-[0.15em]">EDEN-Fair Link</div>
          <nav className="flex gap-4 sm:gap-8 text-xs uppercase tracking-[0.15em]">
            <Link href="/events" className="hover:text-[var(--brand-accent)] transition-colors">
              Events
            </Link>
            <Link href="/my-tickets" className="hover:text-[var(--brand-accent)] transition-colors whitespace-nowrap">
              My Reservation
            </Link>
            <Link href="/admin/login" className="hover:text-[var(--brand-accent)] transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
          {/* Hero Content */}
          <div className="flex flex-col justify-center py-16 sm:py-32 pr-0 lg:pr-16">
            <div className="flex justify-between mb-8 sm:mb-16 text-xs uppercase tracking-[0.15em]">
              <span className="break-words">Curated Move-in Experience</span>
              <span className="whitespace-nowrap">Est. 2018</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-8xl uppercase leading-[1.1] tracking-tight mb-6 sm:mb-8 break-words">
              It's Okay
              <br />
              <span className="text-[var(--brand-accent)] text-3xl sm:text-4xl inline-block my-2">✦</span>
              <br />
              To Expect More
            </h1>
            <p className="text-sm sm:text-base opacity-80 max-w-md mb-6 sm:mb-8 break-words">
              Elevate your transition into your new home. Discover premium furniture, appliances, and design services exclusively curated for your apartment community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events" className="w-full sm:w-auto">
                <Button variant="solid" size="lg" className="w-full sm:w-auto">
                  행사 찾기
                </Button>
              </Link>
              <Link href="/my-tickets" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  내 예약
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex items-end py-16 lg:py-32 pl-0 lg:pl-16">
            <div className="w-full h-[90%] bg-[var(--brand-lime)] rounded-t-[500px] overflow-hidden relative">
              <img
                src={heroImages[currentImageIndex]}
                alt="Elegant interior"
                className={`w-full h-full object-cover grayscale-[0.4] brightness-90 ${fadeState}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 text-xs uppercase tracking-[0.15em] gap-2">
            <span>Directory</span>
            <span>Select Your Complex</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-4">
            <h2 className="font-serif text-3xl sm:text-5xl break-words">Upcoming Fairs</h2>
            {activeEvents.length > 3 && (
              <div className="flex gap-2">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="w-12 h-12 border-2 border-[var(--brand-dark)] flex items-center justify-center hover:bg-[var(--brand-dark)] hover:text-[var(--brand-lime)] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="w-12 h-12 border-2 border-[var(--brand-dark)] flex items-center justify-center hover:bg-[var(--brand-dark)] hover:text-[var(--brand-lime)] transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          {activeEvents.length <= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
              {activeEvents.map((event) => {
                // Split title to extract apartment name
                const titleParts = event.title.split(' 입주박람회');
                const apartmentName = titleParts[0];

                return (
                  <article key={event.id} className="flex flex-col gap-6 sm:gap-8">
                    <div className="w-full aspect-[3/4] rounded-t-[500px] bg-[var(--brand-dark)] overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-90 grayscale-[0.3]"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl mb-3 break-words">{apartmentName}</h3>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm opacity-80 mb-4 gap-1 sm:gap-2">
                        <span className="break-words">{event.venue}</span>
                        <span className="whitespace-nowrap">{event.dates[0]}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/e/${event.slug}`} className="flex-1">
                          <Button variant="solid" size="md" className="w-full">
                            예약하기
                          </Button>
                        </Link>
                        <Link href={`/e/${event.slug}`} className="flex-1">
                          <Button variant="outline" size="md" className="w-full">
                            상세보기
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Slider ref={sliderRef} {...sliderSettings}>
              {activeEvents.map((event) => {
                // Split title to extract apartment name
                const titleParts = event.title.split(' 입주박람회');
                const apartmentName = titleParts[0];

                return (
                  <div key={event.id} className="px-4">
                    <article className="flex flex-col gap-6 sm:gap-8">
                      <div className="w-full aspect-[3/4] rounded-t-[500px] bg-[var(--brand-dark)] overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover opacity-90 grayscale-[0.3]"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl mb-3 break-words">{apartmentName}</h3>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm opacity-80 mb-4 gap-1 sm:gap-2">
                          <span className="break-words">{event.venue}</span>
                          <span className="whitespace-nowrap">{event.dates[0]}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/e/${event.slug}`} className="flex-1">
                            <Button variant="solid" size="md" className="w-full">
                              예약하기
                            </Button>
                          </Link>
                          <Link href={`/e/${event.slug}`} className="flex-1">
                            <Button variant="outline" size="md" className="w-full">
                              상세보기
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      </section>

      {/* The EDEN-FAIR LINK Standard */}
      <section className="bg-[var(--brand-dark)] text-[var(--brand-lime)] py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="font-serif text-2xl sm:text-4xl text-[var(--brand-accent)] mb-10 sm:mb-14 break-words">EDEN-FAIR LINK STANDARD</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="border-t border-[var(--brand-accent)]/30 pt-6 sm:pt-8">
              <span className="font-serif text-4xl sm:text-5xl text-[var(--brand-accent)] block mb-3 sm:mb-4">01</span>
              <h3 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 break-words">큐레이션된 선택</h3>
              <p className="opacity-90 text-sm leading-relaxed break-words">
                새로운 아파트의 평면도와 미학에 맞춤화된 프리미엄 업체를 엄선하여 제공합니다.
              </p>
            </div>
            <div className="border-t border-[var(--brand-accent)]/30 pt-6 sm:pt-8">
              <span className="font-serif text-4xl sm:text-5xl text-[var(--brand-accent)] block mb-3 sm:mb-4">02</span>
              <h3 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 break-words">정확한 측정</h3>
              <p className="opacity-90 text-sm leading-relaxed break-words">
                업체가 사전에 세대를 측정하여 입주 전에 모든 제품이 완벽하게 맞도록 보장합니다.
              </p>
            </div>
            <div className="border-t border-[var(--brand-accent)]/30 pt-6 sm:pt-8">
              <span className="font-serif text-4xl sm:text-5xl text-[var(--brand-accent)] block mb-3 sm:mb-4">03</span>
              <h3 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 break-words">그룹 할인</h3>
              <p className="opacity-90 text-sm leading-relaxed break-words">
                커뮤니티의 구매력을 활용하여 고급 가구에 대한 독점 그룹 가격을 제공합니다.
              </p>
            </div>
            <div className="border-t border-[var(--brand-accent)]/30 pt-6 sm:pt-8">
              <span className="font-serif text-4xl sm:text-5xl text-[var(--brand-accent)] block mb-3 sm:mb-4">04</span>
              <h3 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 break-words">A/S 보증</h3>
              <p className="opacity-90 text-sm leading-relaxed break-words">
                입주 후에도 참가 업체의 공식 A/S를 통해 제품 하자 및 설치 문제를 신속하게 해결해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--brand-dark)] py-16">
        <div className="max-w-7xl mx-auto px-8">
          {/* Kiosk Mode Access */}
          <div className="mb-12 text-center border-2 border-[var(--brand-dark)] p-6 sm:p-8 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <Monitor className="w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="font-serif text-2xl sm:text-3xl break-words">현장 키오스크 모드</h3>
            </div>
            <p className="text-sm opacity-70 mb-6 break-words">
              박람회 현장에서 동호수로 빠르게 체크인하실 수 있습니다
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {activeEvents.map((event) => {
                const apartmentName = event.title.split(' 입주박람회')[0];
                return (
                  <Link key={event.id} href={`/kiosk/${event.slug}`} className="w-full">
                    <Button variant="outline" size="md" className="w-full">
                      {apartmentName}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-xs uppercase tracking-[0.15em] text-center">
              © 2026 EDEN-Fair Link. Not a straight line.
            </p>
            <a href="/privacy-policy" className="text-xs uppercase tracking-[0.15em] opacity-60 hover:opacity-100 transition-opacity underline">
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
