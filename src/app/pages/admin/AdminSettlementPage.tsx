import { AdminLayout } from '../../components/AdminLayout';
import { mockContracts, mockVendors } from '../../mockData';

export default function AdminSettlementPage() {
  // Calculate settlement by vendor
  const settlements = mockVendors.map((vendor) => {
    const vendorContracts = mockContracts.filter((c) => c.vendorId === vendor.id);
    const totalSales = vendorContracts.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalDeposits = vendorContracts.reduce((sum, c) => sum + c.depositAmount, 0);
    const completedContracts = vendorContracts.filter((c) => c.status === 'completed').length;

    return {
      vendor,
      contractCount: vendorContracts.length,
      completedContracts,
      totalSales,
      totalDeposits,
      balance: totalSales - totalDeposits,
    };
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">정산</h1>
          <p className="text-base opacity-60">업체 결제 정산</p>
        </div>

        <div className="bg-white border-2 border-[var(--brand-dark)] mb-8 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b-2 border-[var(--brand-dark)]">
              <tr className="bg-[var(--brand-lime)]">
                <th className="px-6 py-4 text-left text-sm font-bold">업체</th>
                <th className="px-6 py-4 text-left text-sm font-bold">카테고리</th>
                <th className="px-6 py-4 text-right text-sm font-bold">계약</th>
                <th className="px-6 py-4 text-right text-sm font-bold">총 매출</th>
                <th className="px-6 py-4 text-right text-sm font-bold">예치금</th>
                <th className="px-6 py-4 text-right text-sm font-bold">잔액</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(({ vendor, contractCount, completedContracts, totalSales, totalDeposits, balance }) => (
                <tr
                  key={vendor.id}
                  className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[var(--brand-dark)]">{vendor.name}</div>
                    <div className="text-xs opacity-60">{vendor.contactName}</div>
                  </td>
                  <td className="px-6 py-4">{vendor.category}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-lg">
                      {completedContracts} / {contractCount}
                    </div>
                    <div className="text-xs opacity-60">완료</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-xl text-[#0F1F3D]">
                      {totalSales.toLocaleString()}원
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-lg">
                      {totalDeposits.toLocaleString()}원
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-xl text-[#0F1F3D]">
                      {balance.toLocaleString()}원
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-[var(--brand-dark)]">
              <tr className="bg-[var(--brand-lime)]">
                <td colSpan={3} className="px-6 py-4 text-xl text-[var(--brand-dark)] font-bold">
                  합계
                </td>
                <td className="px-6 py-4 text-right font-bold text-2xl text-[#0F1F3D]">
                  {settlements.reduce((sum, s) => sum + s.totalSales, 0).toLocaleString()}원
                </td>
                <td className="px-6 py-4 text-right font-bold text-xl">
                  {settlements.reduce((sum, s) => sum + s.totalDeposits, 0).toLocaleString()}원
                </td>
                <td className="px-6 py-4 text-right font-bold text-2xl text-[#0F1F3D]">
                  {settlements.reduce((sum, s) => sum + s.balance, 0).toLocaleString()}원
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {settlements.length === 0 && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
            <h2 className="text-3xl mb-4 font-bold">정산 데이터가 없습니다</h2>
            <p className="text-lg opacity-60">계약이 완료되면 정산 정보가 표시됩니다</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
