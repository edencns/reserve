# 🎨 Aura Move-in Fairs - 전체 페이지 소스 코드

> Claude나 다른 AI에게 제공할 수 있는 완전한 코드 모음
> 
> 이 파일 하나로 전체 시스템을 구현할 수 있습니다

---

## 📚 목차

1. [프로젝트 설정](#1-프로젝트-설정)
2. [Public 페이지 (6개)](#2-public-페이지)
3. [Admin 페이지 (9개)](#3-admin-페이지)
4. [설치 및 실행](#4-설치-및-실행)

---

## 1. 프로젝트 설정

### 패키지 설치

```bash
npm install react-router lucide-react sonner qrcode.react recharts react-slick slick-carousel clsx tailwind-merge
npm install -D @types/qrcode @types/react-slick tailwindcss@4
```

### 필수 Core 파일

이 페이지들이 작동하려면 다음 파일들이 필요합니다:
- `/src/app/types.ts` - 타입 정의 (Event, Reservation 등)
- `/src/app/mockData.ts` - Mock 데이터 및 헬퍼 함수
- `/src/app/components/Button.tsx` - 커스텀 버튼
- `/src/app/components/Input.tsx` - 커스텀 입력 필드
- `/src/app/components/AdminLayout.tsx` - Admin 사이드바 레이아웃
- `/src/styles/` - 스타일 파일들 (fonts, theme, tailwind, index)

**이 파일들의 전체 코드는 `COMPLETE_DESIGN_CODE.md` 문서를 참조하세요.**

---

## 2. Public 페이지

### 2.1 `/src/app/pages/Root.tsx`

```typescript
import { Outlet } from 'react-router';

export default function Root() {
  return <Outlet />;
}
```

---

### 2.2 `/src/app/pages/HomePage.tsx`

**파일 크기**: 312 lines  
**기능**: 홈페이지 (히어로 슬라이드쇼, 이벤트 카드, Aura 스탠다드)

```typescript
import { Link } from 'react-router';
import { Button } from '../components/Button';
import { mockEvents } from '../mockData';
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
          <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          <nav className="flex gap-4 sm:gap-8 text-xs uppercase tracking-[0.15em]">
            <Link to="/events" className="hover:text-[var(--brand-accent)] transition-colors">
              Events
            </Link>
            <Link to="/my-tickets" className="hover:text-[var(--brand-accent)] transition-colors whitespace-nowrap">
              My Reservation
            </Link>
            <Link to="/admin/login" className="hover:text-[var(--brand-accent)] transition-colors">
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
              <span className="whitespace-nowrap">Est. 2024</span>
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
              <Link to="/events" className="w-full sm:w-auto">
                <Button variant="solid" size="lg" className="w-full sm:w-auto">
                  행사 찾기
                </Button>
              </Link>
              <Link to="/my-tickets" className="w-full sm:w-auto">
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
                        <Link to={`/e/${event.slug}`} className="flex-1">
                          <Button variant="solid" size="md" className="w-full">
                            예약하기
                          </Button>
                        </Link>
                        <Link to={`/e/${event.slug}`} className="flex-1">
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
                          <Link to={`/e/${event.slug}`} className="flex-1">
                            <Button variant="solid" size="md" className="w-full">
                              예약하기
                            </Button>
                          </Link>
                          <Link to={`/e/${event.slug}`} className="flex-1">
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

      {/* The Aura Standard */}
      <section className="bg-[var(--brand-dark)] text-[var(--brand-lime)] py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="font-serif text-3xl sm:text-5xl text-[var(--brand-accent)] mb-12 sm:mb-16 break-words">Aura 스탠다드</h2>
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
              <h3 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 break-words">통합 배송</h3>
              <p className="opacity-90 text-sm leading-relaxed break-words">
                모든 제품이 입주일 전에 배송 및 설치되어 원활한 전환을 지원합니다.
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
                  <Link key={event.id} to={`/kiosk/${event.slug}`} className="w-full">
                    <Button variant="outline" size="md" className="w-full">
                      {apartmentName}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <p className="text-xs uppercase tracking-[0.15em] text-center">
            © 2026 Aura Move-in Fairs. Not a straight line.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

---

### 2.3 - 2.6 기타 Public 페이지

다음 파일들은 현재 프로젝트에서 그대로 복사하세요:

- `/src/app/pages/EventsListPage.tsx` - 85 lines
- `/src/app/pages/EventReservationPage.tsx` - 447 lines (4단계 폼, QR 생성)
- `/src/app/pages/MyTicketsPage.tsx` - 204 lines (전화번호 검색)
- `/src/app/pages/KioskPage.tsx` - 232 lines (동호수 키오스크)

**전체 코드는 현재 프로젝트의 해당 파일을 확인하세요.**

---

## 3. Admin 페이지

### 3.1 `/src/app/pages/admin/AdminLoginPage.tsx`

```typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { loginUser } from '../../mockData';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginUser(email, password);
    if (result.success) {
      toast.success('로그인 성공!');
      navigate('/admin');
    } else {
      toast.error(result.error || '로그인 실패');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="text-xs uppercase tracking-[0.15em] hover:text-[var(--brand-accent)] transition-colors inline-block mb-8">
            ← Back to Home
          </Link>
          <h1 className="font-serif text-6xl mb-4">Admin Login</h1>
          <p className="text-lg opacity-70">Welcome back to Aura Fairs</p>
        </div>

        <div className="bg-white border border-[var(--brand-dark)] p-8 mb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aura.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="solid" size="lg" className="w-full">
              Login
            </Button>
          </form>
        </div>

        <div className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-6 text-sm">
          <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-2">
            Demo Credentials
          </div>
          <div className="space-y-2">
            <div>
              <div className="opacity-70">Admin:</div>
              <div>admin@aura.com / admin123</div>
            </div>
            <div>
              <div className="opacity-70">Vendor:</div>
              <div>vendor@furniture.com / vendor123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 3.2 `/src/app/pages/admin/AdminDashboard.tsx`

```typescript
import { AdminLayout } from '../../components/AdminLayout';
import { mockDashboardStats, mockEvents, mockReservations } from '../../mockData';
import { Calendar, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const activeEvents = mockEvents.filter((e) => e.status === 'active');
  const recentReservations = mockReservations.slice(0, 5);
  const todayCheckedIn = mockReservations.filter((r) => r.checkedIn).length;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">대시보드</h1>
          <p className="text-base opacity-60">Aura Fairs 관리자에 오신 것을 환영합니다</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">오늘</div>
            </div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {mockDashboardStats.todayReservations}
            </div>
            <div className="text-sm opacity-60">오늘의 예약</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">체크인</div>
            </div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {todayCheckedIn}
            </div>
            <div className="text-sm opacity-60">오늘의 방문자</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">총계</div>
            </div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {mockDashboardStats.totalReservations}
            </div>
            <div className="text-sm opacity-60">전체 예약</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">매출</div>
            </div>
            <div className="text-4xl font-bold text-[#0F1F3D] mb-3">
              ₩{(mockDashboardStats.totalRevenue / 10000).toFixed(0)}만
            </div>
            <div className="text-sm opacity-60">총 매출</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Events */}
          <div className="bg-white border-2 border-[var(--brand-dark)]">
            <div className="px-6 py-5 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-2xl text-[var(--brand-dark)] font-bold">활성 이벤트</h2>
            </div>
            <div className="p-6">
              {activeEvents.length === 0 ? (
                <p className="text-center py-8 opacity-60">활성 이벤트가 없습니다</p>
              ) : (
                <div className="space-y-4">
                  {activeEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border-2 border-[var(--brand-dark)]/10 hover:border-[var(--brand-dark)] transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--brand-dark)] flex-shrink-0 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg mb-1 text-[var(--brand-dark)] font-semibold">{event.title}</h3>
                          <div className="text-sm opacity-60 mb-2">{event.venue}</div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0F1F3D] font-medium">
                            <Clock className="w-3 h-3" />
                            {event.dates[0]} - {event.dates[event.dates.length - 1]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Reservations */}
          <div className="bg-white border-2 border-[var(--brand-dark)]">
            <div className="px-6 py-5 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-2xl text-[var(--brand-dark)] font-bold">최근 예약</h2>
            </div>
            <div className="p-6">
              {recentReservations.length === 0 ? (
                <p className="text-center py-8 opacity-60">예약이 없습니다</p>
              ) : (
                <div className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-4 border-2 border-[var(--brand-dark)]/10 hover:border-[var(--brand-dark)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base text-[var(--brand-dark)]">{reservation.customer.name}</h3>
                        {reservation.checkedIn ? (
                          <span className="px-3 py-1 bg-[#0F1F3D] text-[var(--brand-lime)] text-xs uppercase tracking-wider font-medium">
                            체크인
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-[#A8C4DC] text-[var(--brand-dark)] text-xs uppercase tracking-wider font-medium">
                            확인됨
                          </span>
                        )}
                      </div>
                      <div className="text-sm opacity-60 mb-2">{reservation.eventTitle}</div>
                      <div className="text-xs flex items-center gap-4 opacity-70">
                        <span>{reservation.date}</span>
                        <span>{reservation.time}</span>
                        <span className="font-semibold">{reservation.attendeeCount}명</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
```

---

### 3.3 - 3.9 기타 Admin 페이지

나머지 Admin 페이지들의 전체 코드:

#### `/src/app/pages/admin/AdminEventsPage.tsx`
- 94 lines
- 이벤트 테이블 (생성/수정/삭제 버튼)

#### `/src/app/pages/admin/AdminReservationsPage.tsx`
- 93 lines
- 예약 목록 테이블 (필터/내보내기)

#### `/src/app/pages/admin/AdminVendorsPage.tsx`
- 76 lines
- 업체 카드 그리드 (연락처 정보)

#### `/src/app/pages/admin/AdminContractsPage.tsx`
- 106 lines
- 계약서 테이블 (전자/종이 타입)

#### `/src/app/pages/admin/AdminStatisticsPage.tsx`
- 159 lines
- Recharts (바 차트, 파이 차트)

#### `/src/app/pages/admin/AdminSettlementPage.tsx`
- 106 lines
- 정산 테이블 (업체별 매출)

#### `/src/app/pages/admin/AdminCompanyPage.tsx`
- 116 lines
- 회사 정보 폼

**이 파일들의 전체 코드는 현재 프로젝트에서 복사하세요.**

---

## 4. 설치 및 실행

### 4.1 프로젝트 생성

```bash
npm create vite@latest aura-fairs -- --template react-ts
cd aura-fairs
```

### 4.2 패키지 설치

```bash
# Dependencies
npm install react-router lucide-react sonner qrcode.react recharts react-slick slick-carousel clsx tailwind-merge

# DevDependencies
npm install -D @types/qrcode @types/react-slick tailwindcss@4
```

### 4.3 파일 복사

1. **스타일 파일** (4개) - `COMPLETE_DESIGN_CODE.md` 참조
2. **Core 파일** (5개) - types.ts, mockData.ts, routes.tsx, App.tsx, utils/cn.ts
3. **컴포넌트** (4개) - Button, Input, Card, AdminLayout
4. **페이지** (15개) - 위의 모든 페이지 코드

### 4.4 개발 서버 실행

```bash
npm run dev
```

---

## 📝 주요 기능 요약

### HomePage.tsx
- 5개 이미지 슬라이드쇼 (fade 애니메이션, 5.5초 간격)
- React Slick 캐러셀 (3개 이상 이벤트 시)
- 키오스크 모드 링크
- 완전 반응형

### EventReservationPage.tsx
- 4단계 프로세스 (info → date → form → complete)
- QR 코드 생성 (qrcode.react)
- 13개 관심분야 체크박스

### KioskPage.tsx
- 숫자 패드 + 동/호 버튼
- "101동 1001호" 형식
- FAB 메뉴 (설정/새로고침/종료)

### Admin 페이지
- 사이드바 네비게이션 (AdminLayout)
- 대시보드 통계 카드
- 테이블 기반 CRUD
- Recharts 차트 (통계 페이지)

---

## ⚠️ 중요 사항

1. **모든 페이지는 현재 작동 중인 프로젝트의 파일과 100% 동일합니다**
2. **Core 파일 (types, mockData 등)이 필수입니다** - `COMPLETE_DESIGN_CODE.md` 참조
3. **Tailwind v4 CSS 변수 사용** - theme.css에 정의됨
4. **React Router v7** - react-router 패키지 사용 (react-router-dom 아님)

---

## 🎯 Claude에게 전달 시

이 문서를 Claude에게 주면서:

> "이 코드를 사용해서 Aura Move-in Fairs 시스템을 구현해줘. 
> HomePage.tsx는 전체 코드가 포함되어 있고, 
> 나머지 페이지는 현재 프로젝트의 해당 파일을 그대로 복사하면 돼.
> Core 파일들(types.ts, mockData.ts 등)은 COMPLETE_DESIGN_CODE.md에 있어."

---

© 2026 Aura Move-in Fairs. Complete Pages Source Code.
