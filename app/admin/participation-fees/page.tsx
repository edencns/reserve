'use client'
import { useState } from 'react';
import { mockVendors } from '../../../src/app/mockData';
import { Plus, Edit, X, Check } from 'lucide-react';

type PaymentMethod = '계좌이체' | '현금' | '카드';

interface FeeRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  businessNumber: string;
  amount: number;
  receivedDate: string;
  taxInvoiceIssued: boolean;
  taxInvoiceDate: string;
  taxInvoiceBusinessName: string;
  taxInvoiceBusinessNumber: string;
  taxInvoiceEmail: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

type FeeStatus = 'pending' | 'invoice_only' | 'payment_only' | 'completed';

function getFeeStatus(rec: FeeRecord): FeeStatus {
  const hasPay = !!rec.receivedDate;
  const hasInv = rec.taxInvoiceIssued;
  if (hasPay && hasInv) return 'completed';
  if (hasPay && !hasInv) return 'payment_only';
  if (!hasPay && hasInv) return 'invoice_only';
  return 'pending';
}

const TABS: { key: FeeStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'invoice_only', label: '입금 전 (계산서 발행 완료)' },
  { key: 'payment_only', label: '계산서 미발행 (입금 완료)' },
  { key: 'completed', label: '완료' },
];

const EMPTY_FORM: Omit<FeeRecord, 'id'> = {
  vendorId: '',
  vendorName: '',
  vendorCategory: '',
  businessNumber: '',
  amount: 0,
  receivedDate: '',
  taxInvoiceIssued: false,
  taxInvoiceDate: '',
  taxInvoiceBusinessName: '',
  taxInvoiceBusinessNumber: '',
  taxInvoiceEmail: '',
  paymentMethod: '계좌이체',
  notes: '',
};

const PAYMENT_METHODS: PaymentMethod[] = ['계좌이체', '현금', '카드'];

