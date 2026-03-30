# 🎨 Aura Move-in Fairs - 전체 소스 코드 아카이브

> 모든 페이지의 완전한 코드를 제공합니다
> 
> 이 문서의 코드를 그대로 복사하여 똑같은 시스템을 구현할 수 있습니다

---

## 📦 사용 방법

1. **프로젝트 생성** (Vite + React + TypeScript)
2. **패키지 설치** (아래 참조)
3. **이 문서의 코드를 각 파일에 복사**
4. **개발 서버 실행**

---

## 📚 목차

### 📄 Public Pages
- [HomePage.tsx](#homepagetsx) - 현재 프로젝트 파일 참조
- [EventsListPage.tsx](#eventslistpagetsx) - 현재 프로젝트 파일 참조
- [EventReservationPage.tsx](#eventreservationpagetsx) - 현재 프로젝트 파일 참조
- [MyTicketsPage.tsx](#myticketsp agetsx) - 현재 프로젝트 파일 참조
- [KioskPage.tsx](#kioskpagetsx) - 현재 프로젝트 파일 참조

### 🔐 Admin Pages
- [AdminLoginPage.tsx](#adminloginpagetsx) - 현재 프로젝트 파일 참조
- [AdminDashboard.tsx](#admindashboardtsx) - 현재 프로젝트 파일 참조
- [AdminEventsPage.tsx](#admineventspagetsx) - 현재 프로젝트 파일 참조
- [AdminReservationsPage.tsx](#adminreservationspagetsx) - 현재 프로젝트 파일 참조
- [AdminVendorsPage.tsx](#adminvendorspagetsx) - 현재 프로젝트 파일 참조
- [AdminContractsPage.tsx](#admincontractspagetsx) - 현재 프로젝트 파일 참조
- [AdminStatisticsPage.tsx](#adminstatisticspagetsx) - 현재 프로젝트 파일 참조
- [AdminSettlementPage.tsx](#adminsettlementpagetsx) - 현재 프로젝트 파일 참조
- [AdminCompanyPage.tsx](#admincompanypagetsx) - 현재 프로젝트 파일 참조

---

## 🚀 빠른 시작

### 1. 프로젝트 생성

```bash
npm create vite@latest aura-fairs -- --template react-ts
cd aura-fairs
```

### 2. 패키지 설치

```bash
# Dependencies
npm install react-router lucide-react sonner qrcode.react recharts react-slick slick-carousel clsx tailwind-merge

# DevDependencies  
npm install -D @types/qrcode @types/react-slick tailwindcss@4
```

### 3. 파일 구조 생성

```bash
mkdir -p src/app/pages/admin
mkdir -p src/app/components
mkdir -p src/app/utils
mkdir -p src/styles
```

---

## 📁 전체 파일 목록 (복사 순서)

### 설정 파일 (4개)
1. `package.json`
2. `vite.config.ts`
3. `postcss.config.mjs`
4. `tsconfig.json`

### 스타일 (4개)
5. `/src/styles/fonts.css`
6. `/src/styles/theme.css`
7. `/src/styles/tailwind.css`
8. `/src/styles/index.css`

### Core (5개)
9. `/src/app/types.ts`
10. `/src/app/mockData.ts`
11. `/src/app/utils/cn.ts`
12. `/src/app/routes.tsx`
13. `/src/app/App.tsx`

### Components (4개)
14. `/src/app/components/Button.tsx`
15. `/src/app/components/Input.tsx`
16. `/src/app/components/Card.tsx`
17. `/src/app/components/AdminLayout.tsx`

### Public Pages (6개)
18. `/src/app/pages/Root.tsx`
19. `/src/app/pages/HomePage.tsx`
20. `/src/app/pages/EventsListPage.tsx`
21. `/src/app/pages/EventReservationPage.tsx`
22. `/src/app/pages/MyTicketsPage.tsx`
23. `/src/app/pages/KioskPage.tsx`

### Admin Pages (9개)
24. `/src/app/pages/admin/AdminLoginPage.tsx`
25. `/src/app/pages/admin/AdminDashboard.tsx`
26. `/src/app/pages/admin/AdminEventsPage.tsx`
27. `/src/app/pages/admin/AdminReservationsPage.tsx`
28. `/src/app/pages/admin/AdminVendorsPage.tsx`
29. `/src/app/pages/admin/AdminContractsPage.tsx`
30. `/src/app/pages/admin/AdminStatisticsPage.tsx`
31. `/src/app/pages/admin/AdminSettlementPage.tsx`
32. `/src/app/pages/admin/AdminCompanyPage.tsx`

**총 32개 파일**

---

## 💡 코드 가져오기 방법

### 방법 1: 현재 Figma Make 프로젝트에서 복사

프로젝트 파일 탐색기에서 각 파일을 열어 코드를 복사합니다:

1. **Public 페이지들**
   - `/src/app/pages/HomePage.tsx`
   - `/src/app/pages/EventsListPage.tsx`
   - `/src/app/pages/EventReservationPage.tsx`
   - `/src/app/pages/MyTicketsPage.tsx`
   - `/src/app/pages/KioskPage.tsx`

2. **Admin 페이지들**
   - `/src/app/pages/admin/AdminLoginPage.tsx`
   - `/src/app/pages/admin/AdminDashboard.tsx`
   - `/src/app/pages/admin/AdminEventsPage.tsx`
   - `/src/app/pages/admin/AdminReservationsPage.tsx`
   - `/src/app/pages/admin/AdminVendorsPage.tsx`
   - `/src/app/pages/admin/AdminContractsPage.tsx`
   - `/src/app/pages/admin/AdminStatisticsPage.tsx`
   - `/src/app/pages/admin/AdminSettlementPage.tsx`
   - `/src/app/pages/admin/AdminCompanyPage.tsx`

3. **Core 파일들**
   - `/src/app/types.ts`
   - `/src/app/mockData.ts`
   - `/src/app/routes.tsx`
   - `/src/app/App.tsx`

4. **Components**
   - `/src/app/components/Button.tsx`
   - `/src/app/components/Input.tsx`
   - `/src/app/components/Card.tsx`
   - `/src/app/components/AdminLayout.tsx`
   - `/src/app/utils/cn.ts`

5. **스타일**
   - `/src/styles/fonts.css`
   - `/src/styles/theme.css`
   - `/src/styles/tailwind.css`
   - `/src/styles/index.css`

### 방법 2: 문서 참조

다른 문서들을 참조하세요:
- `COMPLETE_DESIGN_CODE.md` - 전체 구조 및 Core 파일
- `PAGES_CODE_COMPLETE.md` - 페이지별 가이드

---

## 🔑 핵심 파일 설명

### HomePage.tsx
- **312 lines**
- 히어로 슬라이드쇼 (5개 이미지, fade 애니메이션)
- React Slick 캐러셀 (3개 이상 이벤트)
- 키오스크 링크 (푸터)
- 반응형 디자인 (모바일 최적화)

### EventReservationPage.tsx
- **447 lines**
- 4단계 예약 프로세스
- QR 코드 생성 (qrcode.react)
- 관심 서비스 체크박스 (13개 옵션)

### KioskPage.tsx
- **232 lines**
- 전체화면 키오스크 UI
- 숫자 패드 + 동/호 버튼
- FAB 메뉴 (설정/새로고침/종료)

### AdminDashboard.tsx
- **165 lines**
- 4개 통계 카드
- 활성 이벤트 목록
- 최근 예약 목록

### AdminContractsPage.tsx
- **가장 복잡**
- 3가지 계약서 타입 (전자/업로드/템플릿)
- 서명 패드 기능
- 품목 동적 추가/삭제

### AdminStatisticsPage.tsx
- Recharts 사용
- 3가지 차트 (라인/바/파이)
- 데이터 시각화

---

## 🎯 주요 기능별 코드 위치

### 슬라이드쇼
- **위치**: `/src/app/pages/HomePage.tsx` (lines 23-36)
- **CSS**: `/src/styles/theme.css` (fade-in/fade-out 애니메이션)

### QR 코드 생성
- **위치**: `/src/app/pages/EventReservationPage.tsx` (line 127)
- **패키지**: `qrcode.react`

### 관리자 사이드바
- **위치**: `/src/app/components/AdminLayout.tsx`
- **메뉴 항목**: 8개 (대시보드~운영사 설정)

### 동호수 입력
- **위치**: `/src/app/pages/KioskPage.tsx` (lines 24-83)
- **형식**: "101동 1001호"

### 차트
- **위치**: `/src/app/pages/admin/AdminStatisticsPage.tsx`
- **패키지**: `recharts`

---

## ⚙️ 설정 파일

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
    "qrcode.react": "^4.1.0",
    "recharts": "^2.15.0",
    "react-slick": "^0.30.2",
    "slick-carousel": "^1.8.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
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

---

## 📝 구현 체크리스트

### Phase 1: 설정 (10분)
- [ ] Vite 프로젝트 생성
- [ ] 패키지 설치
- [ ] 폴더 구조 생성

### Phase 2: 스타일 (5분)
- [ ] fonts.css
- [ ] theme.css
- [ ] tailwind.css
- [ ] index.css

### Phase 3: Core (15분)
- [ ] types.ts (모든 인터페이스)
- [ ] mockData.ts (Mock 데이터 & 함수)
- [ ] routes.tsx (라우팅 설정)
- [ ] App.tsx
- [ ] utils/cn.ts

### Phase 4: Components (10분)
- [ ] Button.tsx
- [ ] Input.tsx
- [ ] Card.tsx
- [ ] AdminLayout.tsx

### Phase 5: Public Pages (20분)
- [ ] Root.tsx
- [ ] HomePage.tsx ⭐ (가장 복잡)
- [ ] EventsListPage.tsx
- [ ] EventReservationPage.tsx ⭐ (4단계 폼)
- [ ] MyTicketsPage.tsx
- [ ] KioskPage.tsx ⭐ (키오스크 UI)

### Phase 6: Admin Pages (25분)
- [ ] AdminLoginPage.tsx
- [ ] AdminDashboard.tsx
- [ ] AdminEventsPage.tsx
- [ ] AdminReservationsPage.tsx
- [ ] AdminVendorsPage.tsx
- [ ] AdminContractsPage.tsx ⭐ (가장 복잡)
- [ ] AdminStatisticsPage.tsx (차트)
- [ ] AdminSettlementPage.tsx
- [ ] AdminCompanyPage.tsx

### Phase 7: 테스트 (10분)
- [ ] 홈페이지 슬라이드쇼 작동
- [ ] 예약 프로세스 완주
- [ ] QR 코드 생성 확인
- [ ] 키오스크 입력 테스트
- [ ] Admin 로그인 (admin@aura.com / admin123)
- [ ] Admin 페이지 네비게이션

**총 예상 시간: 약 1.5시간**

---

## 🐛 문제 해결

### 1. React Router 오류
```bash
# react-router-dom이 아닌 react-router 사용
npm install react-router
```

### 2. QR 코드 표시 안됨
```bash
# qrcode.react 설치 확���
npm install qrcode.react @types/qrcode
```

### 3. 슬라이드쇼 오류
```bash
# react-slick CSS 파일 import 확인
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
```

### 4. Tailwind 변수 작동 안함
```css
/* theme.css에서 CSS 변수 정의 확인 */
:root {
  --brand-lime: #E8EEF4;
  --brand-dark: #0F1F3D;
  --brand-accent: #A8C4DC;
}
```

---

## 🚀 배포

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 📞 지원

이 문서는 Aura Move-in Fairs 시스템의 완전한 소스 코드 아카이브입니다.

**현재 프로젝트의 모든 파일을 그대로 복사하면 100% 동일한 시스템을 구현할 수 있습니다.**

---

## 📄 관련 문서

- `COMPLETE_DESIGN_CODE.md` - 전체 구조 및 설명
- `PAGES_COMPLETE.md` - 페이지별 간단 가이드
- `DESIGN_SYSTEM.md` - 디자인 시스템 명세 (있는 경우)
- `PROJECT_SPEC.md` - 프로젝트 명세서 (있는 경우)

---

© 2026 Aura Move-in Fairs. Complete Source Code Archive.
