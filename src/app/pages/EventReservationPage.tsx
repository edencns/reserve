import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockEvents, addReservation } from '../mockData';
import { ArrowLeft, Check, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Reservation } from '../types';

export default function EventReservationPage() {
  const { slug } = useParams();
  const location = useLocation();
  const isDirectAccess = location.key === 'default';
  const event = mockEvents.find((e) => e.slug === slug);

  const [step, setStep] = useState<'info' | 'date' | 'form' | 'complete'>('info');
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dong: '',
    ho: '',
    interests: [] as string[],
  });
  const [completedReservation, setCompletedReservation] = useState<Reservation | null>(null);

  // 행사를 찾을 수 없는 경우
  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6 opacity-20">✦</div>
          <h1 className="font-serif text-3xl mb-4 break-keep">존재하지 않는 행사입니다</h1>
          <p className="text-sm opacity-60 mb-8">URL을 다시 확인해주세요.</p>
          <Link to="/events">
            <Button variant="outline">이벤트 목록 보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 접수 마감 / 준비 중 체크
  if (event.status === 'closed') {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <Link to="/events" className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:opacity-60 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
              뒤로
            </Link>
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 border-2 border-[var(--brand-dark)] flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-serif">✕</span>
            </div>
            <h1 className="font-serif text-4xl mb-4 break-keep">{event.title}</h1>
            <p className="text-base opacity-60 mb-2">예약 접수가 마감되었습니다.</p>
            <p className="text-sm opacity-40 mb-8">이 행사의 접수 기간이 종료되었습니다.</p>
            <Link to="/events">
              <Button variant="outline">다른 행사 보기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (event.status === 'draft') {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6 opacity-20">✦</div>
          <h1 className="font-serif text-3xl mb-4 break-keep">아직 공개되지 않은 행사입니다</h1>
          <p className="text-sm opacity-60 mb-8">준비 중입니다. 잠시 후 다시 확인해주세요.</p>
          <Link to="/events">
            <Button variant="outline">다른 행사 보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  const interestOptions = [
    '가구', '에어컨/냉난방', '이사', '전동커튼/블라인드',
    '보안/방범', '욕실/위생', '기타', '방충망',
    '입주청소', '인테리어', '조명', '주방가전', '홈네트워크',
  ];

  function toggleInterest(interest: string) {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : formData.interests.length < 5
        ? [...formData.interests, interest]
        : formData.interests,
    });
  }

  function handleSubmit() {
    if (!formData.name || !formData.phone || !formData.dong || !formData.ho) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('전화번호 형식: 010-0000-0000');
      return;
    }
    const unitNumber = `${formData.dong}동 ${formData.ho}호`;
    const reservation = addReservation({
      eventId: event.id,
      eventTitle: event.title,
      venue: event.venue,
      address: event.address,
      date: selectedDate,
      time: `${event.startTime} - ${event.endTime}`,
      timeSlotId: 'all-day',
      attendeeCount: 1,
      customer: { name: formData.name, phone: formData.phone, email: formData.email },
      extraFields: { unitNumber, interests: formData.interests.join(', ') },
      status: 'confirmed',
      checkedIn: false,
    });
    setCompletedReservation(reservation);
    setStep('complete');
    toast.success('예약이 완료되었습니다!');
  }

  // ── 완료 화면 ──
  if (step === 'complete' && completedReservation) {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-dark)] flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-[var(--brand-lime)]" />
            </div>
            <h1 className="font-serif text-4xl mb-3">예약 완료</h1>
            <p className="text-sm opacity-60">예약이 성공적으로 접수되었습니다.</p>
          </div>
          <div className="bg-white border-2 border-[var(--brand-dark)] divide-y divide-[var(--brand-dark)]/10 mb-8">
            {[
              ['행사', completedReservation.eventTitle],
              ['날짜', completedReservation.date],
              ['장소', completedReservation.venue],
              ['이름', completedReservation.customer.name],
              ['연락처', completedReservation.customer.phone],
              ['동호수', completedReservation.extraFields.unitNumber],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center px-6 py-4">
                <span className="text-xs uppercase tracking-[0.1em] opacity-50">{label}</span>
                <span className="font-medium text-right break-keep">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">홈으로</Button>
            </Link>
            <Link to="/my-tickets" className="flex-1">
              <Button variant="solid" size="lg" className="w-full">내 예약 보기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── 정보 화면 ──
  if (step === 'info') {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            {!isDirectAccess ? (
              <Link
                to="/events"
                className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로
              </Link>
            ) : (
              <div />
            )}
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* 아치형 이미지 */}
              <div>
                <div className="w-full aspect-[3/4] rounded-t-[400px] bg-[var(--brand-dark)] overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-90 grayscale-[0.2]"
                  />
                </div>
              </div>

              {/* 행사 정보 */}
              <div className="space-y-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-accent)] mb-3">
                    Event Details
                  </div>
                  <h1 className="font-serif text-5xl lg:text-6xl mb-6 leading-tight break-keep">{event.title}</h1>
                  <p className="text-base opacity-80 leading-relaxed">{event.description}</p>
                </div>

                <div className="space-y-4 pt-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] opacity-60 mb-2">VENUE</div>
                    <div className="font-medium text-lg">{event.venue}</div>
                    <div className="text-sm opacity-70">{event.address}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] opacity-60 mb-2">DATES</div>
                    <div className="font-medium text-lg">
                      {event.dates[0]} ~ {event.dates[event.dates.length - 1]}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] opacity-60 mb-2">HOURS</div>
                    <div className="font-medium text-lg">
                      {event.startTime} ~ {event.endTime}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button variant="solid" size="lg" className="w-full" onClick={() => setStep('date')}>
                    예약하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[var(--brand-dark)] py-12 text-center mt-20">
          <p className="text-xs uppercase tracking-[0.15em] opacity-60">
            © 2026 Aura Move-in Fairs
          </p>
        </footer>
      </div>
    );
  }

  // ── 날짜 선택 ──
  if (step === 'date') {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <button
              onClick={() => setStep('info')}
              className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:opacity-60 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로
            </button>
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>
        <section className="py-16">
          <div className="max-w-lg mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-serif text-4xl mb-2">방문 날짜 선택</h2>
              <p className="text-sm opacity-60">원하시는 날짜를 선택해주세요</p>
            </div>
            <div className="space-y-3 mb-8">
              {event.dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-full p-5 border-2 transition-all text-left flex items-center justify-between ${
                    selectedDate === date
                      ? 'border-[var(--brand-dark)] bg-[var(--brand-dark)] text-[var(--brand-lime)]'
                      : 'border-[var(--brand-dark)] bg-white hover:bg-[var(--brand-accent)]/10'
                  }`}
                >
                  <div>
                    <div className="font-serif text-xl mb-1">{date}</div>
                    <div className="text-sm opacity-60 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {event.startTime} ~ {event.endTime}
                    </div>
                  </div>
                  {selectedDate === date && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
            <Button variant="solid" size="lg" className="w-full" disabled={!selectedDate} onClick={() => setStep('form')}>
              다음
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // ── 예약자 정보 입력 ──
  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <button
            onClick={() => setStep('date')}
            className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로
          </button>
          <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
        </div>
      </header>
      <section className="py-12">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl mb-2">예약자 정보</h2>
            <p className="text-sm opacity-60">정보를 입력해주세요</p>
          </div>

          {/* 선택 날짜 표시 */}
          <div className="bg-white border-2 border-[var(--brand-dark)] px-5 py-4 mb-8 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.1em] opacity-50 mb-0.5">선택한 날짜</div>
              <div className="font-medium">{selectedDate}</div>
            </div>
            <Calendar className="w-5 h-5 opacity-30" />
          </div>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">이름 <span className="text-red-400">*</span></label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">전화번호 <span className="text-red-400">*</span></label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="010-0000-0000"
                maxLength={13}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">동호수 <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.dong}
                  onChange={(e) => setFormData({ ...formData, dong: e.target.value.replace(/\D/g, '') })}
                  placeholder="101"
                  className="flex-1"
                />
                <span className="text-sm font-medium whitespace-nowrap">동</span>
                <Input
                  value={formData.ho}
                  onChange={(e) => setFormData({ ...formData, ho: e.target.value.replace(/\D/g, '') })}
                  placeholder="1001"
                  className="flex-1"
                />
                <span className="text-sm font-medium whitespace-nowrap">호</span>
              </div>
            </div>

            {/* 관심 서비스 */}
            <div>
              <label className="block text-sm font-medium mb-1">관심 서비스</label>
              <p className="text-xs opacity-50 mb-3">최대 5개 선택 ({formData.interests.length}/5)</p>
              <div className="bg-white border-2 border-[var(--brand-dark)] p-5">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {interestOptions.map((interest) => {
                    const checked = formData.interests.includes(interest);
                    const maxed = !checked && formData.interests.length >= 5;
                    return (
                      <label key={interest} className={`flex items-center gap-3 cursor-pointer ${maxed ? 'opacity-40' : ''}`}>
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInterest(interest)}
                            disabled={maxed}
                            className="w-5 h-5 border-2 border-[var(--brand-dark)] appearance-none checked:bg-[var(--brand-dark)] cursor-pointer transition-colors"
                          />
                          {checked && (
                            <Check className="w-3 h-3 text-[var(--brand-lime)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                          )}
                        </div>
                        <span className="text-sm">{interest}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Button variant="solid" size="lg" onClick={handleSubmit} className="w-full">
            예약 완료하기
          </Button>
        </div>
      </section>
    </div>
  );
}