export default function AdminParticipationFeePage() {
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [activeTab, setActiveTab] = useState<FeeStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FeeRecord, 'id'>>(EMPTY_FORM);
  const [amountDisplay, setAmountDisplay] = useState('');

  const visibleRecords = activeTab === 'all'
    ? records
    : records.filter((r) => getFeeStatus(r) === activeTab);

  const totalAll = records.reduce((sum, r) => sum + r.amount, 0);
  const totalReceived = records.filter((r) => r.receivedDate).reduce((sum, r) => sum + r.amount, 0);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setAmountDisplay('');
    setModalOpen(true);
  }

  function openEdit(rec: FeeRecord) {
    setEditingId(rec.id);
    setForm({ ...rec });
    setAmountDisplay(rec.amount ? rec.amount.toLocaleString() : '');
    setModalOpen(true);
  }

  function handleVendorSelect(vendorId: string) {
    const vendor = mockVendors.find((v) => v.id === vendorId);
    if (vendor) {
      setForm((prev) => ({
        ...prev,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorCategory: vendor.category,
        businessNumber: vendor.businessNumber ?? '',
      }));
    }
  }

  function handleAmountChange(raw: string) {
    const digits = raw.replace(/,/g, '').replace(/\D/g, '');
    const num = digits ? Number(digits) : 0;
    setAmountDisplay(digits ? num.toLocaleString() : '');
    setForm((prev) => ({ ...prev, amount: num }));
  }

  function handleSave() {
    if (!form.vendorId) return;
    if (editingId) {
      setRecords((prev) => prev.map((r) => r.id === editingId ? { id: editingId, ...form } : r));
    } else {
      setRecords((prev) => [...prev, { id: `fee${Date.now()}`, ...form }]);
    }
    setModalOpen(false);
  }

  function setField<K extends keyof Omit<FeeRecord, 'id'>>(field: K, value: Omit<FeeRecord, 'id'>[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-baseline mb-8">
        <div>
          <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">참가비 내역</h1>
          <p className="text-base opacity-60">업체 참가비 수납 및 세금계산서 관리</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          내역 추가
        </button>
      </div>

      {/* 요약 통계 */}
      {records.length > 0 && (
        <div className="bg-white border-2 border-[var(--brand-dark)] p-5 mb-6 flex flex-wrap gap-8">
          <div>
            <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">총 건수</div>
            <div className="text-2xl font-bold text-[var(--brand-dark)]">{records.length}건</div>
          </div>
          <div>
            <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">총 금액 (입금 완료)</div>
            <div className="text-2xl font-bold text-[var(--brand-dark)]">{totalReceived.toLocaleString()}원</div>
            {totalAll !== totalReceived && (
              <div className="text-xs opacity-40 mt-0.5">전체 {totalAll.toLocaleString()}원</div>
            )}
          </div>
          <div>
            <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">세금계산서 발행</div>
            <div className="text-2xl font-bold text-[var(--brand-dark)]">
              {records.filter((r) => r.taxInvoiceIssued).length}건
            </div>
          </div>
          <div>
            <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">완료</div>
            <div className="text-2xl font-bold text-[var(--brand-dark)]">
              {records.filter((r) => getFeeStatus(r) === 'completed').length}건
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-0 border-b-2 border-[var(--brand-dark)] mb-0">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? records.length : records.filter((r) => getFeeStatus(r) === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-0.5 border-b-2 whitespace-nowrap ${
                activeTab === key
                  ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 테이블 */}
      <div className="bg-white border-2 border-t-0 border-[var(--brand-dark)] overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b-2 border-[var(--brand-dark)]">
            <tr className="bg-[var(--brand-lime)]">
              <th className="px-4 py-3 text-left text-xs font-bold">업체명</th>
              <th className="px-4 py-3 text-left text-xs font-bold">사업자번호</th>
              <th className="px-4 py-3 text-right text-xs font-bold">참가비</th>
              <th className="px-4 py-3 text-center text-xs font-bold">입금 상태</th>
              <th className="px-4 py-3 text-left text-xs font-bold">수납일</th>
              <th className="px-4 py-3 text-center text-xs font-bold">세금계산서</th>
              <th className="px-4 py-3 text-left text-xs font-bold">발행일</th>
              <th className="px-4 py-3 text-left text-xs font-bold">비고</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {visibleRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center text-sm opacity-40">
                  {activeTab === 'all' ? '등록된 참가비 내역이 없습니다' : '해당 조건의 내역이 없습니다'}
                </td>
              </tr>
            ) : (
              visibleRecords.map((rec) => (
                <tr key={rec.id} className="border-b border-[var(--brand-dark)]/10 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-[var(--brand-dark)]">{rec.vendorName}</div>
                    <div className="text-xs opacity-50">{rec.vendorCategory}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono opacity-60">{rec.businessNumber || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-[var(--brand-dark)]">
                    {rec.amount ? rec.amount.toLocaleString() + '원' : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {rec.receivedDate ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--brand-dark)] text-[var(--brand-lime)] font-medium">
                        <Check className="w-3 h-3" />
                        입금 완료
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 font-medium">미입금</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm opacity-70">{rec.receivedDate || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {rec.taxInvoiceIssued ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-[var(--brand-dark)] rounded-full">
                        <Check className="w-3 h-3 text-[var(--brand-lime)]" />
                      </span>
                    ) : (
                      <span className="text-xs opacity-30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm opacity-70">{rec.taxInvoiceDate || '—'}</td>
                  <td className="px-4 py-3 text-xs opacity-60 max-w-[120px] truncate">{rec.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(rec)} className="p-1.5 hover:bg-[var(--brand-accent)]/20 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 추가/수정 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)] flex-shrink-0">
              <h2 className="text-lg font-bold text-[var(--brand-dark)]">
                {editingId ? '내역 수정' : '참가비 내역 추가'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:opacity-60"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              {/* 업체 선택 */}
              <div>
                <label className="block text-sm font-bold mb-1">업체 <span className="text-red-500">*</span></label>
                <select
                  value={form.vendorId}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                >
                  <option value="">업체 선택</option>
                  {mockVendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>

              {/* 사업자번호 */}
              <div>
                <label className="block text-sm font-bold mb-1">사업자번호</label>
                <input
                  type="text"
                  value={form.businessNumber}
                  onChange={(e) => setField('businessNumber', e.target.value)}
                  placeholder="000-00-00000"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                />
              </div>

              {/* 참가비 */}
              <div>
                <label className="block text-sm font-bold mb-1">참가비 (원)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountDisplay}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)] pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-40">원</span>
                </div>
              </div>

              {/* 부가세 */}
              {(form.paymentMethod === '계좌이체' || form.paymentMethod === '카드') && form.amount > 0 && (
                <div className="bg-[var(--brand-lime)] border border-[var(--brand-dark)]/20 px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">참가비</span>
                    <span>{form.amount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">부가세 (10%)</span>
                    <span>{Math.round(form.amount * 0.1).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-[var(--brand-dark)]/20 pt-1.5">
                    <span>합계</span>
                    <span>{(form.amount + Math.round(form.amount * 0.1)).toLocaleString()}원</span>
                  </div>
                </div>
              )}

              {/* 수납일 */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  수납일 <span className="text-xs font-normal opacity-50">(입금 시 입력)</span>
                </label>
                <input
                  type="date"
                  value={form.receivedDate}
                  onChange={(e) => setField('receivedDate', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                />
              </div>

              {/* 결제 방법 */}
              <div>
                <label className="block text-sm font-bold mb-2">결제 방법</label>
                <div className="flex gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={form.paymentMethod === method}
                        onChange={() => setField('paymentMethod', method)}
                        className="accent-[var(--brand-dark)]"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              {/* 세금계산서 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.taxInvoiceIssued}
                    onChange={(e) => setField('taxInvoiceIssued', e.target.checked)}
                    className="accent-[var(--brand-dark)]"
                  />
                  세금계산서 발행
                </label>
              </div>

              {form.taxInvoiceIssued && (
                <div className="space-y-3 pl-4 border-l-2 border-[var(--brand-dark)]/20">
                  <div>
                    <label className="block text-sm font-bold mb-1">발행일</label>
                    <input type="date" value={form.taxInvoiceDate} onChange={(e) => setField('taxInvoiceDate', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">발행 상호명</label>
                    <input type="text" value={form.taxInvoiceBusinessName} onChange={(e) => setField('taxInvoiceBusinessName', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">발행 사업자번호</label>
                    <input type="text" value={form.taxInvoiceBusinessNumber} onChange={(e) => setField('taxInvoiceBusinessNumber', e.target.value)}
                      placeholder="000-00-00000"
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">발행 이메일</label>
                    <input type="email" value={form.taxInvoiceEmail} onChange={(e) => setField('taxInvoiceEmail', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]" />
                  </div>
                </div>
              )}

              {/* 비고 */}
              <div>
                <label className="block text-sm font-bold mb-1">비고</label>
                <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3}
                  placeholder="특이사항을 입력하세요"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)] resize-none" />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50 transition-colors">
                취소
              </button>
              <button onClick={handleSave} disabled={!form.vendorId}
                className="flex-1 py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40">
                {editingId ? '수정 완료' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
