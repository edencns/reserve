import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { mockContracts, mockEvents, contractUploads, completedEventIds, markEventCompleted, unmarkEventCompleted } from '../../mockData';
import { VendorContract } from '../../types';
import { Plus, Eye, Download, X, Check, Filter, ChevronDown, Upload, Search } from 'lucide-react';

type NewContractForm = {
  vendorName: string;
  vendorCategory: string;
  eventId: string;
  unitNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: string;
  depositAmount: string;
  paymentMethod: string;
  contractDate: string;
  notes: string;
};

const EMPTY_FORM: NewContractForm = {
  vendorName: '', vendorCategory: '', eventId: '',
  unitNumber: '', customerName: '', customerPhone: '',
  totalAmount: '', depositAmount: '', paymentMethod: '계좌이체',
  contractDate: '', notes: '',
};

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<VendorContract[]>(mockContracts);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(completedEventIds));
  const [activeEventTab, setActiveEventTab] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [detailModal, setDetailModal] = useState<VendorContract | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState<NewContractForm>(EMPTY_FORM);

  // 행사 탭 목록: 완료된 행사 숨김/표시 처리
  const allEventIds = Array.from(new Set(contracts.map((c) => c.eventId)));
  const visibleEventIds = showCompleted ? allEventIds : allEventIds.filter((id) => !completedIds.has(id));

  // 탭에 쓸 이벤트 메타
  function getEventTitle(eventId: string) {
    return contracts.find((c) => c.eventId === eventId)?.eventTitle ?? eventId;
  }

  // 현재 탭의 계약서 필터
  const tabContracts = contracts.filter((c) => {
    if (activeEventTab !== 'all' && c.eventId !== activeEventTab) return false;
    if (!showCompleted && completedIds.has(c.eventId)) return false;
    return true;
  });

  // 검색 필터 (이름, 업체, 동호수)
  const filteredContracts = filterSearch.trim()
    ? tabContracts.filter((c) =>
        c.customerName.includes(filterSearch) ||
        c.vendorName.includes(filterSearch) ||
        c.unitNumber.includes(filterSearch)
      )
    : tabContracts;

  // 업로드된 계약서 (현재 탭 기준)
  const tabUploads = contractUploads.filter((u) =>
    activeEventTab === 'all' ? true : u.eventId === activeEventTab
  );

  function toggleEventCompleted(eventId: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
        unmarkEventCompleted(eventId);
      } else {
        next.add(eventId);
        markEventCompleted(eventId);
        if (activeEventTab === eventId) setActiveEventTab('all');
      }
      return next;
    });
  }

  function handleSave() {
    if (!form.vendorName || !form.customerName || !form.eventId) return;
    const event = mockEvents.find((e) => e.id === form.eventId);
    const newContract: VendorContract = {
      id: `c${Date.now()}`,
      vendorId: '',
      vendorName: form.vendorName,
      vendorCategory: form.vendorCategory,
      eventId: form.eventId,
      eventTitle: event?.title ?? '',
      unitNumber: form.unitNumber,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      items: [],
      totalAmount: Number(form.totalAmount) || 0,
      depositAmount: Number(form.depositAmount) || 0,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      contractDate: form.contractDate,
      type: 'upload',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContracts((prev) => [...prev, newContract]);
    setAddModal(false);
    setForm(EMPTY_FORM);
  }

  function setField(field: keyof NewContractForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* 헤더 */}
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">계약서</h1>
            <p className="text-base opacity-60">업체 계약 관리</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilterPanel((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              필터
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => { setAddModal(true); setForm(EMPTY_FORM); }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              새 계약서
            </button>
          </div>
        </div>

        {/* 필터 패널 */}
        {showFilterPanel && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-5 mb-6 space-y-4">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 opacity-40" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="고객명, 업체명, 동호수 검색"
                className="flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
              />
              {filterSearch && (
                <button onClick={() => setFilterSearch('')} className="opacity-40 hover:opacity-80">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="accent-[var(--brand-dark)]"
                />
                완료된 행사 포함해서 보기
              </label>
            </div>
          </div>
        )}

        {/* 행사 탭 */}
        <div className="flex flex-wrap gap-0 mb-0 border-b-2 border-[var(--brand-dark)]">
          <button
            onClick={() => setActiveEventTab('all')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-0.5 border-b-2 ${
              activeEventTab === 'all'
                ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            전체
            <span className="ml-1.5 text-xs opacity-60">({filteredContracts.length + (activeEventTab === 'all' ? 0 : tabContracts.length - filteredContracts.length)})</span>
          </button>
          {visibleEventIds.map((eventId) => {
            const count = contracts.filter((c) => c.eventId === eventId).length;
            const isDone = completedIds.has(eventId);
            return (
              <button
                key={eventId}
                onClick={() => setActiveEventTab(eventId)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-0.5 border-b-2 flex items-center gap-1.5 ${
                  activeEventTab === eventId
                    ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <span className="break-keep">{getEventTitle(eventId)}</span>
                <span className="text-xs opacity-50">({count})</span>
                {isDone && <span className="text-xs bg-gray-200 text-gray-500 px-1 rounded">완료</span>}
              </button>
            );
          })}
        </div>

        {/* 행사 완료 처리 버튼 (특정 탭 선택 시) */}
        {activeEventTab !== 'all' && (
          <div className="flex justify-end pt-3 pb-2">
            <button
              onClick={() => toggleEventCompleted(activeEventTab)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border transition-colors ${
                completedIds.has(activeEventTab)
                  ? 'border-gray-300 text-gray-500 hover:bg-gray-50'
                  : 'border-[var(--brand-dark)] text-[var(--brand-dark)] hover:bg-[var(--brand-lime)]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {completedIds.has(activeEventTab) ? '완료 취소' : '이 행사 완료 처리'}
            </button>
          </div>
        )}

        {/* 계약서 테이블 */}
        <div className="bg-white border-2 border-[var(--brand-dark)] overflow-x-auto mt-2">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[var(--brand-dark)]">
              <tr className="bg-[var(--brand-lime)]">
                <th className="px-4 py-3 text-left text-sm font-bold">고객</th>
                <th className="px-4 py-3 text-left text-sm font-bold">행사</th>
                <th className="px-4 py-3 text-left text-sm font-bold">업체</th>
                <th className="px-4 py-3 text-right text-sm font-bold">금액</th>
                <th className="px-4 py-3 text-center text-sm font-bold">유형</th>
                <th className="px-4 py-3 text-center text-sm font-bold">상태</th>
                <th className="px-4 py-3 text-left text-sm font-bold">액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm opacity-40">
                    {filterSearch ? '검색 결과가 없습니다' : '계약서가 없습니다'}
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--brand-dark)]">{contract.customerName}</div>
                      <div className="text-xs opacity-60">{contract.unitNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-sm break-keep">{contract.eventTitle}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{contract.vendorName}</div>
                      <div className="text-xs opacity-50">{contract.vendorCategory}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-base font-bold text-[#0F1F3D]">{contract.totalAmount.toLocaleString()}원</div>
                      <div className="text-xs opacity-60">예치금 {contract.depositAmount.toLocaleString()}원</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-0.5 bg-[var(--brand-lime)] font-medium">
                        {contract.type === 'electronic' ? '전자' : '업로드'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setContracts((prev) =>
                            prev.map((c) => c.id === contract.id
                              ? { ...c, status: c.status === 'completed' ? 'draft' : 'completed', updatedAt: new Date().toISOString() }
                              : c
                            )
                          );
                        }}
                        className={`px-3 py-1 text-xs uppercase tracking-wider font-medium transition-colors ${
                          contract.status === 'completed'
                            ? 'bg-[var(--brand-dark)] text-[var(--brand-lime)]'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {contract.status === 'completed' ? '완료' : '진행중'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setDetailModal(contract)}
                          className="p-1.5 hover:bg-[var(--brand-accent)]/20 transition-colors"
                          title="상세 보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-[var(--brand-accent)]/20 transition-colors"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 고객 업로드 계약서 섹션 */}
        {tabUploads.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[var(--brand-dark)] mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              고객 업로드 계약서
              <span className="text-sm opacity-50 font-normal">({tabUploads.length}건)</span>
            </h2>
            <div className="bg-white border-2 border-[var(--brand-dark)] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b-2 border-[var(--brand-dark)]">
                  <tr className="bg-[var(--brand-lime)]">
                    <th className="px-4 py-3 text-left text-sm font-bold">행사</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">고객명</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">파일명</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">업로드일시</th>
                    <th className="px-4 py-3 text-center text-sm font-bold">보기</th>
                  </tr>
                </thead>
                <tbody>
                  {tabUploads.map((u) => (
                    <tr key={u.token} className="border-b border-[var(--brand-dark)]/10">
                      <td className="px-4 py-3 text-sm break-keep">{u.eventTitle}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold">{u.customerName}</div>
                        <div className="text-xs opacity-50">끝자리 {u.phoneLast4}</div>
                      </td>
                      <td className="px-4 py-3 text-sm opacity-70">{u.fileName}</td>
                      <td className="px-4 py-3 text-xs opacity-60">{new Date(u.uploadedAt).toLocaleString('ko-KR')}</td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={u.fileDataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--brand-dark)] text-white hover:opacity-80"
                        >
                          <Eye className="w-3 h-3" />
                          보기
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 계약서 상세 모달 */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-base font-bold text-[var(--brand-dark)]">계약서 상세</h2>
              <button onClick={() => setDetailModal(null)} className="p-1 hover:opacity-60"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              {[
                ['행사', detailModal.eventTitle],
                ['고객명', detailModal.customerName],
                ['연락처', detailModal.customerPhone],
                ['동호수', detailModal.unitNumber],
                ['업체', `${detailModal.vendorName} (${detailModal.vendorCategory})`],
                ['계약일', detailModal.contractDate],
                ['결제방법', detailModal.paymentMethod],
                ['총 금액', `${detailModal.totalAmount.toLocaleString()}원`],
                ['예치금', `${detailModal.depositAmount.toLocaleString()}원`],
                ['비고', detailModal.notes || '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="opacity-50 flex-shrink-0">{label}</span>
                  <span className="font-medium text-right break-keep">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => setDetailModal(null)} className="w-full py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 새 계약서 모달 */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAddModal(false)}>
          <div className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)] flex-shrink-0">
              <h2 className="text-lg font-bold text-[var(--brand-dark)]">새 계약서</h2>
              <button onClick={() => setAddModal(false)} className="p-1 hover:opacity-60"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              {/* 행사 선택 */}
              <div>
                <label className="block text-sm font-bold mb-1">행사 <span className="text-red-500">*</span></label>
                <select value={form.eventId} onChange={(e) => setField('eventId', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]">
                  <option value="">행사 선택</option>
                  {mockEvents.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              {([
                ['customerName', '고객명', true],
                ['customerPhone', '고객 연락처', false],
                ['unitNumber', '동호수', false],
                ['vendorName', '업체명', true],
                ['vendorCategory', '업체 카테고리', false],
                ['contractDate', '계약일', false],
                ['totalAmount', '총 금액 (원)', false],
                ['depositAmount', '예치금 (원)', false],
              ] as [keyof NewContractForm, string, boolean][]).map(([field, label, required]) => (
                <div key={field}>
                  <label className="block text-sm font-bold mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
                  <input type={field.includes('Date') ? 'date' : field.includes('Amount') ? 'number' : 'text'}
                    value={form[field]} onChange={(e) => setField(field, e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold mb-2">결제 방법</label>
                <div className="flex gap-4">
                  {['계좌이체', '현금', '카드'].map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="paymentMethod" checked={form.paymentMethod === m}
                        onChange={() => setField('paymentMethod', m)} className="accent-[var(--brand-dark)]" />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">비고</label>
                <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)}
                  rows={3} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setAddModal(false)}
                className="flex-1 py-2.5 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={!form.vendorName || !form.customerName || !form.eventId}
                className="flex-1 py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40">저장</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
