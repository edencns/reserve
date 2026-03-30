import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { mockReservations } from '../../mockData';
import { Search, Download } from 'lucide-react';

export default function AdminReservationsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">예약</h1>
            <p className="text-base opacity-60">모든 예약 관리</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg">
              <Search className="w-4 h-4 mr-2" />
              필터
            </Button>
            <Button variant="solid" size="lg">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        <div className="bg-white border-2 border-[var(--brand-dark)] overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b-2 border-[var(--brand-dark)]">
              <tr className="bg-[var(--brand-lime)]">
                <th className="px-6 py-4 text-left text-sm font-bold">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold">고객</th>
                <th className="px-6 py-4 text-left text-sm font-bold">이벤트</th>
                <th className="px-6 py-4 text-left text-sm font-bold">날짜 & 시간</th>
                <th className="px-6 py-4 text-left text-sm font-bold">참석자</th>
                <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono">{reservation.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[var(--brand-dark)]">{reservation.customer.name}</div>
                    <div className="text-xs opacity-60">{reservation.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{reservation.eventTitle}</div>
                    <div className="text-xs opacity-60">{reservation.venue}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{reservation.date}</div>
                    <div className="text-xs opacity-70">{reservation.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-[#0F1F3D]">{reservation.attendeeCount}</span>
                    <span className="text-sm opacity-60 ml-1">명</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {reservation.checkedIn ? (
                        <span className="px-3 py-1 bg-[#0F1F3D] text-[var(--brand-lime)] text-xs uppercase tracking-wider font-medium">
                          체크인
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-[#A8C4DC] text-[var(--brand-dark)] text-xs uppercase tracking-wider font-medium">
                          확인됨
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mockReservations.length === 0 && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
            <h2 className="text-3xl mb-4 font-bold">예약이 없습니다</h2>
            <p className="text-lg opacity-60">새로운 예약이 들어오면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
