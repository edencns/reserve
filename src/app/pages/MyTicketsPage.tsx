import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { getReservationsByPhone } from '../mockData';
import { Reservation } from '../types';
import { ArrowLeft, Calendar, MapPin, Phone, User, Home, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function MyTicketsPage() {
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searched, setSearched] = useState(false);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function handleSearch() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      toast.error('전화번호를 입력해주세요');
      return;
    }
    const results = getReservationsByPhone(phone);
    setReservations(results);
    setSearched(true);
    if (results.length === 0) {
      toast.error('예약을 찾을 수 없습니다');
    } else {
      toast.success(`${results.length}개의 예약을 찾았습니다`);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* 헤더 */}
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:opacity-60 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
          <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
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
              <Button variant="solid" size="lg" onClick={handleSearch}>
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
              <Link to="/events">
                <Button variant="solid" size="lg">이벤트 보기</Button>
              </Link>
            </div>
          )}

          {/* 예약 목록 */}
          {reservations.length > 0 && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl mb-2">예약 내역</h2>
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white border-2 border-[var(--brand-dark)]">
                  {/* 상단 상태 바 */}
                  <div className={`px-6 py-3 ${
                    reservation.checkedIn ? 'bg-[var(--brand-accent)]/30' : 'bg-[var(--brand-dark)]'
                  }`}>
                    <div className={`text-xs uppercase tracking-wider font-medium ${
                      reservation.checkedIn ? 'text-[var(--brand-dark)]' : 'text-[var(--brand-lime)]'
                    }`}>
                      {reservation.checkedIn ? '✓ 체크인 완료' : '예약 확정'}
                    </div>
                  </div>

                  {/* 예약 정보 */}
                  <div className="divide-y divide-[var(--brand-dark)]/10">
                    {/* 행사명 */}
                    <div className="px-6 py-4">
                      <div className="text-xs uppercase tracking-[0.1em] opacity-50 mb-1">행사</div>
                      <div className="font-serif text-xl break-keep">{reservation.eventTitle}</div>
                    </div>

                    {/* 날짜 / 시간 */}
                    <div className="px-6 py-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <Calendar className="w-3 h-3" /> 날짜
                        </div>
                        <div className="text-sm font-medium">{reservation.date}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.1em] opacity-50 mb-1">시간</div>
                        <div className="text-sm font-medium">{reservation.time}</div>
                      </div>
                    </div>

                    {/* 장소 */}
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                        <MapPin className="w-3 h-3" /> 장소
                      </div>
                      <div className="text-sm font-medium">{reservation.venue}</div>
                      <div className="text-sm opacity-60">{reservation.address}</div>
                    </div>

                    {/* 이름 / 핸드폰 번호 */}
                    <div className="px-6 py-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <User className="w-3 h-3" /> 이름
                        </div>
                        <div className="text-sm font-medium">{reservation.customer.name}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <Phone className="w-3 h-3" /> 핸드폰
                        </div>
                        <div className="text-sm font-medium">{reservation.customer.phone}</div>
                      </div>
                    </div>

                    {/* 동호수 */}
                    {reservation.extraFields.unitNumber && (
                      <div className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] opacity-50 mb-1">
                          <Home className="w-3 h-3" /> 동호수
                        </div>
                        <div className="text-sm font-medium">{reservation.extraFields.unitNumber}</div>
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
        <p className="text-xs uppercase tracking-[0.15em] opacity-40">© 2026 Aura Move-in Fairs</p>
      </footer>
    </div>
  );
}
