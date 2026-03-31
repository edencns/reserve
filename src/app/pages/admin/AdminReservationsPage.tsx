import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { mockReservations, mockEvents } from '../../mockData';
import { Reservation } from '../../types';
import { Search, Download, X, ChevronDown } from 'lucide-react';

export default function AdminReservationsPage() {
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'checkedIn' | 'confirmed'>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all');

  const eventTitles = Array.from(new Set(mockReservations.map((r) => r.eventTitle)));

  const filtered = mockReservations.filter((r) => {
    if (filterStatus === 'checkedIn' && !r.checkedIn) return false;
    if (filterStatus === 'confirmed' && r.checkedIn) return false;
    if (filterEvent !== 'all' && r.eventTitle !== filterEvent) return false;
    return true;
  });

  function getFieldLabel(eventId: string, key: string): string {
    const event = mockEvents.find((e) => e.id === eventId);
    const field = event?.customFields.find((f) => f.key === key);
    return field?.label ?? key;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">예약</h1>
            <p className="text-base opacity-60">모든 예약 관리</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={() => setShowFilter((v) => !v)}>
              <Search className="w-4 h-4 mr-2" />
              필터
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
            </Button>
            <Button variant="solid" size="lg">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        {/* 필터 패널 */}
        {showFilter && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-5 mb-6 flex flex-wrap gap-6 items-end">
            <div>
              <p className="text-xs font-bold mb-2">상태</p>
              <div className="flex gap-2">
                {([['all', '전체'], ['checkedIn', '체크인'], ['confirmed', '확인됨']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilterStatus(val)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      filterStatus === val
                        ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                        : 'border-gray-300 hover:border-[var(--brand-dark)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold mb-2">이벤트</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterEvent('all')}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    filterEvent === 'all'
                      ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                      : 'border-gray-300 hover:border-[var(--brand-dark)]'
                  }`}
                >
                  전체
                </button>
                {eventTitles.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterEvent(t)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      filterEvent === t
                        ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                        : 'border-gray-300 hover:border-[var(--brand-dark)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {(filterStatus !== 'all' || filterEvent !== 'all') && (
              <button
                onClick={() => { setFilterStatus('all'); setFilterEvent('all'); }}
                className="text-xs text-red-500 hover:underline self-end pb-0.5"
              >
                초기화
              </button>
            )}
          </div>
        )}

        <div className="bg-white border-2 border-[var(--brand-dark)] overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[var(--brand-dark)]">
              <tr className="bg-[var(--brand-lime)]">
                <th className="px-6 py-4 text-left text-sm font-bold">고객</th>
                <th className="px-6 py-4 text-left text-sm font-bold">이벤트</th>
                <th className="px-6 py-4 text-left text-sm font-bold">날짜 & 시간</th>
                <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reservation) => (
                <tr
                  key={reservation.id}
                  onClick={() => setSelected(reservation)}
                  className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors cursor-pointer"
                >
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
                    {reservation.checkedIn ? (
                      <span className="px-3 py-1 bg-[#0F1F3D] text-[var(--brand-lime)] text-xs uppercase tracking-wider font-medium">
                        체크인
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[#A8C4DC] text-[var(--brand-dark)] text-xs uppercase tracking-wider font-medium">
                        확인됨
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm opacity-50">
                    해당하는 예약이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 예약 상세 팝업 */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 팝업 헤더 */}
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
                <h2 className="text-lg font-bold text-[var(--brand-dark)]">예약 상세</h2>
                <button onClick={() => setSelected(null)} className="p-1 hover:opacity-60">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* 상태 */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--brand-dark)] opacity-50 uppercase tracking-wider">상태</span>
                  {selected.checkedIn ? (
                    <span className="px-3 py-1 bg-[#0F1F3D] text-[var(--brand-lime)] text-xs font-medium">체크인</span>
                  ) : (
                    <span className="px-3 py-1 bg-[#A8C4DC] text-[var(--brand-dark)] text-xs font-medium">확인됨</span>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* 고객 정보 */}
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2">고객 정보</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-60">이름</span>
                      <span className="font-semibold">{selected.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">연락처</span>
                      <span>{selected.customer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">이메일</span>
                      <span>{selected.customer.email}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* 예약 정보 */}
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2">예약 정보</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-60">이벤트</span>
                      <span className="font-semibold text-right max-w-[60%]">{selected.eventTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">장소</span>
                      <span>{selected.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">날짜</span>
                      <span>{selected.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">시간</span>
                      <span>{selected.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">참석자</span>
                      <span>{selected.attendeeCount}명</span>
                    </div>
                  </div>
                </div>

                {/* 추가 입력 항목 */}
                {Object.keys(selected.extraFields).length > 0 && (
                  <>
                    <hr className="border-gray-100" />
                    <div>
                      <p className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2">추가 정보</p>
                      <div className="space-y-1.5 text-sm">
                        {Object.entries(selected.extraFields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="opacity-60">{getFieldLabel(selected.eventId, key)}</span>
                            <span className="text-right max-w-[60%]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 pb-5">
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
