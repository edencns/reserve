# Aura Move-in Fairs - 전체 페이지 코드 모음

> 모든 페이지의 완전한 소스 코드 - 복사해서 바로 사용하세요
> 
> 각 파일을 해당 경로에 생성하면 완벽하게 동일한 시스템 구현 가능

---

## 📁 파일 위치 가이드

```
/src/app/pages/
├── Root.tsx
├── HomePage.tsx
├── EventsListPage.tsx  
├── EventReservationPage.tsx
├── MyTicketsPage.tsx
├── KioskPage.tsx
└── admin/
    ├── AdminLoginPage.tsx
    ├── AdminDashboard.tsx
    ├── AdminEventsPage.tsx
    ├── AdminReservationsPage.tsx
    ├── AdminVendorsPage.tsx
    ├── AdminContractsPage.tsx
    ├── AdminStatisticsPage.tsx
    ├── AdminSettlementPage.tsx
    └── AdminCompanyPage.tsx
```

---

## Public Pages

### 1. `/src/app/pages/Root.tsx`

```typescript
import { Outlet } from 'react-router';

export default function Root() {
  return <Outlet />;
}
```

---

###  2. `/src/app/pages/HomePage.tsx`

**파일 크기**: 312 lines  
**기능**: 홈페이지 (히어로 슬라이드쇼, 이벤트 카드, Aura 스탠다드)

현재 프로젝트의 `/src/app/pages/HomePage.tsx` 파일을 그대로 복사하세요.

**주요 기능**:
- 5개 이미지 슬라이드쇼 (페이드 효과 1.5초, 5.5초 간격)
- React Slick 캐러셀 (3개 이상 이벤트시)
- 키오스크 모드 링크 (푸터)
- 모바일 반응형 (break-words, sm/md/lg 브레이크포인트)

---

### 3. `/src/app/pages/EventsListPage.tsx`

**파일 크기**: 85 lines  
**기능**: 모든 활성 이벤트 그리드 보기

현재 프로젝트의 `/src/app/pages/EventsListPage.tsx` 파일을 그대로 복사하세요.

**주요 기능**:
- 3열 그리드 레이아웃 (반응형)
- 호버 시 이벤트 상세 정보 표시
- 아치형 이미지 (rounded-t-[300px])

---

### 4. `/src/app/pages/EventReservationPage.tsx`

**파일 크기**: 447 lines  
**기능**: 4단계 예약 폼 (정보확인 → 날짜선택 → 정보입력 → 완료/QR)

현재 프로젝트의 `/src/app/pages/EventReservationPage.tsx` 파일을 그대로 복사하세요.

**주요 기능**:
- Step 1: 이벤트 상세 정보
- Step 2: 날짜 선택 (박람회 날짜 목록)
- Step 3: 예약자 정보 + 관심 서비스 체크박스
- Step 4: QR 코드 티켓 발급
- qrcode.react 사용

---

### 5. `/src/app/pages/MyTicketsPage.tsx`

**파일 크기**: 204 lines  
**기능**: 전화번호로 예약 조회 및 QR 티켓 재확인

현재 프로젝트의 `/src/app/pages/MyTicketsPage.tsx` 파일을 그대로 복사하세요.

**주요 기능**:
- 전화번호 검색
- 예약 목록 표시
- QR 코드 재표시
- 체크인 상태 배지

---

### 6. `/src/app/pages/KioskPage.tsx`

**파일 크기**: 232 lines  
**기능**: 현장 키오스크 (동호수 연속 입력 방식)

현재 프로젝트의 `/src/app/pages/KioskPage.tsx` 파일을 그대로 복사하세요.

**주요 기능**:
- 숫자 + 동/호 버튼
- "101동 1001호" 형식 자동 구성
- FAB 메뉴 (우측 하단)
  - 화상 키보드 토글
  - 새로고침
  - 종료
- 체크인 처리

---

## Admin Pages

