import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { contractUploads } from '../../mockData';
import { ContractUpload } from '../../types';
import { Eye, Download, X, Filter, ChevronDown, Search, FileSpreadsheet } from 'lucide-react';

export default function AdminContractsPage() {
  const [uploads, setUploads] = useState<ContractUpload[]>([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState<string>('all');
  const [previewModal, setPreviewModal] = useState<ContractUpload | null>(null);

  // 페이지 진입 시마다 최신 데이터 반영
  useEffect(() => {
    setUploads([...contractUploads]);
  }, []);

  // 이벤트 탭 목록
  const eventOptions = Array.from(
    new Map(uploads.map((u) => [u.eventId, u.eventTitle])).entries()
  );

  // 탭 + 검색 필터
  const filtered = uploads.filter((u) => {
    if (activeEventTab !== 'all' && u.eventId !== activeEventTab) return false;
    if (filterSearch.trim()) {
      const q = filterSearch.trim();
      return u.customerName.includes(q) || u.eventTitle.includes(q) || u.fileName.includes(q);
    }
    return true;
  });

  function exportToExcel() {
    const bom = '\uFEFF';
    const headers = ['행사', '고객명', '전화번호 끝자리', '파일명', '파일크기(KB)', '업로드일시'];
    const rows = filtered.map((u) => [
      u.eventTitle,
      u.customerName,
      u.phoneLast4,
      u.fileName,
      (u.fileSize / 1024).toFixed(1),
      new Date(u.uploadedAt).toLocaleString('ko-KR'),
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
    <AdminLayout>
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
            const count = uploads.filter((u) => u.eventId === eventId).length;
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm opacity-40">
                    {filterSearch ? '검색 결과가 없습니다' : '업로드된 계약서가 없습니다'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--brand-dark)]">{u.customerName}</div>
                      <div className="text-xs opacity-50">전화번호 끝 {u.phoneLast4}</div>
                    </td>
                    <td className="px-4 py-3 text-sm break-keep">{u.eventTitle}</td>
                    <td className="px-4 py-3 text-sm opacity-70 break-all max-w-[200px]">{u.fileName}</td>
                    <td className="px-4 py-3 text-xs opacity-60 whitespace-nowrap">{(u.fileSize / 1024).toFixed(1)} KB</td>
                    <td className="px-4 py-3 text-xs opacity-60 whitespace-nowrap">
                      {new Date(u.uploadedAt).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPreviewModal(u)}
                          className="p-1.5 hover:bg-[var(--brand-accent)]/20 transition-colors"
                          title="미리보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={u.fileDataUrl}
                          download={u.fileName}
                          className="p-1.5 hover:bg-[var(--brand-accent)]/20 transition-colors inline-flex"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 파일 미리보기 모달 */}
      {previewModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)] flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-[var(--brand-dark)]">업로드된 계약서</h2>
                <p className="text-xs opacity-60 mt-0.5">{previewModal.customerName} · {previewModal.eventTitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewModal.fileDataUrl}
                  download={previewModal.fileName}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--brand-dark)] text-xs font-medium hover:bg-white/50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  다운로드
                </a>
                <button onClick={() => setPreviewModal(null)} className="p-1 hover:opacity-60">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* 메타 정보 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm bg-gray-50 p-4">
                {([
                  ['행사', previewModal.eventTitle],
                  ['고객명', previewModal.customerName],
                  ['전화번호 끝자리', previewModal.phoneLast4],
                  ['파일명', previewModal.fileName],
                  ['파일크기', `${(previewModal.fileSize / 1024).toFixed(1)} KB`],
                  ['업로드일시', new Date(previewModal.uploadedAt).toLocaleString('ko-KR')],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <span className="opacity-50 flex-shrink-0">{label}</span>
                    <span className="font-medium break-all">{value}</span>
                  </div>
                ))}
              </div>

              {/* 파일 미리보기 */}
              <div>
                <div className="text-xs font-bold opacity-50 mb-2 uppercase tracking-wider">파일 미리보기</div>
                {previewModal.mimeType.startsWith('image/') ? (
                  <img src={previewModal.fileDataUrl} alt="계약서" className="w-full border border-gray-200" />
                ) : previewModal.mimeType === 'application/pdf' ? (
                  <iframe
                    src={previewModal.fileDataUrl}
                    title="계약서"
                    sandbox="allow-same-origin"
                    className="w-full border border-gray-200"
                    style={{ height: '520px' }}
                  />
                ) : (
                  <p className="text-sm opacity-50">미리보기를 지원하지 않는 파일 형식입니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
