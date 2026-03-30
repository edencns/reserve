// Type definitions for the ReserveTicket system

export interface TimeSlotDef {
  id: string;
  time: string;
}

export interface CustomField {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'tel' | 'number' | 'email' | 'select' | 'multiselect';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface VendorCategory {
  id: string;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Event {
  id: string;
  slug: string;
  shareDomain?: string;
  imageUrl?: string;
  title: string;
  description: string;
  venue: string;
  address: string;
  dates: string[];
  startTime?: string;
  endTime?: string;
  timeSlots: TimeSlotDef[];
  customFields: CustomField[];
  vendorCategories?: VendorCategory[];
  vendors?: Vendor[];
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
}

export interface Reservation {
  id: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  timeSlotId: string;
  attendeeCount: number;
  customer: Customer;
  extraFields: Record<string, string>;
  status: 'confirmed' | 'cancelled';
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export interface ManagedVendor {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  products: string;
  representativeName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  notes: string;
  imageUrl?: string;
  documents: VendorDocument[];
  businessNumber?: string;
  createdAt: string;
}

export interface VendorDocument {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ContractItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface TemplateField {
  id: string;
  key: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VendorContract {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  eventId: string;
  eventTitle: string;
  unitNumber: string;
  customerName: string;
  customerPhone: string;
  items: ContractItem[];
  totalAmount: number;
  depositAmount: number;
  paymentMethod: string;
  notes: string;
  contractDate: string;
  customerSignature?: string;
  vendorSignature?: string;
  uploadedImages?: string[];
  templateFields?: TemplateField[];
  templateAnnotations?: string[];
  type: 'electronic' | 'upload' | 'template';
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'vendor';
  vendorId?: string;
}

export interface ContractUpload {
  token: string;          // 고객에게 발급되는 검증 토큰
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerPhone: string;  // 저장 시 해싱 처리 (마지막 4자리만 평문 보관)
  phoneLast4: string;     // 검증용
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileDataUrl: string;    // 실제 환경에서는 암호화된 스토리지 키로 대체
  uploadedAt: string;
  verified: boolean;
}

export interface DashboardStats {
  totalReservations: number;
  todayReservations: number;
  checkedInToday: number;
  totalRevenue: number;
}
