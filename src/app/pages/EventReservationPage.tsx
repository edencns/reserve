import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockEvents, addReservation } from '../mockData';
import { ArrowLeft, Check, Calendar, MapPin, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Reservation } from '../types';

export default function EventReservationPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.slug === slug);
  
  const [step, setStep] = useState<'info' | 'date' | 'form' | 'complete'>('info');
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    unitNumber: '',
    interests: [] as string[],
  });
  const [completedReservation, setCompletedReservation] = useState<Reservation | null>(null);

  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-4">이벤트를 찾을 수 없습니다</h1>
          <Link to="/events">
            <Button variant="outline">이벤트 둘러보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const interestOptions = [
    '가구',
    '에어컨/냉난방',
    '이사',
    '전동커튼/블라인드',
    '보안/방범',
    '욕실/위생',
    '기타',
    '방충망',
    '입주청소',
    '인테리어',
    '조명',
    '주방가전',
    '홈네트워크',
  ];

  const toggleInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest],
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.unitNumber) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('전화번호 형식: 010-0000-0000');
      return;
    }

    const reservation = addReservation({
      eventId: event.id,
      eventTitle: event.title,
      venue: event.venue,
      address: event.address,
      date: selectedDate,
      time: `${event.startTime} - ${event.endTime}`,
      timeSlotId: 'all-day',
      attendeeCount: 1,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      },
      extraFields: {
        unitNumber: formData.unitNumber,
        interests: formData.interests.join(', '),
      },
      status: 'confirmed',
      checkedIn: false,
    });

    setCompletedReservation(reservation);
    setStep('complete');
    toast.success('예약이 완료되었습니다!');
  };

  // Complete step
  if (step === 'complete' && completedReservation) {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-8 py-16">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-[var(--brand-dark)] flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[var(--brand-lime)]" />
            </div>
            <h1 className="font-serif text-5xl mb-4">예약 완료!</h1>
            <p className="text-lg opacity-70">
              예약이 성공적으로 완료되었습니다.<br />QR 티켓을 저장해주세요.
            </p>
          </div>

          <div className="bg-white border-2 border-[var(--brand-dark)] p-8 mb-8">
            <div className="flex justify-center mb-8">
              <QRCodeSVG value={completedReservation.id} size={200} />
            </div>
            
            <div className="space-y-4 text-center">
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-1">
                  이벤트
                </div>
                <div className="font-serif text-2xl">{completedReservation.eventTitle}</div>
              </div>
              
              <div className="pt-4 border-t border-[var(--brand-dark)]/10">
                <div className="text-xs uppercase tracking-[0.15em] mb-1">날짜</div>
                <div className="font-medium text-lg">{completedReservation.date}</div>
              </div>

              <div className="pt-4 border-t border-[var(--brand-dark)]/10">
                <div className="text-xs uppercase tracking-[0.15em] mb-1">장소</div>
                <div>{completedReservation.venue}</div>
                <div className="text-sm opacity-70">{completedReservation.address}</div>
              </div>

              <div className="pt-4 border-t border-[var(--brand-dark)]/10">
                <div className="text-xs uppercase tracking-[0.15em] mb-1">예약번호</div>
                <div className="text-sm font-mono">{completedReservation.id}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                홈으로
              </Button>
            </Link>
            <Link to="/my-tickets" className="flex-1">
              <Button variant="solid" size="lg" className="w-full">
                내 예약 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Info step - Initial view
  if (step === 'info') {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <Link
              to="/events"
              className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로
            </Link>
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div>
                <div className="w-full aspect-[3/4] rounded-t-[400px] bg-[var(--brand-dark)] overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-90 grayscale-[0.2]"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-accent)] mb-3">
                    Event Details
                  </div>
                  <h1 className="font-serif text-5xl lg:text-6xl mb-6 leading-tight">{event.title}</h1>
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
                  <Button
                    variant="solid"
                    size="lg"
                    className="w-full"
                    onClick={() => setStep('date')}
                  >
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

  // Date step
  if (step === 'date') {
    return (
      <div className="min-h-screen bg-[var(--brand-lime)]">
        <header className="border-b border-[var(--brand-dark)]">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <button
              onClick={() => setStep('info')}
              className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로
            </button>
            <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
          </div>
        </header>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl mb-3">방문 날짜 선택</h2>
              <p className="text-sm opacity-70">원하시는 날짜를 선택해주세요</p>
            </div>

            <div className="space-y-4 mb-8">
              {event.dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-full p-6 border-2 transition-all text-left ${
                    selectedDate === date
                      ? 'border-[var(--brand-dark)] bg-[var(--brand-dark)] text-[var(--brand-lime)]'
                      : 'border-[var(--brand-dark)] bg-white hover:bg-[var(--brand-accent)]/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-serif text-2xl mb-1">{date}</div>
                      <div className="text-sm opacity-70 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.startTime} ~ {event.endTime}
                      </div>
                    </div>
                    {selectedDate === date && (
                      <Check className="w-6 h-6" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="solid"
              size="lg"
              className="w-full"
              disabled={!selectedDate}
              onClick={() => setStep('form')}
            >
              다음
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // Form step
  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setStep('date')}
            className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로
          </button>
          <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl mb-3">예약자 정보</h2>
            <p className="text-sm opacity-70">정보를 입력해주세요</p>
          </div>

          {/* Selected Date Display */}
          <div className="bg-white border-2 border-[var(--brand-dark)] p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.15em] opacity-60 mb-1">선택한 날짜</div>
                <div className="font-serif text-xl">{selectedDate}</div>
              </div>
              <Calendar className="w-6 h-6 text-[var(--brand-accent)]" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm mb-2 font-medium">
                이름 <span className="text-[var(--brand-accent)]">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">
                전화번호 <span className="text-[var(--brand-accent)]">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">이메일</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">
                동호수 <span className="text-[var(--brand-accent)]">*</span>
              </label>
              <Input
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                placeholder="예: 101동 1001호"
              />
            </div>

            {/* Interests Checkboxes */}
            <div>
              <label className="block text-sm mb-3 font-medium">관심 서비스</label>
              <p className="text-xs opacity-60 mb-4">최대 5개 선택</p>
              <div className="bg-white border-2 border-[var(--brand-dark)] p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {interestOptions.map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="w-5 h-5 border-2 border-[var(--brand-dark)] appearance-none checked:bg-[var(--brand-dark)] cursor-pointer transition-colors"
                        />
                        {formData.interests.includes(interest) && (
                          <Check className="w-3 h-3 text-[var(--brand-lime)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        )}
                      </div>
                      <span className="text-sm group-hover:text-[var(--brand-accent)] transition-colors">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="solid"
            size="lg"
            onClick={handleSubmit}
            className="w-full"
          >
            예약 완료하기
          </Button>
        </div>
      </section>
    </div>
  );
}