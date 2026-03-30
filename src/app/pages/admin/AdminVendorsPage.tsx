import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { mockVendors } from '../../mockData';
import { Plus, Edit, Mail, Phone } from 'lucide-react';

export default function AdminVendorsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">업체</h1>
            <p className="text-base opacity-60">참여 업체 관리</p>
          </div>
          <Button variant="solid" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            업체 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white border-2 border-[var(--brand-dark)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl mb-1 text-[var(--brand-dark)] font-bold">{vendor.name}</h3>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#0F1F3D] font-medium">
                    {vendor.category}
                  </div>
                </div>
                <button className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors">
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

        {mockVendors.length === 0 && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
            <h2 className="text-3xl mb-4 font-bold">업체가 없습니다</h2>
            <p className="text-lg opacity-70 mb-8">첫 번째 업체를 추가하세요</p>
            <Button variant="solid" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              업체 추가
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
