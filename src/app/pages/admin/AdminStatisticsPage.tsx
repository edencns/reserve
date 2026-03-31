import { AdminLayout } from '../../components/AdminLayout';
import { mockReservations, mockEvents } from '../../mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminStatisticsPage() {
  // Prepare data for charts
  const eventStats = mockEvents.map((event) => {
    const reservations = mockReservations.filter((r) => r.eventId === event.id);
    const checkedIn = reservations.filter((r) => r.checkedIn).length;
    return {
      name: event.title.replace(' 입주박람회', ''),
      total: reservations.length,
      checkedIn,
    };
  });

  const statusData = [
    {
      name: '예약 확정',
      value: mockReservations.filter((r) => !r.checkedIn).length,
    },
    {
      name: '체크인 완료',
      value: mockReservations.filter((r) => r.checkedIn).length,
    },
  ];

  const COLORS = ['#0F1F3D', '#A8C4DC'];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">통계</h1>
          <p className="text-base opacity-60">분석 및 인사이트</p>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-[var(--brand-dark)] p-8">
            <div className="text-base font-semibold mb-4 opacity-70">평균 참석자</div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {(mockReservations.reduce((acc, r) => acc + r.attendeeCount, 0) / mockReservations.length).toFixed(1)}
            </div>
            <div className="text-sm opacity-60">예약 당 인원 수</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-8">
            <div className="text-base font-semibold mb-4 opacity-70">체크인율</div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {((mockReservations.filter((r) => r.checkedIn).length / mockReservations.length) * 100).toFixed(0)}%
            </div>
            <div className="text-sm opacity-60">
              <span className="font-semibold">
                {mockReservations.filter((r) => r.checkedIn).length}
              </span>
              {' / '}
              <span className="font-semibold">
                {mockReservations.length}
              </span>
              {' '}예약
            </div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-8">
            <div className="text-base font-semibold mb-4 opacity-70">활성 이벤트</div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {mockEvents.filter((e) => e.status === 'active').length}
            </div>
            <div className="text-sm opacity-60">진행 중인 박람회</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white border-2 border-[var(--brand-dark)] p-8">
            <h2 className="text-2xl mb-6 text-[var(--brand-dark)] font-bold">이벤트별 예약 현황</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={eventStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF4" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fontFamily: 'Noto Serif KR, serif', fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fontFamily: 'Noto Serif KR, serif', fontWeight: 600 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    border: '2px solid #0F1F3D',
                    borderRadius: 0,
                    fontFamily: 'Noto Serif KR, serif',
                    fontWeight: 600
                  }}
                />
                <Bar dataKey="total" fill="#0F1F3D" name="총 예약" />
                <Bar dataKey="checkedIn" fill="#6B8FB1" name="체크인" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#0F1F3D]" />
                <span className="text-sm font-medium">총 예약</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#6B8FB1]" />
                <span className="text-sm font-medium">체크인 완료</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white border-2 border-[var(--brand-dark)] p-8">
            <h2 className="text-2xl mb-6 text-[var(--brand-dark)] font-bold">전체 예약 상태</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 600 }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    border: '2px solid #0F1F3D',
                    borderRadius: 0,
                    fontFamily: 'Noto Serif KR, serif',
                    fontWeight: 600
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#0F1F3D]" />
                <span className="text-sm font-medium">예약 확정</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#A8C4DC]" />
                <span className="text-sm font-medium">체크인 완료</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}