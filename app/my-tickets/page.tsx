'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../src/app/components/Button';
import { Input } from '../../src/app/components/Input';
import { Calendar, MapPin, Phone, User, Home, Search } from 'lucide-react';
import { toast } from 'sonner';

interface ReservationRow {
  id: string;
  event_id: string;
  event_title: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  unit_number: string;
  interests: string;
  attendee_count: number;
  checked_in: number;
  created_at: string;
}

export default function MyTicketsPage() {
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  async function handleSearch() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      toast.error('전화번호를 입력해주세요');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reservations/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || '조회에 실패했습니다');
        setReservations([]);
      } else {
        const rows = Array.isArray(data) ? data : [];
        setReservations(rows);
        if (rows.length === 0) {
          toast.error('예약을 찾을 수 없습니다');
        } else {
          toast.success(`${rows.length}개의 예약을 찾았습니다`);
        }
      }
    } catch {
      toast.error('서버 오류가 발생했습니다');
      setReservations([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* 헤더 */}
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-xs uppercase tracking-[0.15em]">EDEN-Fair Link</div>
          <div className="text-xs uppercase tracking-[0.15em]">EDEN-Fair Link</div>
        </div>
      </header>

      {/* 검색 섹션 */}
      <section className="py-16">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl mb-4">내 예약</h1>
            <p className="text-base opacity-60">전화번호를 입력하여 예약 내역을 확인하세요</p>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-6 mb-10">
            <label className="block text-xs uppercase tracking-[0.15em] mb-3 opacity-60">전화번호</label>
            <div className="flex gap-3">
              <Input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                className="flex-1"
                maxLength={13}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="solid" size="lg" onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 결과 없음 */}
          {searched && reservations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-20">✦</div>
              <h2 className="font-serif text-2xl mb-3">예약 내역 없음</h2>
              <p className="text-sm opacity-60 mb-8">입력하신 전화번호로 예약 내역을 찾을 수 없습니다</p>
            </div>
          )}

          {/* 예약 목록 */}
          {reservations.length > 0 && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl mb-2">예약 내역</h2>
              {reservations.map((r) => (
                <div key={r.id} className="bg-white border-2 border-[var(--brand-dark)]">
                  {/* 상단 상태 바 */}
                  <div className={`px-6 py-3 ${
                    r.checked_in ? 'bg-[var(--brand-accent)]/30' : 'bg-[var(--brand-dark)]'
                  }`}>
                    <div className={`text-xs uppercase tracking-wider font-medium ${
                      r.checked_in ? 'text-[var(--brand-dark)]' : 'text-[var(--brand-lime)]'
                    }`}>
                      {r.checked_in ? '✓ 체크인 완료' : '예약 확정'}
                    </div>
                  </div>

                  {/* 예약 정보 */}
                  <div className="divide-y divide-[var(--brand-dark)]/10">
                    <div className="px-6 py-4">
                      <div className="text-xs uppercase tracking-[0.1em] opacity-50 mb-1">행사</div>
                      <div className="font-serif text-xl break-keep">{r.event_title}</div>
                    </div>

                    <div className="px-6 py-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <Calendar className="w-3 h-3" /> 날짜
                        </div>
                        <div className="text-sm font-medium">{r.date}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.1em] opacity-50 mb-1">시간</div>
                        <div className="text-sm font-medium">{r.time}</div>
                      </div>
                    </div>

                    <div className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                        <MapPin className="w-3 h-3" /> 장소
                      </div>
                      <div className="text-sm font-medium">{r.venue}</div>
                      <div className="text-sm opacity-60">{r.address}</div>
                    </div>

                    <div className="px-6 py-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <User className="w-3 h-3" /> 이름
                        </div>
                        <div className="text-sm font-medium">{r.customer_name}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <Phone className="w-3 h-3" /> 핸드폰
                        </div>
                        <div className="text-sm font-medium">{r.customer_phone}</div>
                      </div>
                    </div>

                    {r.unit_number && (
                      <div className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <Home className="w-3 h-3" /> 동호수
                        </div>
                        <div className="text-sm font-medium">{r.unit_number}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-[var(--brand-dark)] py-10 text-center mt-8">
        <p className="text-xs uppercase tracking-[0.15em] opacity-40">© 2026 EDEN-Fair Link</p>
      </footer>
    </div>
  );
}
