import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { mockVendors } from '../../mockData';
import { ManagedVendor } from '../../types';
import { Plus, Edit, Mail, Phone, X } from 'lucide-react';

type VendorForm = Omit<ManagedVendor, 'id' | 'documents' | 'createdAt' | 'imageUrl'>;

const EMPTY_FORM: VendorForm = {
  name: '',
  category: '',
  phone: '',
  email: '',
  products: '',
  representativeName: '',
  address: '',
  contactName: '',
  contactPhone: '',
  businessNumber: '',
  notes: '',
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<ManagedVendor[]>(mockVendors);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VendorForm>(EMPTY_FORM);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(vendor: ManagedVendor) {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name,
      category: vendor.category,
      phone: vendor.phone,
      email: vendor.email,
      products: vendor.products,
      representativeName: vendor.representativeName,
      address: vendor.address,
      contactName: vendor.contactName,
      contactPhone: vendor.contactPhone,
      businessNumber: vendor.businessNumber ?? '',
      notes: vendor.notes,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.category.trim()) return;
    if (editingId) {
      setVendors((prev) =>
        prev.map((v) => v.id === editingId ? { ...v, ...form } : v)
      );
    } else {
      const newVendor: ManagedVendor = {
        ...form,
        id: `v${Date.now()}`,
        documents: [],
        createdAt: new Date().toISOString(),
      };
      setVendors((prev) => [...prev, newVendor]);
    }
    setModalOpen(false);
  }

  function set(field: keyof VendorForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">업체</h1>
            <p className="text-base opacity-60">참여 업체 관리</p>
          </div>
          <Button variant="solid" size="lg" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            업체 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white border-2 border-[var(--brand-dark)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl mb-1 text-[var(--brand-dark)] font-bold">{vendor.name}</h3>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#0F1F3D] font-medium">
                    {vendor.category}
                  </div>
                </div>
                <button
                  onClick={() => openEdit(vendor)}
                  className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 opacity-50" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 opacity-50" />
                  <span>{vendor.email}</span>
                </div>
              </div>

              <div className="border-t border-[var(--brand-dark)]/10 pt-4">
                <div className="text-xs uppercase tracking-[0.15em] mb-2 opacity-60 font-medium">제품</div>
                <div className="text-sm opacity-70">{vendor.products}</div>
              </div>

              <div className="border-t border-[var(--brand-dark)]/10 mt-4 pt-4">
                <div className="text-xs uppercase tracking-[0.15em] mb-2 opacity-60 font-medium">연락처</div>
                <div className="text-sm">
                  {vendor.contactName} - {vendor.contactPhone}
                </div>
              </div>
            </div>
          ))}
        </div>

        {vendors.length === 0 && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
            <h2 className="text-3xl mb-4 font-bold">업체가 없습니다</h2>
            <p className="text-lg opacity-70 mb-8">첫 번째 업체를 추가하세요</p>
            <Button variant="solid" size="lg" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" />
              업체 추가
            </Button>
          </div>
        )}
      </div>

      {/* 업체 추가/수정 모달 */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)] flex-shrink-0">
              <h2 className="text-lg font-bold text-[var(--brand-dark)]">
                {editingId ? '업체 수정' : '업체 추가'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:opacity-60">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              {([
                ['name', '업체명', true],
                ['category', '카테고리', true],
                ['phone', '연락처', false],
                ['email', '이메일', false],
                ['products', '제품/서비스', false],
                ['representativeName', '대표자명', false],
                ['address', '주소', false],
                ['contactName', '담당자명', false],
                ['contactPhone', '담당자 연락처', false],
                ['businessNumber', '사업자번호', false],
                ['notes', '메모', false],
              ] as [keyof VendorForm, string, boolean][]).map(([field, label, required]) => (
                <div key={field}>
                  <label className="block text-sm font-bold mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  {field === 'notes' ? (
                    <textarea
                      value={form[field]}
                      onChange={(e) => set(field, e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)] resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field]}
                      onChange={(e) => set(field, e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 모달 푸터 */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.category.trim()}
                className="flex-1 py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {editingId ? '수정 완료' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