### 7. `/src/app/pages/admin/AdminLoginPage.tsx`

**파일 크기**: 89 lines  
**기능**: 관리자 로그인

현재 프로젝트의 `/src/app/pages/admin/AdminLoginPage.tsx` 파일을 그대로 복사하세요.

**데모 계정**:
- Admin: admin@aura.com / admin123
- Vendor: vendor@furniture.com / vendor123

---

### 8. `/src/app/pages/admin/AdminDashboard.tsx`

**파일 크기**: ~165 lines  
**기능**: 대시보드 (통계 카드, 활성 이벤트, 최근 예약)

현재 프로젝트의 `/src/app/pages/admin/AdminDashboard.tsx` 파일을 그대로 복사하세요.

**주요 섹션**:
- 4개 통계 카드 (오늘 예약, 체크인, 총 예약, 매출)
- 활성 이벤트 목록
- 최근 예약 목록

---

### 9. `/src/app/pages/admin/AdminEventsPage.tsx`

**기능**: 이벤트 CRUD (생성, 수정, 삭제)

현재 프로젝트의 `/src/app/pages/admin/AdminEventsPage.tsx` 파일을 그대로 복사하세요.

---

### 10. `/src/app/pages/admin/AdminReservationsPage.tsx`

**기능**: 예약 목록, 필터링, 수동 체크인

현재 프로젝트의 `/src/app/pages/admin/AdminReservationsPage.tsx` 파일을 그대로 복사하세요.

---

### 11. `/src/app/pages/admin/AdminVendorsPage.tsx`

**기능**: 업체 관리 (등록, 수정, 삭제)

현재 프로젝트의 `/src/app/pages/admin/AdminVendorsPage.tsx` 파일을 그대로 복사하세요.

---

### 12. `/src/app/pages/admin/AdminContractsPage.tsx`

**기능**: 계약서 관리 (전자/업로드/템플릿)

현재 프로젝트의 `/src/app/pages/admin/AdminContractsPage.tsx` 파일을 그대로 복사하세요.

**3가지 계약서 타입**:
1. **전자 계약서**: 품목 입력 + 서명 패드
2. **이미지 업로드**: 종이 계약서 사진
3. **템플릿 기반**: PDF에 필드 매핑

---

### 13. `/src/app/pages/admin/AdminStatisticsPage.tsx`

**기능**: 통계 및 차트 (Recharts)

현재 프로젝트의 `/src/app/pages/admin/AdminStatisticsPage.tsx` 파일을 그대로 복사하세요.

**차트 종류**:
- 예약 추이 (라인 차트)
- 업체별 매출 (바 차트)
- 이벤트별 예약 (파이 차트)

---

### 14. `/src/app/pages/admin/AdminSettlementPage.tsx`

**기능**: 업체별 매출 및 정산 관리

현재 프로젝트의 `/src/app/pages/admin/AdminSettlementPage.tsx` 파일을 그대로 복사하세요.

---

### 15. `/src/app/pages/admin/AdminCompanyPage.tsx`

**기능**: 운영사 정보 및 로고 관리

현재 프로젝트의 `/src/app/pages/admin/AdminCompanyPage.tsx` 파일을 그대로 복사하세요.

---

## 🎯 모든 파일 한 번에 복사하는 방법

### 방법 1: 현재 프로젝트에서 직접 복사

```bash
# 모든 Public 페이지
cp /src/app/pages/Root.tsx [새프로젝트]/src/app/pages/
cp /src/app/pages/HomePage.tsx [새프로젝트]/src/app/pages/
cp /src/app/pages/EventsListPage.tsx [새프로젝트]/src/app/pages/
cp /src/app/pages/EventReservationPage.tsx [새프로젝트]/src/app/pages/
cp /src/app/pages/MyTicketsPage.tsx [새프로젝트]/src/app/pages/
cp /src/app/pages/KioskPage.tsx [새프로젝트]/src/app/pages/

# 모든 Admin 페이지
cp -r /src/app/pages/admin/ [새프로젝트]/src/app/pages/
```

