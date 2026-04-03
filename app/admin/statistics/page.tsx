'use client'
import { useState } from 'react';
import { mockReservations, mockEvents, contractUploads } from '../../../src/app/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#0F1F3D', '#6B8FB1', '#A8C4DC', '#3B5998', '#8BABC4', '#1A3A5C', '#B0C4DE', '#4A6FA5'];

export default function AdminStatisticsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('all');

  const filteredEvents = mockEvents.filter((e) => e.status !== 'draft');

  // 필터에 따른 데이터
  const reservations = selectedEventId === 'all'
    ? mockReservations
    : mockReservations.filter((r) => r.eventId === selectedEventId);

  const uploads = selectedEventId === 'all'
    ? contractUploads
    : contractUploads.filter((u) => u.eventId === selectedEventId);

  // ── KPI ──
  const totalReservations = reservations.length;
  const checkedInCount = reservations.filter((r) => r.checkedIn).length;
  const checkInRate = totalReservations > 0 ? Math.round((checkedInCount / totalReservations) * 100) : 0;
  const totalUploads = uploads.length;

  const activeEvents = selectedEventId === 'all'
    ? mockEvents.filter((e) => e.status === 'active').length
    : (mockEvents.find((e) => e.id === selectedEventId)?.status === 'active' ? 1 : 0);

  // ── 행사별 성과 비교 (전체일 때만) ──
  const eventPerformance = filteredEvents
    .map((event) => {
      const res = mockReservations.filter((r) => r.eventId === event.id);
      const upl = contractUploads.filter((u) => u.eventId === event.id);
      return {
        name: event.title.replace(' 입주박람회', ''),
        예약: res.length,
        체크인: res.filter((r) => r.checkedIn).length,
        계약서: upl.length,
      };
    })
    .filter((d) => d.예약 > 0 || d.계약서 > 0);

  // ── 관심 서비스 순위 ──
  const interestCounts: Record<string, number> = {};
  reservations.forEach((r) => {
    const interests = r.extraFields?.interests;
    if (interests) {
      interests.split(',').forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) {
          interestCounts[trimmed] = (interestCounts[trimmed] || 0) + 1;
        }
      });
    }
  });
  const interestData = Object.entries(interestCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const hasData = totalReservations > 0 || totalUploads > 0;

  const selectedEventName = selectedEventId === 'all'
    ? '전체'
    : mockEvents.find((e) => e.id === selectedEventId)?.title.replace(' 입주박람회', '') ?? '';

  return (
    <div className="p-8">
      {/* 헤더 + 필터 */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">통계</h1>
          <p className="text-base opacity-60">
            {selectedEventId === 'all' ? '전체 행사 통계' : `${selectedEventName} 통계`}
          </p>
        </div>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="border-2 border-[var(--brand-dark)] bg-white px-4 py-2.5 text-sm font-medium outline-none cursor-pointer"
          style={{ minWidth: '200px' }}
        >
          <option value="all">전체 행사</option>
          {filteredEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title.replace(' 입주박람회', '')}
            </option>
          ))}
        </select>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {([
          { label: '총 예약', value: totalReservations, unit: '건', sub: selectedEventId === 'all' ? '전체 행사 누적' : selectedEventName },
          { label: '체크인율', value: `${checkInRate}%`, unit: '', sub: `${checkedInCount} / ${totalReservations} 예약` },
          { label: '계약서 접수', value: totalUploads, unit: '건', sub: '고객 업로드' },
          { label: '진행 중 행사', value: activeEvents, unit: '개', sub: selectedEventId === 'all' ? `전체 ${mockEvents.length}개 중` : '' },
        ] as const).map(({ label, value, unit, sub }) => (
          <div key={label} className="bg-white border-2 border-[var(--brand-dark)] p-6">
            <div className="text-sm font-semibold opacity-60 mb-3">{label}</div>
            <div className="text-4xl font-bold text-[#0F1F3D] mb-1.5">
              {value}<span className="text-lg font-medium opacity-50 ml-1">{unit}</span>
            </div>
            <div className="text-xs opacity-50">{sub}</div>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
          <div className="text-5xl opacity-10 mb-6">📊</div>
          <h2 className="text-xl font-bold text-[var(--brand-dark)] mb-2">데이터가 아직 없습니다</h2>
          <p className="text-sm opacity-50">예약이나 계약서 업로드가 쌓이면 여기에 분석 차트가 표시됩니다.</p>
        </div>
      ) : (
        <>
          {/* 행사별 성과 비교 (전체일 때만) */}
          {selectedEventId === 'all' && eventPerformance.length > 0 && (
            <div className="bg-white border-2 border-[var(--brand-dark)] p-8 mb-8">
              <h2 className="text-xl font-bold text-[var(--brand-dark)] mb-2">행사별 성과 비교</h2>
              <p className="text-xs opacity-50 mb-6">예약 수 / 체크인 수 / 계약서 업로드 수를 행사별로 비교합니다</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventPerformance} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF4" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ border: '2px solid #0F1F3D', borderRadius: 0, fontSize: 13 }}
                  />
                  <Bar dataKey="예약" fill="#0F1F3D" />
                  <Bar dataKey="체크인" fill="#6B8FB1" />
                  <Bar dataKey="계약서" fill="#A8C4DC" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4">
                {([['#0F1F3D', '예약'], ['#6B8FB1', '체크인'], ['#A8C4DC', '계약서']] as const).map(([color, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-4 h-4" style={{ backgroundColor: color }} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 관심 서비스 순위 */}
          {interestData.length > 0 && (
            <div className="bg-white border-2 border-[var(--brand-dark)] p-8">
              <h2 className="text-xl font-bold text-[var(--brand-dark)] mb-2">관심 서비스 순위</h2>
              <p className="text-xs opacity-50 mb-6">
                {selectedEventId === 'all' ? '전체 행사에서 고객이 선택한 관심 업종' : `${selectedEventName} 고객이 선택한 관심 업종`}
              </p>
              <ResponsiveContainer width="100%" height={Math.max(200, interestData.length * 48)}>
                <BarChart data={interestData} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF4" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 13 }}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip contentStyle={{ border: '2px solid #0F1F3D', borderRadius: 0, fontSize: 13 }} />
                  <Bar dataKey="count" name="선택 횟수">
                    {interestData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {interestData.length === 0 && (
            <div className="bg-white border-2 border-[var(--brand-dark)] p-8 flex items-center justify-center">
              <p className="text-sm opacity-40 text-center">관심 서비스 데이터가 쌓이면<br />인기 업종 순위가 표시됩니다</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
