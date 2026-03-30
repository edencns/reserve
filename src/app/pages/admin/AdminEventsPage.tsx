import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { mockEvents } from '../../mockData';
import { Event } from '../../types';
import { Plus, Edit, Trash2, Link as LinkIcon, X, Copy, Check } from 'lucide-react';

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [urlModal, setUrlModal] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = urlModal
    ? `${window.location.origin}/e/${urlModal.slug}`
    : '';

  function copyUrl() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h1 className="text-5xl mb-3 text-[var(--brand-dark)] font-bold">이벤트</h1>
            <p className="text-base opacity-60">이벤트 및 박람회 관리</p>
          </div>
          <Button variant="solid" size="lg" onClick={() => navigate('/admin/events/new/edit')}>
            <Plus className="w-4 h-4 mr-2" />
            이벤트 생성
          </Button>
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
              {mockEvents.map((event) => (
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
                    <span className={`px-3 py-1 text-xs uppercase tracking-wider font-medium ${
                      event.status === 'active' ? 'bg-[#0F1F3D] text-[var(--brand-lime)]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {event.status === 'active' ? '활성' : '비활성'}
                    </span>
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
                        onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                        title="수정"
                        className="p-2 hover:bg-[var(--brand-accent)]/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="삭제"
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

        {mockEvents.length === 0 && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-16 text-center">
            <h2 className="text-3xl mb-4 font-bold">이벤트가 없습니다</h2>
            <p className="text-lg opacity-70 mb-8">첫 번째 이벤트를 만들어보세요</p>
            <Button variant="solid" size="lg" onClick={() => navigate('/admin/events/new/edit')}>
              <Plus className="w-4 h-4 mr-2" />
              이벤트 생성
            </Button>
          </div>
        )}
      </div>

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
              <p className="text-sm font-semibold text-[var(--brand-dark)] mb-1 break-keep">{urlModal.title}</p>
              <p className="text-xs opacity-50 mb-4">
                이 URL은 해당 행사의 예약 페이지로만 연결됩니다. 다른 행사 정보는 노출되지 않습니다.
              </p>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 mb-4">
                <span className="flex-1 text-xs font-mono text-[var(--brand-dark)] break-all select-all">{publicUrl}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyUrl}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium border-2 transition-colors ${
                    copied
                      ? 'bg-[var(--brand-dark)] text-white border-[var(--brand-dark)]'
                      : 'border-[var(--brand-dark)] hover:bg-gray-50'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사됨' : 'URL 복사'}
                </button>
                <a
                  href={publicUrl}
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
    </AdminLayout>
  );
}
