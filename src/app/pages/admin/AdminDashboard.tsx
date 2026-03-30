import { AdminLayout } from '../../components/AdminLayout';
import { mockDashboardStats, mockEvents, mockReservations } from '../../mockData';
import { Calendar, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const activeEvents = mockEvents.filter((e) => e.status === 'active');
  const recentReservations = mockReservations.slice(0, 5);
  const todayCheckedIn = mockReservations.filter((r) => r.checkedIn).length;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-12">
          <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">대시보드</h1>
          <p className="text-base opacity-60">Aura Fairs 관리자에 오신 것을 환영합니다</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">오늘</div>
            </div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {mockDashboardStats.todayReservations}
            </div>
            <div className="text-sm opacity-60">오늘의 예약</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">체크인</div>
            </div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {todayCheckedIn}
            </div>
            <div className="text-sm opacity-60">오늘의 방문자</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">총계</div>
            </div>
            <div className="text-5xl font-bold text-[#0F1F3D] mb-3">
              {mockDashboardStats.totalReservations}
            </div>
            <div className="text-sm opacity-60">전체 예약</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[var(--brand-lime)]" />
              </div>
              <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-medium">매출</div>
            </div>
            <div className="text-4xl font-bold text-[#0F1F3D] mb-3">
              ₩{(mockDashboardStats.totalRevenue / 10000).toFixed(0)}만
            </div>
            <div className="text-sm opacity-60">총 매출</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Events */}
          <div className="bg-white border-2 border-[var(--brand-dark)]">
            <div className="px-6 py-5 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-2xl text-[var(--brand-dark)] font-bold">활성 이벤트</h2>
            </div>
            <div className="p-6">
              {activeEvents.length === 0 ? (
                <p className="text-center py-8 opacity-60">활성 이벤트가 없습니다</p>
              ) : (
                <div className="space-y-4">
                  {activeEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border-2 border-[var(--brand-dark)]/10 hover:border-[var(--brand-dark)] transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--brand-dark)] flex-shrink-0 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg mb-1 text-[var(--brand-dark)] font-semibold">{event.title}</h3>
                          <div className="text-sm opacity-60 mb-2">{event.venue}</div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0F1F3D] font-medium">
                            <Clock className="w-3 h-3" />
                            {event.dates[0]} - {event.dates[event.dates.length - 1]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Reservations */}
          <div className="bg-white border-2 border-[var(--brand-dark)]">
            <div className="px-6 py-5 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-2xl text-[var(--brand-dark)] font-bold">최근 예약</h2>
            </div>
            <div className="p-6">
              {recentReservations.length === 0 ? (
                <p className="text-center py-8 opacity-60">예약이 없습니다</p>
              ) : (
                <div className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-4 border-2 border-[var(--brand-dark)]/10 hover:border-[var(--brand-dark)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base text-[var(--brand-dark)]">{reservation.customer.name}</h3>
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
                      <div className="text-sm opacity-60 mb-2">{reservation.eventTitle}</div>
                      <div className="text-xs flex items-center gap-4 opacity-70">
                        <span>{reservation.date}</span>
                        <span>{reservation.time}</span>
                        <span className="font-semibold">{reservation.attendeeCount}명</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
