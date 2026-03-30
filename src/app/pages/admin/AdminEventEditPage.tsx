import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Trash2, Tag, Plus } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { mockEvents, mockVendors } from '../../mockData';

const PRESET_CATEGORIES = [
  '가구', '방충망', '에어컨/냉난방', '입주청소', '이사', '인테리어',
  '전동커튼/블라인드', '조명', '보안/방범', '주방기기', '욕실/위생', '홈네트워크', '기타',
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];

export default function AdminEventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const event = mockEvents.find((e) => e.id === id);

  const initialCategories = event?.vendorCategories?.map((c) => c.name) ??
    (event?.customFields.find((f) => f.key === 'interests')?.options ?? []);

  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [venue, setVenue] = useState(event?.venue ?? '');
  const [address, setAddress] = useState(event?.address ?? '');
  const [status, setStatus] = useState<'draft' | 'active' | 'closed'>(event?.status ?? 'draft');
  const [bannerPreview, setBannerPreview] = useState<string>(event?.imageUrl ?? '');
  const [startHour, setStartHour] = useState(event?.startTime?.split(':')[0] ?? '10');
  const [startMin, setStartMin] = useState(event?.startTime?.split(':')[1] ?? '00');
  const [endHour, setEndHour] = useState(event?.endTime?.split(':')[0] ?? '18');
  const [endMin, setEndMin] = useState(event?.endTime?.split(':')[1] ?? '00');

  const sortedDates = event?.dates ? [...event.dates].sort() : [];
  const [startDate, setStartDate] = useState(sortedDates[0] ?? '');
  const [endDate, setEndDate] = useState(sortedDates[sortedDates.length - 1] ?? '');

  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>(
    event?.vendors?.map((v) => v.id) ?? []
  );
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [showVendorPanel, setShowVendorPanel] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [vendorTabCategory, setVendorTabCategory] = useState<string>('전체');

  const totalDays = startDate && endDate
    ? Math.max(0, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1)
    : 0;

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  }

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function addCustomCategory() {
    const trimmed = customCategoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
    setCustomCategoryInput('');
  }

  function removeCategory(cat: string) {
    setCategories((prev) => prev.filter((c) => c !== cat));
    const vendorIdsInCat = mockVendors.filter((v) => v.category === cat).map((v) => v.id);
    setSelectedVendorIds((prev) => prev.filter((id) => !vendorIdsInCat.includes(id)));
  }

  function toggleVendor(id: string) {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  const vendorTabList = ['전체', ...categories];
  const filteredVendors = mockVendors.filter((v) =>
    vendorTabCategory === '전체' ? categories.includes(v.category) : v.category === vendorTabCategory
  );

  if (!event) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="opacity-60">이벤트를 찾을 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate('/admin/events')}
            className="p-1 hover:bg-[var(--brand-accent)]/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-[var(--brand-dark)]">행사 수정</h1>
        </div>

        {/* 기본 정보 */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[var(--brand-dark)] border-b border-gray-200 pb-2 mb-6">기본 정보</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                행사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">배너 이미지</label>
              {bannerPreview && (
                <div className="mb-2 w-full h-40 overflow-hidden border border-gray-200">
                  <img src={bannerPreview} alt="배너 미리보기" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
              >
                파일 선택
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">행사 안내</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                장소명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">주소</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">행사 진행 시간</label>
              <div className="flex items-center gap-2 text-sm">
                <span className="opacity-60">시작</span>
                <select value={startHour} onChange={(e) => setStartHour(e.target.value)}
                  className="border border-gray-300 px-2 py-1 focus:outline-none">
                  {HOURS.map((h) => <option key={h}>{h}</option>)}
                </select>
                <span>:</span>
                <select value={startMin} onChange={(e) => setStartMin(e.target.value)}
                  className="border border-gray-300 px-2 py-1 focus:outline-none">
                  {MINUTES.map((m) => <option key={m}>{m}</option>)}
                </select>
                <span className="mx-2 opacity-40">~</span>
                <span className="opacity-60">종료</span>
                <select value={endHour} onChange={(e) => setEndHour(e.target.value)}
                  className="border border-gray-300 px-2 py-1 focus:outline-none">
                  {HOURS.map((h) => <option key={h}>{h}</option>)}
                </select>
                <span>:</span>
                <select value={endMin} onChange={(e) => setEndMin(e.target.value)}
                  className="border border-gray-300 px-2 py-1 focus:outline-none">
                  {MINUTES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">상태</label>
              <div className="flex gap-6">
                {([['draft', '진행 예정'], ['active', '진행 중'], ['closed', '종료']] as const).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={val}
                      checked={status === val}
                      onChange={() => setStatus(val)}
                      className="accent-[var(--brand-dark)]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 예약 기간 */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[var(--brand-dark)] border-b border-gray-200 pb-2 mb-6">예약 기간</h2>
          <div className="flex items-end gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                시작일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                종료일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>
          </div>
          {totalDays > 0 && (
            <p className="text-xs opacity-50 mt-2">총 {totalDays}일간 예약 운영</p>
          )}
        </section>

        {/* 입점 업체 관리 */}
        <section className="mb-10">
          <div className="flex items-start justify-between border-b border-gray-200 pb-2 mb-1">
            <div>
              <h2 className="text-sm font-semibold text-[var(--brand-dark)]">입점 업체 관리</h2>
              <p className="text-xs opacity-50 mt-0.5">카테고리를 먼저 추가하면 예약 시 관심 서비스로 표시됩니다</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowCategoryPanel((v) => !v); setShowVendorPanel(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs hover:bg-gray-50 transition-colors"
              >
                <Tag className="w-3 h-3" />
                카테고리 추가
              </button>
              <button
                onClick={() => { setShowVendorPanel((v) => !v); setShowCategoryPanel(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--brand-dark)] text-white text-xs hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3 h-3" />
                업체 추가
              </button>
            </div>
          </div>

          {/* 카테고리 추가 패널 */}
          {showCategoryPanel && (
            <div className="mb-4 p-4 bg-[#f5f5fb] border border-gray-200">
              <p className="text-xs font-semibold mb-3">카테고리 선택</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_CATEGORIES.map((cat) => {
                  const selected = categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        selected
                          ? 'border-[var(--brand-dark)] bg-white font-semibold'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {selected ? `✓ ${cat}` : `+ ${cat}`}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomCategory()}
                  placeholder="직접 입력 (예: 인테리어)"
                  className="flex-1 border border-gray-300 px-3 py-1.5 text-xs focus:outline-none"
                />
                <button
                  onClick={addCustomCategory}
                  className="px-4 py-1.5 bg-[#b0b0d8] text-white text-xs hover:opacity-90"
                >
                  추가
                </button>
              </div>
              <button
                onClick={() => setShowCategoryPanel(false)}
                className="mt-3 w-full py-2 border border-gray-300 text-xs hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          )}

          {/* 업체 추가 패널 */}
          {showVendorPanel && (
            <div className="mb-4 p-4 bg-[#f5f5fb] border border-gray-200">
              <p className="text-xs font-semibold mb-3">업체 선택</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {vendorTabList.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setVendorTabCategory(tab)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      vendorTabCategory === tab
                        ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {filteredVendors.length === 0 ? (
                <p className="text-xs opacity-50 text-center py-4">
                  먼저 입점 업체 관리 탭에서 업체를 등록해주세요
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredVendors.map((v) => {
                    const checked = selectedVendorIds.includes(v.id);
                    return (
                      <label
                        key={v.id}
                        className={`flex items-center gap-3 px-3 py-2 bg-white border text-xs cursor-pointer transition-colors ${
                          checked ? 'border-[var(--brand-dark)]' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleVendor(v.id)}
                          className="accent-[var(--brand-dark)]"
                        />
                        <span className="font-medium">{v.name}</span>
                        <span className="opacity-50">{v.category}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              <button
                onClick={() => setShowVendorPanel(false)}
                className="mt-3 w-full py-2 border border-gray-300 text-xs hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          )}

          {/* 카테고리 목록 */}
          {categories.length === 0 ? (
            <p className="text-xs opacity-40 py-4">추가된 카테고리가 없습니다</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const vendorsInCat = mockVendors.filter(
                  (v) => v.category === cat && selectedVendorIds.includes(v.id)
                );
                return (
                  <div key={cat} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[var(--brand-dark)]">{cat}</span>
                        <span className="text-xs text-[#7c6fcd]">관심 서비스만</span>
                      </div>
                      <button
                        onClick={() => removeCategory(cat)}
                        className="p-1 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    {vendorsInCat.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {vendorsInCat.map((v) => (
                          <span
                            key={v.id}
                            className="flex items-center gap-1.5 px-2 py-0.5 bg-[#f0f0f8] border border-gray-200 text-xs"
                          >
                            {v.name}
                            <button
                              onClick={() => toggleVendor(v.id)}
                              className="opacity-40 hover:opacity-100 leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 저장 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/events')}
            className="px-6 py-2.5 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => navigate('/admin/events')}
            className="px-6 py-2.5 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            저장
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