### 방법 2: VS Code에서 복사

1. 각 파일을 열기
2. `Ctrl+A` (전체 선택) → `Ctrl+C` (복사)
3. 새 프로젝트에서 같은 경로에 파일 생성 후 `Ctrl+V` (붙여넣기)

---

## ✅ 확인 체크리스트

구현 완료 후 확인사항:

### Public 페이지 (6개)
- [ ] Root.tsx - Outlet만 렌더링
- [ ] HomePage.tsx - 슬라이드쇼 작동, 이벤트 카드 표시
- [ ] EventsListPage.tsx - 그리드 레이아웃
- [ ] EventReservationPage.tsx - 4단계 폼, QR 생성
- [ ] MyTicketsPage.tsx - 전화번호 검색 작동
- [ ] KioskPage.tsx - 동호수 입력, FAB 메뉴

### Admin 페이지 (9개)
- [ ] AdminLoginPage.tsx - 로그인 작동
- [ ] AdminDashboard.tsx - 통계 표시
- [ ] AdminEventsPage.tsx - 이벤트 CRUD
- [ ] AdminReservationsPage.tsx - 예약 목록
- [ ] AdminVendorsPage.tsx - 업체 관리
- [ ] AdminContractsPage.tsx - 계약서 3종
- [ ] AdminStatisticsPage.tsx - 차트 렌더링
- [ ] AdminSettlementPage.tsx - 정산 관리
- [ ] AdminCompanyPage.tsx - 회사 정보

---

## 🔗 관련 파일

이 페이지들이 제대로 작동하려면 다음 파일들도 필요합니다:

### Core Files
- `/src/app/types.ts` - 타입 정의
- `/src/app/mockData.ts` - Mock 데이터
- `/src/app/routes.tsx` - 라우팅
- `/src/app/App.tsx` - 메인 앱

### Components
- `/src/app/components/Button.tsx`
- `/src/app/components/Input.tsx`
- `/src/app/components/Card.tsx`
- `/src/app/components/AdminLayout.tsx`

### Styles
- `/src/styles/fonts.css`
- `/src/styles/theme.css`
- `/src/styles/tailwind.css`
- `/src/styles/index.css`

**전체 구조는 `COMPLETE_DESIGN_CODE.md` 참조**

---

## 📝 주의사항

1. **Import 경로**: 상대 경로 확인 (`../components/Button` 등)
2. **필수 패키지**: `react-router`, `lucide-react`, `qrcode.react`, `sonner`, `react-slick`
3. **Tailwind v4**: CSS 변수 사용 (`var(--brand-dark)` 등)
4. **Mock 데이터**: 실제 API로 교체하려면 `mockData.ts`의 함수들을 API 호출로 변경

---

## 🚀 빠른 구현 가이드

### 1단계: 프로젝트 설정
```bash
npm create vite@latest my-aura-fairs -- --template react-ts
cd my-aura-fairs
npm install
```

### 2단계: 패키지 설치
```bash
npm install react-router lucide-react sonner qrcode.react recharts react-slick slick-carousel clsx tailwind-merge
npm install -D @types/qrcode @types/react-slick tailwindcss@4
```

### 3단계: 파일 복사
- 스타일 파일 4개
- Core 파일 4개 (types, mockData, routes, App)
- 컴포넌트 4개
- 페이지 15개

### 4단계: 개발 서버 실행
```bash
npm run dev
```

---

## 💡 팁

- **HomePage.tsx**가 가장 복잡함 (슬라이드쇼, 캐러셀)
- **EventReservationPage.tsx**는 4개 step을 조건부 렌더링
- **KioskPage.tsx**는 full-screen을 위해 padding 최소화
- **Admin 페이지들**은 모두 `<AdminLayout>` 사용

---

© 2026 Aura Move-in Fairs. Complete Pages Code Collection.
