import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/AdminLayout';
import { mockDashboardStats, mockEvents, mockReservations } from '../../mockData';
import { Calendar, Users, TrendingUp, DollarSign, Clock, ChevronDown } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [filterEventId, setFilterEventId] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const activeEvents = mockEvents.filter((e) => e.status === 'active');
  const recentReservations = mockReservations.slice(0, 5);

  // 필터에 따른 통계 계산
  const today = new Date().toISOString().split('T')[0];
  const filteredRes = filterEventId === 'all'
    ? mockReservations
    : mockReservations.filter((r) => r.eventId === filterEventId);
  const selectedEvent = mockEvents.find((e) => e.id === filterEventId);

  const stats = {
    today: filterEventId === 'all'
      ? mockDashboardStats.todayReservations
      : filteredRes.filter((r) => r.date === today).length,
    checkedIn: filteredRes.filter((r) => r.checkedIn).length,
    total: filterEventId === 'all'
      ? mockDashboardStats.totalReservations
      : filteredRes.length,
    revenue: filterEventId === 'all' ? mockDashboardStats.totalRevenue : null,
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* 헤더 */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">대시보드</h1>
            <p className="text-base opacity-60">EDEN-Fair Link 관리자에 오신 것을 환영합니다</p>
          </div>
          {/* 행사 필터 */}
          <div className="relative mt-1">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
            >
              <span className="truncate text-left">{selectedEvent ? selectedEvent.title : '전체 (총계)'}</span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border-2 border-[var(--brand-dark)] z-20 min-w-[220px] shadow-lg">
                <button
                  onClick={() => { setFilterEventId('all'); setFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--brand-lime)] transition-colors ${filterEventId === 'all' ? 'font-bold bg-[var(--brand-lime)]' : ''}`}
                >
                  전체 (총계)
                </button>
                {mockEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => { setFilterEventId(event.id); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--brand-lime)] transition-colors border-t border-gray-100 break-keep ${filterEventId === event.id ? 'font-bold bg-[var(--brand-lime)]' : ''}`}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white border-2 border-[var(--brand-dark)] p-[22px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[var(--brand-lime)]" />
              </div>
              <div className="text-sm font-bold text-[#0F1F3D]">오늘</div>
            </div>
            <div className="text-4xl font-bold text-[#0F1F3D] mb-2">{stats.today}</div>
            <div className="text-xs opacity-60">오늘의 예약</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-[22px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <Users className="w-4 h-4 text-[var(--brand-lime)]" />
              </div>
              <div className="text-sm font-bold text-[#0F1F3D]">체크인</div>
            </div>
            <div className="text-4xl font-bold text-[#0F1F3D] mb-2">{stats.checkedIn}</div>
            <div className="text-xs opacity-60">오늘의 방문자</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-[22px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[var(--brand-lime)]" />
              </div>
              <div className="text-sm font-bold text-[#0F1F3D]">총계</div>
            </div>
            <div className="text-4xl font-bold text-[#0F1F3D] mb-2">{stats.total}</div>
            <div className="text-xs opacity-60">전체 예약</div>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-[22px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-dark)] flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[var(--brand-lime)]" />
              </div>
              <div className="text-sm font-bold text-[#0F1F3D]">매출</div>
            </div>
            <div className="text-3xl font-bold text-[#0F1F3D] mb-2">
              {stats.revenue !== null ? `${stats.revenue.toLocaleString()}원` : '—'}
            </div>
            <div className="text-xs opacity-60">총 매출</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 활성 이벤트 */}
          <div className="bg-white border-2 border-[var(--brand-dark)]">
            <div className="px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-xl text-[var(--brand-dark)] font-bold">활성 이벤트</h2>
            </div>
            <div className="p-5">
              {activeEvents.length === 0 ? (
                <p className="text-center py-8 opacity-60 text-sm">활성 이벤트가 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {activeEvents.map((event) => (
                    <div key={event.id} onClick={() => navigate('/admin/events')}
                      className="p-4 border-2 border-[var(--brand-dark)]/10 hover:border-[var(--brand-dark)] transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--brand-dark)] flex-shrink-0 overflow-hidden">
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1 text-[var(--brand-dark)] font-semibold break-keep">{event.title}</h3>
                          <div className="text-xs opacity-60 mb-1">{event.venue}</div>
                          <div className="flex items-center gap-1.5 text-xs text-[#0F1F3D] font-medium opacity-70">
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

          {/* 최근 예약 */}
          <div className="bg-white border-2 border-[var(--brand-dark)]">
            <div className="px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-xl text-[var(--brand-dark)] font-bold">최근 예약</h2>
            </div>
            <div className="p-5">
              {recentReservations.length === 0 ? (
                <p className="text-center py-8 opacity-60 text-sm">예약이 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {recentReservations.map((reservation) => (
                    <div key={reservation.id} onClick={() => navigate('/admin/reservations')}
                      className="p-4 border-2 border-[var(--brand-dark)]/10 hover:border-[var(--brand-dark)] transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-semibold text-sm text-[var(--brand-dark)]">{reservation.customer.name}</h3>
                        {reservation.checkedIn ? (
                          <span className="px-2 py-0.5 bg-[#0F1F3D] text-[var(--brand-lime)] text-xs font-medium">체크인</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#A8C4DC] text-[var(--brand-dark)] text-xs font-medium">확인됨</span>
                        )}
                      </div>
                      <div className="text-xs opacity-60 mb-1">{reservation.eventTitle}</div>
                      <div className="text-xs flex items-center gap-3 opacity-70">
                        <span>{reservation.date}</span>
                        <span>{reservation.time}</span>
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
