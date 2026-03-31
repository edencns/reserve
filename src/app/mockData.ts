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

// Mock current user
export let mockCurrentUser: { id: string; email: string; role: 'admin' | 'vendor'; vendorId?: string } | null = null;

// Helper functions for mock data manipulation
export const loginUser = (email: string, password: string) => {
  if (email === 'admin@aura.com' && password === 'admin123') {
    mockCurrentUser = { id: 'u1', email: 'admin@aura.com', role: 'admin' };
    return { success: true, user: mockCurrentUser };
  }
  if (email === 'vendor@furniture.com' && password === 'vendor123') {
    mockCurrentUser = { id: 'u2', email: 'vendor@furniture.com', role: 'vendor', vendorId: 'v1' };
    return { success: true, user: mockCurrentUser };
  }
  return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
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

// ── 계약서 업로드 스토어 (실제 환경에서는 암호화된 서버 스토리지 + 환경변수 키로 대체) ──
export const contractUploads: ContractUpload[] = [];

function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 12 }, (_, i) =>
    i > 0 && i % 4 === 0 ? '-' + chars[Math.floor(Math.random() * chars.length)]
      : chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export function addContractUpload(
  data: Omit<ContractUpload, 'token' | 'uploadedAt' | 'verified'>
): string {
  const token = generateToken();
  contractUploads.push({
    ...data,
    token,
    uploadedAt: new Date().toISOString(),
    verified: false,
  });
  return token;
}

export function verifyContractUpload(token: string, phoneLast4: string): ContractUpload | null {
  const upload = contractUploads.find((u) => u.token === token && u.phoneLast4 === phoneLast4);
  return upload ?? null;
}

// 행사 완료 상태 스토어
export const completedEventIds: Set<string> = new Set();

export function markEventCompleted(eventId: string) {
  completedEventIds.add(eventId);
}

export function unmarkEventCompleted(eventId: string) {
  completedEventIds.delete(eventId);
}