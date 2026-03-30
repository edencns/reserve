import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { toast } from 'sonner';

export default function AdminCompanyPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Aura Move-in Fairs',
    address: '서울시 강남구 테헤란로 123',
    email: 'contact@aurafairs.com',
    phone: '02-1234-5678',
    businessNumber: '123-45-67890',
    representative: '김대표',
  });

  const handleSave = () => {
    toast.success('회사 정보가 저장되었습니다');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <h1 className="font-serif text-6xl mb-2">Company Info</h1>
          <p className="text-lg opacity-70">Manage your company information</p>
        </div>

        <div className="max-w-3xl">
          <div className="bg-white border border-[var(--brand-dark)] p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                  Company Name
                </label>
                <Input
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                  Address
                </label>
                <Input
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                  Phone
                </label>
                <Input
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                  Business Number
                </label>
                <Input
                  value={companyInfo.businessNumber}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, businessNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                  Representative
                </label>
                <Input
                  value={companyInfo.representative}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, representative: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--brand-dark)]/10">
              <Button variant="solid" size="lg" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>

          <div className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-8 mt-8">
            <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-4">
              Brand Information
            </div>
            <h2 className="font-serif text-3xl mb-4">The Aura Standard</h2>
            <p className="opacity-90 leading-relaxed">
              Aura Move-in Fairs는 프리미엄 아파트 입주 경험을 제공합니다. 
              엄선된 업체들과 함께 입주자분��께 최고의 서비스를 제공하는 것이 우리의 목표입니다.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
