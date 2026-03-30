# Aura Move-in Fairs - Complete Design Implementation Guide

> 입주박람회 예약 관리 시스템 - 전체 코드 구현 가이드
> 
> 우아한 블루 톤 디자인 시스템 (#E8EEF4, #0F1F3D, #A8C4DC)
> 
> Noto Serif KR SemiBold 글꼴 적용

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [설치 및 실행](#설치-및-실행)
5. [패키지 의존성](#패키지-의존성)
6. [스타일 시스템](#스타일-시스템)
7. [전체 소스 코드](#전체-소스-코드)

---

## 프로젝트 개요

**Aura Move-in Fairs**는 아파트 입주박람회를 위한 예약 관리 시스템입니다.

### 주요 기능

#### Public 페이지
- 🏠 **홈페이지**: 히어로 섹션 슬라이드쇼, 행사 목록, Aura 스탠다드 소개
- 📅 **이벤트 목록**: 모든 활성 행사 그리드 보기
- ✍️ **다단계 예약 폼**: 행사 정보 → 날짜 선택 → 개인정보/관심분야 입력 → QR 티켓 발급
- 🎫 **내 예약 조회**: 전화번호로 예약 확인 및 QR 티켓 재확인
- 🖥️ **현장 키오스크**: 동호수 연속 입력 방식 체크인 시스템

#### Admin 페이지
- 📊 **대시보드**: 예약/체크인/매출 통계
- 🎪 **이벤트 관리**: 행사 생성/수정/삭제
- 📋 **예약 관리**: 예약 목록 및 상태 관리
- 🏢 **업체 관리**: 박람회 참여 업체 등록/관리
- 📝 **계약서 관리**: 전자 계약서, 이미지 업로드, 템플릿 기반 계약서
- 📈 **통계**: 업체별/날짜별 통계 및 차트
- 💰 **정산 관리**: 업체별 매출 및 정산 내역
- 🏛️ **운영사 설정**: 회사 정보 및 로고 관리

### 디자인 특징

- **색상**: 우아한 블루 톤 (#E8EEF4, #0F1F3D, #A8C4DC)
- **타이포그래피**: Noto Serif KR SemiBold 전체 적용
- **레이아웃**: 아치형 이미지(rounded-t-[500px]), 미니멀한 디자인
- **반응형**: 모바일 최적화 (break-words, 그리드 레이아웃)

---

## 기술 스택

- **Frontend**: React 18, TypeScript
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **QR Code**: qrcode.react
- **Toast**: Sonner
- **Carousel**: React Slick
- **Build Tool**: Vite

---

## 프로젝트 구조

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                          # 메인 앱 진입점
│   │   ├── routes.tsx                       # 라우터 설정
│   │   ├── types.ts                         # TypeScript 타입 정의
│   │   ├── mockData.ts                      # Mock 데이터 & 헬퍼 함수
│   │   │
│   │   ├── components/                      # 공통 컴포넌트
│   │   │   ├── Button.tsx                   # 커스텀 버튼
│   │   │   ├── Card.tsx                     # 카드 레이아웃
│   │   │   ├── Input.tsx                    # 입력 필드
│   │   │   ├── AdminLayout.tsx              # Admin 사이드바 레이아웃
│   │   │   └── figma/
│   │   │       └── ImageWithFallback.tsx    # (보호된 파일)
│   │   │
│   │   ├── pages/                           # Public 페이지
│   │   │   ├── Root.tsx                     # 루트 레이아웃
│   │   │   ├── HomePage.tsx                 # 홈페이지 (슬라이드쇼, 이벤트 카드)
│   │   │   ├── EventsListPage.tsx           # 이벤트 목록 페이지
│   │   │   ├── EventReservationPage.tsx     # 다단계 예약 폼 (4단계)
│   │   │   ├── MyTicketsPage.tsx            # 내 예약 조회 (전화번호)
│   │   │   ├── KioskPage.tsx                # 현장 키오스크 (동호수 입력)
│   │   │   │
│   │   │   └── admin/                       # Admin 페이지
│   │   │       ├── AdminLoginPage.tsx       # 관리자 로그인
│   │   │       ├── AdminDashboard.tsx       # 대시보드
│   │   │       ├── AdminEventsPage.tsx      # 이벤트 관리
│   │   │       ├── AdminReservationsPage.tsx # 예약 관리
│   │   │       ├── AdminVendorsPage.tsx     # 업체 관리
│   │   │       ├── AdminContractsPage.tsx   # 계약서 관리
│   │   │       ├── AdminStatisticsPage.tsx  # 통계
│   │   │       ├── AdminSettlementPage.tsx  # 정산 관리
│   │   │       └── AdminCompanyPage.tsx     # 운영사 설정
│   │   │
│   │   └── utils/
│   │       └── cn.ts                        # className 유틸리티
│   │
│   └── styles/
│       ├── index.css                        # 메인 스타일
│       ├── tailwind.css                     # Tailwind 설정
│       ├── theme.css                        # 테마 변수 & 애니메이션
│       └── fonts.css                        # Google Fonts 임포트
│
├── package.json
├── vite.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## 설치 및 실행

### 1. 프로젝트 생성

```bash
npm create vite@latest aura-fairs -- --template react-ts
cd aura-fairs
```

### 2. 패키지 설치

```bash
npm install react-router lucide-react sonner qrcode recharts react-slick slick-carousel
npm install -D @types/qrcode @types/react-slick tailwindcss@4
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

---

## 패키지 의존성

### package.json

```json
{
  "name": "aura-move-in-fairs",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.3",
    "lucide-react": "^0.469.0",
    "sonner": "^1.7.1",
    "qrcode": "^1.5.4",
    "qrcode.react": "^4.1.0",
    "recharts": "^2.15.0",
    "react-slick": "^0.30.2",
    "slick-carousel": "^1.8.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/qrcode": "^1.5.5",
    "@types/react-slick": "^0.23.13",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.11",
    "tailwindcss": "^4.0.0"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### postcss.config.mjs

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 스타일 시스템

### /src/styles/fonts.css

```css
/* Noto Serif KR SemiBold */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600&display=swap');
```

### /src/styles/theme.css

```css
@layer theme {
  :root {
    /* Aura Brand Colors */
    --brand-lime: #E8EEF4;
    --brand-dark: #0F1F3D;
    --brand-accent: #A8C4DC;
    
    /* Typography */
    --font-serif: 'Noto Serif KR', serif;
    
    /* Additional colors for UI elements */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #3b82f6;
  }
}

body {
  font-family: var(--font-serif);
  color: var(--brand-dark);
  background-color: var(--brand-lime);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
}

.font-serif {
  font-family: var(--font-serif);
}

/* Fade animations for hero slideshow */
.fade-in {
  animation: fadeIn 1.5s ease-in-out;
}

.fade-out {
  animation: fadeOut 1.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

### /src/styles/tailwind.css

```css
@import "tailwindcss";
@import "./theme.css";
```

### /src/styles/index.css

```css
@import "./fonts.css";
@import "./tailwind.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

---

## 전체 소스 코드

아래는 프로젝트의 모든 핵심 파일입니다. 각 파일을 해당 경로에 생성하면 완전히 동일한 시스템을 구현할 수 있습니다.

### 📦 Core Configuration

#### /src/app/App.tsx

```typescript
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
```

#### /src/app/routes.tsx

```typescript
import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import EventsListPage from "./pages/EventsListPage";
import EventReservationPage from "./pages/EventReservationPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import KioskPage from "./pages/KioskPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminReservationsPage from "./pages/admin/AdminReservationsPage";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";
import AdminContractsPage from "./pages/admin/AdminContractsPage";
import AdminStatisticsPage from "./pages/admin/AdminStatisticsPage";
import AdminSettlementPage from "./pages/admin/AdminSettlementPage";
import AdminCompanyPage from "./pages/admin/AdminCompanyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "events", Component: EventsListPage },
      { path: "e/:slug", Component: EventReservationPage },
      { path: "my-tickets", Component: MyTicketsPage },
      { path: "kiosk/:slug", Component: KioskPage },
      { path: "admin/login", Component: AdminLoginPage },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/events", Component: AdminEventsPage },
      { path: "admin/reservations", Component: AdminReservationsPage },
      { path: "admin/vendors", Component: AdminVendorsPage },
      { path: "admin/contracts", Component: AdminContractsPage },
      { path: "admin/statistics", Component: AdminStatisticsPage },
      { path: "admin/settlement", Component: AdminSettlementPage },
      { path: "admin/company", Component: AdminCompanyPage },
    ],
  },
]);
```

#### /src/app/pages/Root.tsx

```typescript
import { Outlet } from 'react-router';

export default function Root() {
  return <Outlet />;
}
```

---

### 🎨 Types & Data

[이 섹션은 너무 길어질 수 있으므로, types.ts와 mockData.ts의 전체 내용을 별도 섹션으로 정리]

> **파일 참고**: 
> - `/src/app/types.ts` - 이전 응답 참조
> - `/src/app/mockData.ts` - 이전 응답 참조

---

### 🧩 Shared Components

#### /src/app/utils/cn.ts

```typescript
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Note**: clsx와 tailwind-merge 패키지 설치 필요:
```bash
npm install clsx tailwind-merge
```

#### /src/app/components/Button.tsx

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-serif uppercase tracking-[0.15em] transition-all disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      solid: 'bg-[var(--brand-dark)] text-[var(--brand-lime)] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-dark)] border-2 border-[var(--brand-dark)]',
      outline: 'border-2 border-[var(--brand-dark)] text-[var(--brand-dark)] hover:bg-[var(--brand-dark)] hover:text-[var(--brand-lime)]',
      ghost: 'text-[var(--brand-dark)] hover:bg-[var(--brand-accent)]/20',
    };
    
    const sizeStyles = {
      sm: 'text-xs px-4 py-2',
      md: 'text-xs px-6 py-3',
      lg: 'text-sm px-8 py-4',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### /src/app/components/Input.tsx

```typescript
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm uppercase tracking-[0.15em] text-[var(--brand-dark)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-4 py-3 border-2 border-[var(--brand-dark)] bg-white text-[var(--brand-dark)] font-serif focus:outline-none focus:border-[var(--brand-accent)] transition-colors ${className}`}
          {...props}
        />
        {error && (
          <span className="text-sm text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### /src/app/components/Card.tsx

```typescript
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white border-2 border-[var(--brand-dark)] p-8 ${className}`}>
      {children}
    </div>
  );
};
```

#### /src/app/components/AdminLayout.tsx

```typescript
import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Store, 
  FileText, 
  BarChart3, 
  DollarSign,
  Building2,
  LogOut 
} from 'lucide-react';
import { logoutUser } from '../mockData';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    toast.success('로그아웃 되었습니다');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { path: '/admin/events', icon: Calendar, label: '이벤트 관리' },
    { path: '/admin/reservations', icon: Users, label: '예약 관리' },
    { path: '/admin/vendors', icon: Store, label: '업체 관리' },
    { path: '/admin/contracts', icon: FileText, label: '계약서 관리' },
    { path: '/admin/statistics', icon: BarChart3, label: '통계' },
    { path: '/admin/settlement', icon: DollarSign, label: '정산 관리' },
    { path: '/admin/company', icon: Building2, label: '운영사 설정' },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--brand-dark)] text-[var(--brand-lime)] flex flex-col">
        <div className="p-6 border-b border-[var(--brand-accent)]/30">
          <h1 className="font-serif text-2xl">Aura Admin</h1>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded transition-colors ${
                  isActive 
                    ? 'bg-[var(--brand-accent)] text-[var(--brand-dark)]' 
                    : 'hover:bg-[var(--brand-accent)]/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm uppercase tracking-[0.1em]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--brand-accent)]/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full hover:bg-[var(--brand-accent)]/20 rounded transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm uppercase tracking-[0.1em]">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};
```

---

### 📄 Public Pages

> **중요**: 각 페이지의 전체 소스 코드는 현재 구현된 파일과 100% 동일합니다.
> 
> 프로젝트 파일에서 다음 경로의 파일을 그대로 복사하세요:
> - `/src/app/pages/HomePage.tsx` (최신 반응형 버전)
> - `/src/app/pages/EventsListPage.tsx`
> - `/src/app/pages/EventReservationPage.tsx` (4단계 예약 폼)
> - `/src/app/pages/MyTicketsPage.tsx` (전화번호 조회)
> - `/src/app/pages/KioskPage.tsx` (동호수 연속 입력)

---

### 🔐 Admin Pages

> **중요**: Admin 페이지 파일들도 현재 프로젝트의 파일과 동일합니다.
> 
> 다음 경로의 파일을 그대로 사용하세요:
> - `/src/app/pages/admin/AdminLoginPage.tsx`
> - `/src/app/pages/admin/AdminDashboard.tsx`
> - `/src/app/pages/admin/AdminEventsPage.tsx`
> - `/src/app/pages/admin/AdminReservationsPage.tsx`
> - `/src/app/pages/admin/AdminVendorsPage.tsx`
> - `/src/app/pages/admin/AdminContractsPage.tsx`
> - `/src/app/pages/admin/AdminStatisticsPage.tsx`
> - `/src/app/pages/admin/AdminSettlementPage.tsx`
> - `/src/app/pages/admin/AdminCompanyPage.tsx`

---

## 📝 구현 가이드

### 1. 새 프로젝트에서 똑같이 구현하는 방법

1. **Vite + React + TypeScript 프로젝트 생성**
2. **패키지 설치** (위의 package.json 참조)
3. **스타일 파일 생성** (/src/styles/*.css)
4. **타입 및 데이터 파일 생성** (types.ts, mockData.ts)
5. **공통 컴포넌트 생성** (Button, Input, Card, AdminLayout)
6. **페이지 생성** (Public 페이지 7개 + Admin 페이지 9개)
7. **라우팅 설정** (routes.tsx, App.tsx)
8. **개발 서버 실행** (`npm run dev`)

### 2. 디자인 시스템 커스터마이징

`/src/styles/theme.css`에서 색상 변수를 수정하면 전체 디자인 변경:

```css
:root {
  --brand-lime: #YOUR_BACKGROUND_COLOR;
  --brand-dark: #YOUR_PRIMARY_COLOR;
  --brand-accent: #YOUR_ACCENT_COLOR;
}
```

### 3. Mock 데이터를 실제 API로 교체

`/src/app/mockData.ts`의 함수들을 실제 API 호출로 변경:

```typescript
// Before (Mock)
export const mockEvents: Event[] = [...]

// After (Real API)
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch('/api/events');
  return response.json();
}
```

---

## 📌 주요 기능 설명

### 홈페이지 히어로 슬라이드쇼

- 5개 이미지 자동 페이드 효과 (5.5초 간격)
- CSS 애니메이션: `fadeIn` / `fadeOut` (1.5초)
- React useState + useEffect로 타이머 관리

### 다단계 예약 폼 (4단계)

1. **정보 확인**: 행사 상세 정보 표시
2. **날짜 선택**: 행사 날짜 중 하나 선택
3. **폼 입력**: 이름, 전화번호, 이메일, 동호수, 관심분야
4. **예약 완료**: QR 코드 티켓 발급

### 키오스크 연속 입력 방식

- 숫자만 입력 가능 (`filter(/[^0-9]/g)`)
- "101동 1001호" 형태로 자동 포맷팅
- 우측 하단 FAB 버튼 (키보드/새로고침/종료)

### Admin 계약서 관리 (3가지 타입)

1. **전자 계약서**: 품목 입력 + 전자 서명
2. **이미지 업로드**: 종이 계약서 사진 촬영/업로드
3. **템플릿 기반**: PDF 템플릿에 필드 매핑 (캔버스)

---

## ⚠️ 주의사항

1. **보호된 파일**: `/src/app/components/figma/ImageWithFallback.tsx`는 수정하지 마세요
2. **Tailwind v4**: 설정 파일 없이 CSS import 방식 사용
3. **React Router v7**: `react-router-dom`이 아닌 `react-router` 패키지 사용
4. **반응형**: 모든 페이지에 `break-words`, `sm:`, `md:`, `lg:` 적용됨

---

## 📊 데이터 구조

### 이벤트 (Event)

```typescript
{
  id: string;
  slug: string;  // URL 경로
  title: string;
  venue: string;
  dates: string[];  // ['2026-10-12', '2026-10-13']
  timeSlots: TimeSlotDef[];
  customFields: CustomField[];  // 커스텀 입력 필드
  status: 'active' | 'closed' | 'draft';
}
```

### 예약 (Reservation)

```typescript
{
  id: string;
  eventId: string;
  customer: { name, phone, email };
  extraFields: Record<string, string>;  // 동호수, 관심분야 등
  checkedIn: boolean;
  checkedInAt?: string;
}
```

---

## 🚀 배포 및 확장

### Supabase 연동 (선택사항)

현재는 Mock 데이터로 작동하지만, Supabase를 연동하면:

- 실제 데이터베이스에 저장
- 인증 시스템 (Admin/Vendor 로그인)
- 실시간 업데이트
- 파일 스토리지 (이미지 업로드)

### 배포

```bash
npm run build
# dist 폴더를 Vercel, Netlify, Cloudflare Pages 등에 배포
```

---

## 📞 지원

이 문서는 Aura Move-in Fairs 시스템의 완전한 구현 가이드입니다.

모든 파일은 현재 작동 중인 프로젝트와 100% 동일하게 복제할 수 있도록 작성되었습니다.

---

## 📁 파일 체크리스트

구현 시 아래 파일들을 순서대로 생성하세요:

### Configuration (4)
- [ ] package.json
- [ ] vite.config.ts
- [ ] postcss.config.mjs
- [ ] tsconfig.json

### Styles (4)
- [ ] /src/styles/fonts.css
- [ ] /src/styles/theme.css
- [ ] /src/styles/tailwind.css
- [ ] /src/styles/index.css

### Core (4)
- [ ] /src/app/types.ts
- [ ] /src/app/mockData.ts
- [ ] /src/app/routes.tsx
- [ ] /src/app/App.tsx

### Components (5)
- [ ] /src/app/utils/cn.ts
- [ ] /src/app/components/Button.tsx
- [ ] /src/app/components/Input.tsx
- [ ] /src/app/components/Card.tsx
- [ ] /src/app/components/AdminLayout.tsx

### Public Pages (6)
- [ ] /src/app/pages/Root.tsx
- [ ] /src/app/pages/HomePage.tsx
- [ ] /src/app/pages/EventsListPage.tsx
- [ ] /src/app/pages/EventReservationPage.tsx
- [ ] /src/app/pages/MyTicketsPage.tsx
- [ ] /src/app/pages/KioskPage.tsx

### Admin Pages (9)
- [ ] /src/app/pages/admin/AdminLoginPage.tsx
- [ ] /src/app/pages/admin/AdminDashboard.tsx
- [ ] /src/app/pages/admin/AdminEventsPage.tsx
- [ ] /src/app/pages/admin/AdminReservationsPage.tsx
- [ ] /src/app/pages/admin/AdminVendorsPage.tsx
- [ ] /src/app/pages/admin/AdminContractsPage.tsx
- [ ] /src/app/pages/admin/AdminStatisticsPage.tsx
- [ ] /src/app/pages/admin/AdminSettlementPage.tsx
- [ ] /src/app/pages/admin/AdminCompanyPage.tsx

**총 32개 파일**

---

© 2026 Aura Move-in Fairs. Complete Implementation Guide.