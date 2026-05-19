'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../src/app/components/Button';
import { Event } from '../../../src/app/types';
import { Plus, Edit, Trash2, Link as LinkIcon, X, Copy, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';

type TabFilter = 'ongoing' | 'closed' | 'all';

const STATUS_LABEL: Record<string, string> = {
  active: '진행 중',
  draft: '진행 예정',
  closed: '종료',
};

// 행사 일정을 기준으로 상태를 동적 계산
// - closed(종료): 마지막 행사일이 지남
// - draft(진행 예정): 시작일이 오늘 기준 1달보다 더 남음
// - active(진행 중): 시작일이 1달 이내
function getEventStatus(event: Event): 'active' | 'draft' | 'closed' {
  const dates = event.dates;
  if (!dates || dates.length === 0) return 'draft';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(dates[dates.length - 1]);
  lastDate.setHours(0, 0, 0, 0);
  if (lastDate < today) return 'closed';

  const firstDate = new Date(dates[0]);
  firstDate.setHours(0, 0, 0, 0);
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  if (firstDate > oneMonthLater) return 'draft';

  return 'active';
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-[#0F1F3D] text-[var(--brand-lime)]',
  draft: 'bg-[var(--brand-accent)]/20 text-[var(--brand-accent)]',
  closed: 'bg-gray-200 text-gray-500',
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<TabFilter>('ongoing');
  const [urlModal, setUrlModal] = useState<Event | null>(null);
  const [uploadUrlModal, setUploadUrlModal] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedMember, setCopiedMember] = useState(false);
  const [uploadCopied, setUploadCopied] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchEvents = useCallback(() => {
    fetch('/api/events', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEvents(data); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function handleDelete(id: string) {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setConfirmDeleteId(null);
    fetchEvents();
    toast.success('행사가 삭제되었습니다.');
  }

  const filteredEvents = events.filter((e) => {
    if (tab === 'all') return true;
    const s = getEventStatus(e);
    return tab === 'closed' ? s === 'closed' : s !== 'closed';
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicUrl = urlModal ? `${origin}/e/${urlModal.slug}` : '';
  const memberUrl = urlModal ? `${origin}/e/${urlModal.slug}?type=member` : '';

  const uploadUrl = uploadUrlModal
    ? `${origin}/c/${uploadUrlModal.slug}`
    : '';

  function copyUrl() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function copyMemberUrl() {
    navigator.clipboard.writeText(memberUrl).then(() => {
      setCopiedMember(true);
      setTimeout(() => setCopiedMember(false), 2000);
    });
  }

  function copyUploadUrl() {
    navigator.clipboard.writeText(uploadUrl).then(() => {
      setUploadCopied(true);
      setTimeout(() => setUploadCopied(false), 2000);
    });
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-baseline mb-12">
        <div>
          <h1 className="text-4xl mb-3 text-[var(--brand-dark)] font-bold">이벤트</h1>
          <p className="text-base opacity-60">이벤트 및 박람회 관리</p>
        </div>
        <Button variant="solid" size="lg" onClick={() => router.push('/admin/events/new/edit')}>
          <Plus className="w-4 h-4 mr-2" />
          이벤트 생성
        </Button>
      </div>

      {/* 상태 탭 */}
      <div className="flex border-b-2 border-[var(--brand-dark)] mb-6">
        {([
          ['ongoing', '진행'],
          ['closed', '종료'],
          ['all', '전체'],
        ] as [TabFilter, string][]).map(([key, label]) => {
          const count = key === 'all'
            ? events.length
            : key === 'closed'
              ? events.filter((e) => getEventStatus(e) === 'closed').length
              : events.filter((e) => getEventStatus(e) !== 'closed').length;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 text-sm font-medium -mb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                tab === key
                  ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-[var(--brand-dark)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border-2 border-[var(--brand-dark)]">
        <table className="w-full">
          <thead className="border-b-2 border-[var(--brand-dark)]">
            <tr className="bg-[var(--brand-lime)]">
              <th className="px-6 py-4 text-left text-sm font-bold">이벤트</th>
              <th className="px-6 py-4 text-left text-sm font-bold">장소</th>
              <th className="px-6 py-4 text-left text-sm font-bold">일정</th>
              <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
              <th className="px-6 py-4 text-left text-sm font-bold">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b border-[var(--brand-dark)]/10 hover:bg-[var(--brand-accent)]/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--brand-dark)] overflow-hidden flex-shrink-0">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-lg text-[var(--brand-dark)] font-semibold break-keep">{event.title}</div>
                      <div className="text-xs opacity-60">{event.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{event.venue}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {event.dates[0]} - {event.dates[event.dates.length - 1]}
                  </div>
                  <div className="text-xs opacity-70">
                    {event.startTime} - {event.endTime}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const s = getEventStatus(event);
                    return (
                      <span className={`px-3 py-1 text-xs font-medium ${STATUS_STYLE[s]}`}>
                        {STATUS_LABEL[s]}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setUrlModal(event); setCopied(false); }}
                      title="예약 URL"
                      className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setUploadUrlModal(event); setUploadCopied(false); }}
                      title="계약서 업로드 URL"
                      className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                      title="수정"
                      className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      title="삭제"
                      onClick={() => setConfirmDeleteId(event.id)}
                      className="p-2 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
          <h2 className="text-3xl mb-4 font-bold">이벤트가 없습니다</h2>
          <p className="text-lg opacity-70 mb-8">첫 번째 이벤트를 만들어보세요</p>
          <Button variant="solid" size="lg" onClick={() => router.push('/admin/events/new/edit')}>
            <Plus className="w-4 h-4 mr-2" />
            이벤트 생성
          </Button>
        </div>
      )}

      {/* 삭제 확인 팝업 */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">행사 삭제</h2>
            <p className="text-sm opacity-60 mb-6">
              이 행사를 삭제하면 복구할 수 없습니다. 계속하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium hover:opacity-90"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 계약서 업로드 URL 팝업 */}
      {uploadUrlModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setUploadUrlModal(null)}
        >
          <div
            className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-base font-bold text-[var(--brand-dark)]">계약서 업로드 URL</h2>
              <button onClick={() => setUploadUrlModal(null)} className="p-1 hover:opacity-60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm font-semibold text-[var(--brand-dark)] mb-1 break-keep">{uploadUrlModal.title}</p>
              <p className="text-xs opacity-50 mb-4">
                이 URL은 해당 행사의 계약서 업로드 페이지로만 연결됩니다. 행사명이 자동으로 고정됩니다.
              </p>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 mb-4">
                <span className="flex-1 text-xs font-mono text-[var(--brand-dark)] break-all select-all">{uploadUrl}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyUploadUrl}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium border-2 transition-colors ${
                    uploadCopied
                      ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                      : 'border-[var(--brand-dark)] hover:bg-gray-50'
                  }`}
                >
                  {uploadCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {uploadCopied ? '복사됨' : 'URL 복사'}
                </button>
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-[var(--brand-dark)] text-white hover:opacity-90 transition-opacity"
                >
                  <LinkIcon className="w-4 h-4" />
                  미리보기
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* URL 팝업 */}
      {urlModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setUrlModal(null)}
        >
          <div
            className="bg-white border-2 border-[var(--brand-dark)] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--brand-dark)] bg-[var(--brand-lime)]">
              <h2 className="text-base font-bold text-[var(--brand-dark)]">예약 페이지 URL</h2>
              <button onClick={() => setUrlModal(null)} className="p-1 hover:opacity-60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm font-semibold text-[var(--brand-dark)] mb-4 break-keep">{urlModal.title}</p>

              {/* 일반회원 — 입장권 */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[var(--brand-dark)]">일반회원 (입장권)</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 mb-2">
                  <span className="flex-1 text-xs font-mono text-[var(--brand-dark)] break-all select-all">{publicUrl}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyUrl}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium border-2 transition-colors ${
                      copied
                        ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                        : 'border-[var(--brand-dark)] hover:bg-gray-50'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '복사됨' : 'URL 복사'}
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium bg-[var(--brand-dark)] text-white hover:opacity-90 transition-opacity"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    미리보기
                  </a>
                </div>
              </div>

              {/* 정회원 — 초대권 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[var(--brand-accent)]">정회원 (초대권)</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 mb-2">
                  <span className="flex-1 text-xs font-mono text-[var(--brand-dark)] break-all select-all">{memberUrl}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyMemberUrl}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium border-2 transition-colors ${
                      copiedMember
                        ? 'bg-[var(--brand-accent)] text-white border-[var(--brand-accent)]'
                        : 'border-[var(--brand-accent)] hover:bg-gray-50'
                    }`}
                  >
                    {copiedMember ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMember ? '복사됨' : 'URL 복사'}
                  </button>
                  <a
                    href={memberUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium bg-[var(--brand-accent)] text-white hover:opacity-90 transition-opacity"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    미리보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
