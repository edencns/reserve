'use client'
import { useState, useEffect } from 'react';
import { Eye, X, Filter, ChevronDown, Search, FileSpreadsheet } from 'lucide-react';

type DbContract = {
  id: string;
  event_id: string;
  event_title: string;
  customer_name: string;
  phone_last4: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
};

export default function AdminContractsPage() {
  const [uploads, setUploads] = useState<DbContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSearch, setFilterSearch] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState<string>('all');
  const [previewModal, setPreviewModal] = useState<DbContract | null>(null);

  useEffect(() => {
    fetch('/api/contracts')
      .then((r) => {
        if (!r.ok) throw new Error('데이터를 불러올 수 없습니다');
        return r.json();
      })
      .then((data) => { setUploads(Array.isArray(data) ? data : []); })
      .catch((e) => { setError(e.message); })
      .finally(() => setLoading(false));
  }, []);

  // 이벤트 탭 목록
  const eventOptions = Array.from(
    new Map(uploads.map((u) => [u.event_id, u.event_title])).entries()
  );

  // 탭 + 검색 필터
  const filtered = uploads.filter((u) => {
    if (activeEventTab !== 'all' && u.event_id !== activeEventTab) return false;
    if (filterSearch.trim()) {
      const q = filterSearch.trim();
      return u.customer_name.includes(q) || u.event_title.includes(q) || u.file_name.includes(q);
    }
    return true;
  });

  function exportToExcel() {
    const bom = '\uFEFF';
    const headers = ['행사', '고객명', '전화번호 끝자리', '파일명', '파일크기(KB)', '업로드일시'];
    const rows = filtered.map((u) => [
      u.event_title,
      u.customer_name,
      u.phone_last4,
      u.file_name,
      (u.file_size / 1024).toFixed(1),
      new Date(u.uploaded_at).toLocaleString('ko-KR'),
    ]);
    const csv = bom + [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `고객업로드계약서_${new Date().toLocaleDateString('ko-KR').replace(/\. /g, '').replace('.', '')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex justify-between items-baseline mb-8">
        <div>
          <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">계약서</h1>
          <p className="text-base opacity-60">고객 업로드 계약서 관리</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            엑셀 내보내기
          </button>
          <button
            onClick={() => setShowFilterPanel((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            필터
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilterPanel && (
        <div className="bg-white border-2 border-[var(--brand-dark)] p-4 mb-6 flex items-center gap-3">
          <Search className="w-4 h-4 opacity-40 flex-shrink-0" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="고객명, 행사명, 파일명 검색"
            className="flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
          />
          {filterSearch && (
            <button onClick={() => setFilterSearch('')} className="opacity-40 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 행사 탭 */}
      <div className="flex flex-wrap border-b-2 border-[var(--brand-dark)] mb-6">
        <button
          onClick={() => setActiveEventTab('all')}
          className={`px-4 py-2.5 text-sm font-medium -mb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeEventTab === 'all'
              ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
              : 'border-transparent opacity-50 hover:opacity-80'
          }`}
        >
          전체
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeEventTab === 'all' ? 'bg-[var(--brand-dark)] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {uploads.length}
          </span>
        </button>
        {eventOptions.map(([eventId, eventTitle]) => {
          const count = uploads.filter((u) => u.event_id === eventId).length;
          return (
            <button
              key={eventId}
              onClick={() => setActiveEventTab(eventId)}
              className={`px-4 py-2.5 text-sm font-medium -mb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeEventTab === eventId
                  ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <span className="break-keep">{eventTitle}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeEventTab === eventId ? 'bg-[var(--brand-dark)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 업로드 테이블 */}
      <div className="bg-white border-2 border-[var(--brand-dark)] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b-2 border-[var(--brand-dark)]">
            <tr className="bg-[var(--brand-lime)]">
              <th className="px-4 py-3 text-left text-sm font-bold">고객명</th>
              <th className="px-4 py-3 text-left text-sm font-bold">행사</th>
              <th className="px-4 py-3 text-left text-sm font-bold">파일명</th>
              <th className="px-4 py-3 text-left text-sm font-bold">파일크기</th>
              <th className="px-4 py-3 text-left text-sm font-bold">업로드일시</th>
              <th className="px-4 py-3 text-center text-sm font-bold">액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm opacity-40">불러오는 중...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm text-red-500">{error}</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm opacity-40">
                  {filterSearch ? '검색 결과가 없습니다' : '업로드된 계약서가 없습니다'}
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--brand-dark)]">{u.customer_name}</div>
                    <div className="text-xs opacity-50">전화번호 끝 {u.phone_last4}</div>
                  </td>
                  <td className="px-4 py-3 text-sm break-keep">{u.event_title}</td>
                  <td className="px-4 py-3 text-sm opacity-70 break-all max-w-[200px]">{u.file_name}</td>
                  <td className="px-4 py-3 text-xs opacity-60 whitespace-nowrap">{(u.file_size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3 text-xs opacity-60 whitespace-nowrap">
                    {new Date(u.uploaded_at).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setPreviewModal(u)}
                        className="p-1.5 hover:bg-[var(--brand-accent)]/20 transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 상세보기 모달 */}
      {previewModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)] flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-[var(--brand-dark)]">계약서 상세</h2>
                <p className="text-xs opacity-60 mt-0.5">{previewModal.customer_name} · {previewModal.event_title}</p>
              </div>
              <button onClick={() => setPreviewModal(null)} className="p-1 hover:opacity-60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {([
                  ['행사', previewModal.event_title],
                  ['고객명', previewModal.customer_name],
                  ['전화번호 끝자리', previewModal.phone_last4],
                  ['파일명', previewModal.file_name],
                  ['파일크기', `${(previewModal.file_size / 1024).toFixed(1)} KB`],
                  ['업로드일시', new Date(previewModal.uploaded_at).toLocaleString('ko-KR')],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs opacity-50 mb-0.5">{label}</div>
                    <div className="font-medium break-all">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
