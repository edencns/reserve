import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { mockContracts } from '../../mockData';
import { Plus, Download, Eye } from 'lucide-react';

export default function AdminContractsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">계약서</h1>
            <p className="text-base opacity-60">업체 계약 관리</p>
          </div>
          <Button variant="solid" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            새 계약서
          </Button>
        </div>

        <div className="bg-white border-2 border-[var(--brand-dark)] overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="border-b-2 border-[var(--brand-dark)]">
              <tr className="bg-[var(--brand-lime)]">
                <th className="px-4 py-4 text-left text-sm font-bold w-[80px]">ID</th>
                <th className="px-4 py-4 text-left text-sm font-bold w-[150px]">고객</th>
                <th className="px-4 py-4 text-left text-sm font-bold w-[180px]">이벤트</th>
                <th className="px-4 py-4 text-left text-sm font-bold w-[180px]">금액</th>
                <th className="px-4 py-4 text-left text-sm font-bold w-[120px]">유형</th>
                <th className="px-4 py-4 text-left text-sm font-bold w-[120px]">상태</th>
                <th className="px-4 py-4 text-left text-sm font-bold w-[80px]">액션</th>
              </tr>
            </thead>
            <tbody>
              {mockContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="text-xs font-mono truncate">{contract.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold truncate text-[var(--brand-dark)]">{contract.customerName}</div>
                    <div className="text-xs opacity-60 truncate">{contract.unitNumber}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm truncate">{contract.eventTitle}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xl font-bold text-[#0F1F3D]">₩{contract.totalAmount.toLocaleString()}</div>
                    <div className="text-xs opacity-60">예치금: ₩{contract.depositAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs uppercase tracking-wider px-2 py-1 bg-[var(--brand-lime)] font-medium">
                      {contract.type === 'electronic' ? '전자' : '종이'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-wider inline-block font-medium ${
                        contract.status === 'completed'
                          ? 'bg-[var(--brand-dark)] text-[var(--brand-lime)]'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {contract.status === 'completed' ? '완료' : '진행중'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                        title="계약서 보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                        title="다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mockContracts.length === 0 && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
            <h2 className="text-3xl mb-4 font-bold">계약서가 없습니다</h2>
            <p className="text-lg opacity-60 mb-8">첫 번째 계약서를 만들어보세요</p>
            <Button variant="solid" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              새 계약서
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
