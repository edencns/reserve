import { Event, Reservation, ManagedVendor, VendorContract, DashboardStats, ContractUpload } from './types';

// Mock Events Data
export const mockEvents: Event[] = [
  {
    id: '1',
    slug: 'the-lumina-oct',
    imageUrl: 'https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3NDYxNzgxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'The Lumina 입주박람회',
    description: '더 루미나 아파트 입주자를 위한 특별 박람회입니다. 가구, 가전, 인테리어 업체가 한자리에!',
    venue: 'The Lumina',
    address: '서울시 강남구 테헤란로 123',
    dates: ['2026-10-12', '2026-10-13', '2026-10-14'],
    startTime: '10:00',
    endTime: '18:00',
    timeSlots: [
      { id: 't1', time: '10:00' },
      { id: 't2', time: '11:00' },
      { id: 't3', time: '13:00' },
      { id: 't4', time: '14:00' },
      { id: 't5', time: '15:00' },
      { id: 't6', time: '16:00' },
      { id: 't7', time: '17:00' },
    ],
    customFields: [
      {
        id: 'f1',
        key: 'unitNumber',
        label: '동호수',
        type: 'text',
        placeholder: '예: 101동 1001호',
        required: true,
      },
      {
        id: 'f2',
        key: 'moveInDate',
        label: '입주 예정일',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
        required: false,
      },
      {
        id: 'f3',
        key: 'interests',
        label: '관심 분야',
        type: 'multiselect',
        options: ['가구', '가전', '인테리어', '커튼/블라인드', '조명'],
        required: false,
      },
    ],
    vendors: [
      { id: 'v1', name: '프리미엄 가구', category: '가구', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
      { id: 'v2', name: '쿨에어 시스템', category: '에어컨/냉난방', imageUrl: 'https://images.unsplash.com/photo-1631083215283-b7a8e55d2adf?w=400&q=80' },
      { id: 'v3', name: '스마트이사', category: '이사', imageUrl: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&q=80' },
      { id: 'v4', name: '모던커튼', category: '전동커튼/블라인드', imageUrl: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=400&q=80' },
      { id: 'v6', name: '하우스인테리어', category: '인테리어', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
      { id: 'v7', name: '루미나조명', category: '조명', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80' },
    ],
    status: 'active',
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: '2',
    slug: 'oasis-heights-oct',
    imageUrl: 'https://images.unsplash.com/photo-1690489965043-ec15758cce71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzc0Njk1MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Oasis Heights 입주박람회',
    description: '프리미엄 아파트 입주자를 위한 맞춤형 박람회',
    venue: 'Oasis Heights 커뮤니티 센터',
    address: '서울시 서초구 서초대로 456',
    dates: ['2026-10-20', '2026-10-21', '2026-10-22'],
    startTime: '10:00',
    endTime: '18:00',
    timeSlots: [
      { id: 't1', time: '10:00' },
      { id: 't2', time: '11:30' },
      { id: 't3', time: '13:00' },
      { id: 't4', time: '14:30' },
      { id: 't5', time: '16:00' },
      { id: 't6', time: '17:30' },
    ],
    customFields: [
      {
        id: 'f1',
        key: 'unitNumber',
        label: '동호수',
        type: 'text',
        placeholder: '예: 201동 2001호',
        required: true,
      },
    ],
    vendors: [
      { id: 'v1', name: '프리미엄 가구', category: '가구' },
      { id: 'v4', name: '모던커튼', category: '전동커튼/블라인드' },
      { id: 'v5', name: '욕실플러스', category: '욕실/위생' },
      { id: 'v6', name: '하우스인테리어', category: '인테리어' },
      { id: 'v8', name: '키친마스터', category: '주방가전' },
    ],
    status: 'active',
    createdAt: '2026-03-05T00:00:00Z',
  },
  {
    id: '3',
    slug: 'vertex-lofts-nov',
    imageUrl: 'https://images.unsplash.com/photo-1664813954641-1ffcb7b55fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzQ2NDQ5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Vertex Lofts 입주박람회',
    description: '모던 로프트 스타일 아파트 입주 준비',
    venue: 'Vertex Lofts 루프탑 라운지',
    address: '서울시 마포구 월드컵북로 789',
    dates: ['2026-11-05', '2026-11-06', '2026-11-07'],
    startTime: '10:00',
    endTime: '17:00',
    timeSlots: [
      { id: 't1', time: '10:00' },
      { id: 't2', time: '11:00' },
      { id: 't3', time: '13:00' },
      { id: 't4', time: '14:00' },
      { id: 't5', time: '15:00' },
      { id: 't6', time: '16:00' },
    ],
    customFields: [
      {
        id: 'f1',
        key: 'unitNumber',
        label: '호수',
        type: 'text',
        placeholder: '예: 301호',
        required: true,
      },
    ],
    status: 'active',
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: '4',
    slug: 'skyline-residence-nov',
    imageUrl: 'https://images.unsplash.com/photo-1648502298359-055a3f374705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjB0b3dlcnxlbnwxfHx8fDE3NzQ3MTA0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Skyline Residence 입주박람회',
    description: '스카이라인 레지던스 입주자를 위한 프리미엄 박람회',
    venue: 'Skyline Residence 컨벤션홀',
    address: '서울시 송파구 올림픽로 333',
    dates: ['2026-11-15', '2026-11-16'],
    startTime: '10:00',
    endTime: '18:00',
    timeSlots: [
      { id: 't1', time: '10:00' },
      { id: 't2', time: '12:00' },
      { id: 't3', time: '14:00' },
      { id: 't4', time: '16:00' },
    ],
    customFields: [
      {
        id: 'f1',
        key: 'unitNumber',
        label: '동호수',
        type: 'text',
        placeholder: '예: 401동 4001호',
        required: true,
      },
    ],
    status: 'active',
    createdAt: '2026-03-15T00:00:00Z',
  },
  {
    id: '5',
    slug: 'urban-park-nov',
    imageUrl: 'https://images.unsplash.com/photo-1760561148422-bbb515696fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZmFjYWRlfGVufDF8fHx8MTc3NDYxNzU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Urban Park 입주박람회',
    description: '어반 파크 아파트 입주자들을 위한 특별 이벤트',
    venue: 'Urban Park 주민센터',
    address: '서울시 용산구 한강대로 777',
    dates: ['2026-11-25', '2026-11-26', '2026-11-27'],
    startTime: '10:00',
    endTime: '18:00',
    timeSlots: [
      { id: 't1', time: '10:00' },
      { id: 't2', time: '11:30' },
      { id: 't3', time: '13:00' },
      { id: 't4', time: '14:30' },
      { id: 't5', time: '16:00' },
    ],
    customFields: [
      {
        id: 'f1',
        key: 'unitNumber',
        label: '동호수',
        type: 'text',
        placeholder: '예: 501동 5001호',
        required: true,
      },
    ],
    status: 'active',
    createdAt: '2026-03-20T00:00:00Z',
  },
];

// Mock Reservations Data
export const mockReservations: Reservation[] = [
  {
    id: 'r1',
    eventId: '1',
    eventTitle: 'The Lumina 입주박람회',
    venue: 'The Lumina',
    address: '서울시 강남구 테헤란로 123',
    date: '2026-10-12',
    time: '10:00',
    timeSlotId: 't1',
    attendeeCount: 2,
    customer: {
      name: '김철수',
      phone: '010-1234-5678',
      email: 'kim@example.com',
    },
    extraFields: {
      unitNumber: '101동 1001호',
      interests: '가구,가전',
    },
    status: 'confirmed',
    checkedIn: true,
    checkedInAt: '2026-10-12T10:05:00Z',
    createdAt: '2026-10-01T14:30:00Z',
  },
  {
    id: 'r2',
    eventId: '1',
    eventTitle: 'The Lumina 입주박람회',
    venue: 'The Lumina',
    address: '서울시 강남구 테헤란로 123',
    date: '2026-10-12',
    time: '11:00',
    timeSlotId: 't2',
    attendeeCount: 3,
    customer: {
      name: '이영희',
      phone: '010-2345-6789',
      email: 'lee@example.com',
    },
    extraFields: {
      unitNumber: '102동 503호',
    },
    status: 'confirmed',
    checkedIn: false,
    createdAt: '2026-10-02T09:15:00Z',
  },
];

// Mock Vendors Data
export const mockVendors: ManagedVendor[] = [
  {
    id: 'v1',
    name: '프리미엄 가구',
    phone: '02-1234-5678',
    email: 'premium@furniture.com',
    category: '가구',
    products: '소파, 침대, 식탁',
    representativeName: '박대표',
    address: '서울시 강남구 논현로 100',
    contactName: '김담당',
    contactPhone: '010-3456-7890',
    notes: '프리미엄 가구 전문',
    businessNumber: '123-45-67890',
    documents: [],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'v2',
    name: '쿨에어 시스템',
    phone: '02-2345-6789',
    email: 'coolair@hvac.com',
    category: '에어컨/냉난방',
    products: '시스템 에어컨, 냉난방기',
    representativeName: '이대표',
    address: '서울시 성동구 뚝섬로 200',
    contactName: '박담당',
    contactPhone: '010-4567-8901',
    notes: '',
    businessNumber: '234-56-78901',
    documents: [],
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'v3',
    name: '스마트이사',
    phone: '02-3456-7890',
    email: 'smart@moving.com',
    category: '이사',
    products: '포장이사, 용달이사',
    representativeName: '최대표',
    address: '서울시 관악구 봉천로 300',
    contactName: '이담당',
    contactPhone: '010-5678-9012',
    notes: '',
    businessNumber: '345-67-89012',
    documents: [],
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 'v4',
    name: '모던커튼',
    phone: '02-4567-8901',
    email: 'modern@curtain.com',
    category: '전동커튼/블라인드',
    products: '전동커튼, 롤블라인드, 우드블라인드',
    representativeName: '정대표',
    address: '서울시 강동구 천호대로 400',
    contactName: '최담당',
    contactPhone: '010-6789-0123',
    notes: '',
    businessNumber: '456-78-90123',
    documents: [],
    createdAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 'v5',
    name: '욕실플러스',
    phone: '02-5678-9012',
    email: 'bath@plus.com',
    category: '욕실/위생',
    products: '욕실리모델링, 위생기기 교체',
    representativeName: '강대표',
    address: '서울시 은평구 통일로 500',
    contactName: '정담당',
    contactPhone: '010-7890-1234',
    notes: '',
    businessNumber: '567-89-01234',
    documents: [],
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'v6',
    name: '하우스인테리어',
    phone: '02-6789-0123',
    email: 'house@interior.com',
    category: '인테리어',
    products: '전체 인테리어, 부분 인테리어',
    representativeName: '조대표',
    address: '서울시 노원구 동일로 600',
    contactName: '강담당',
    contactPhone: '010-8901-2345',
    notes: '',
    businessNumber: '678-90-12345',
    documents: [],
    createdAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'v7',
    name: '루미나조명',
    phone: '02-7890-1234',
    email: 'lumina@lighting.com',
    category: '조명',
    products: 'LED 조명, 스마트 조명 시스템',
    representativeName: '윤대표',
    address: '서울시 마포구 양화로 700',
    contactName: '조담당',
    contactPhone: '010-9012-3456',
    notes: '',
    businessNumber: '789-01-23456',
    documents: [],
    createdAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 'v8',
    name: '키친마스터',
    phone: '02-8901-2345',
    email: 'kitchen@master.com',
    category: '주방가전',
    products: '냉장고, 세탁기, 식기세척기',
    representativeName: '임대표',
    address: '서울시 동대문구 왕산로 800',
    contactName: '윤담당',
    contactPhone: '010-0123-4567',
    notes: '',
    businessNumber: '890-12-34567',
    documents: [],
    createdAt: '2026-01-08T00:00:00Z',
  },
];

// Mock Contracts Data
export const mockContracts: VendorContract[] = [
  {
    id: 'c1',
    vendorId: 'v1',
    vendorName: '프리미엄 가구',
    vendorCategory: '가구',
    eventId: '1',
    eventTitle: 'The Lumina 입주박람회',
    unitNumber: '101동 1001호',
    customerName: '김철수',
    customerPhone: '010-1234-5678',
    items: [
      {
        description: '3인용 소파',
        quantity: 1,
        unitPrice: 2000000,
        amount: 2000000,
      },
      {
        description: '퀸사이즈 침대',
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000,
      },
    ],
    totalAmount: 3500000,
    depositAmount: 1000000,
    paymentMethod: '계좌이체',
    notes: '',
    contractDate: '2026-10-12',
    type: 'electronic',
    status: 'completed',
    createdAt: '2026-10-12T11:00:00Z',
    updatedAt: '2026-10-12T11:30:00Z',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalReservations: 125,
  todayReservations: 15,
  checkedInToday: 8,
  totalRevenue: 45000000,
};

// ── localStorage 유틸 ──
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveToStorage(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* noop */ }
}

// Mock current user
export let mockCurrentUser: { id: string; email: string; role: 'admin' | 'vendor'; vendorId?: string } | null = null;

// Helper functions for mock data manipulation
export const loginUser = (id: string, password: string) => {
  if (id === 'ed_cns' && password === 'aaaa4799!') {
    mockCurrentUser = { id: 'u1', email: 'ed_cns', role: 'admin' };
    return { success: true, user: mockCurrentUser };
  }
  return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
};

export const logoutUser = () => {
  mockCurrentUser = null;
};

export const getCurrentUser = () => {
  return mockCurrentUser;
};

export const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
  const newReservation: Reservation = {
    ...reservation,
    id: `r${mockReservations.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  mockReservations.push(newReservation);
  return newReservation;
};

export const getReservationsByPhone = (phone: string): Reservation[] => {
  const digits = phone.replace(/\D/g, '');
  return mockReservations.filter((r) => r.customer.phone.replace(/\D/g, '') === digits);
};

export const checkInReservation = (reservationId: string) => {
  const reservation = mockReservations.find((r) => r.id === reservationId);
  if (reservation) {
    reservation.checkedIn = true;
    reservation.checkedInAt = new Date().toISOString();
    return true;
  }
  return false;
};

// ── 계약서 업로드 스토어 ──
export const contractUploads: ContractUpload[] = loadFromStorage<ContractUpload[]>('aura_contractUploads', []);

let contractUploadCounter = contractUploads.length;

export function addContractUpload(
  data: Omit<ContractUpload, 'id' | 'uploadedAt' | 'verified'>
): void {
  contractUploads.push({
    ...data,
    id: `cu-${++contractUploadCounter}`,
    uploadedAt: new Date().toISOString(),
    verified: false,
  });
  saveToStorage('aura_contractUploads', contractUploads);
}

export function verifyContractUpload(phoneLast4: string, password: string): ContractUpload | null {
  return contractUploads.find((u) => u.phoneLast4 === phoneLast4 && u.password === password) ?? null;
}

export function updateEvent(id: string, data: Partial<import('./types').Event>): boolean {
  const idx = mockEvents.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockEvents[idx] = { ...mockEvents[idx], ...data };
    return true;
  }
  return false;
}

export function deleteEvent(id: string): boolean {
  const idx = mockEvents.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockEvents.splice(idx, 1);
    return true;
  }
  return false;
}

export function addEvent(data: Omit<import('./types').Event, 'id' | 'createdAt'>): import('./types').Event {
  const newEvent: import('./types').Event = {
    ...data,
    id: `e${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockEvents.push(newEvent);
  return newEvent;
}

// 행사 완료 상태 스토어
export const completedEventIds: Set<string> = new Set();

export function markEventCompleted(eventId: string) {
  completedEventIds.add(eventId);
}

export function unmarkEventCompleted(eventId: string) {
  completedEventIds.delete(eventId);
}