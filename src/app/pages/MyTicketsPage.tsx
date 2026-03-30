import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { getReservationsByPhone } from '../mockData';
import { Reservation } from '../types';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function MyTicketsPage() {
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!phone) {
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
  };

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* Header */}
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-xs uppercase tracking-[0.15em]">Aura Fairs</div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-6xl mb-4">My Tickets</h1>
            <p className="text-lg opacity-70">
              전화번호를 입력하여 예약 내역을 확인하세요
            </p>
          </div>

          <div className="bg-white border border-[var(--brand-dark)] p-8 mb-12">
            <label className="block text-sm uppercase tracking-[0.15em] mb-4">
              Phone Number
            </label>
            <div className="flex gap-4">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="solid" size="lg" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* Results */}
          {searched && reservations.length === 0 && (
            <div className="text-center py-16">
              <div className="text-[var(--brand-accent)] text-6xl mb-4">✦</div>
              <h2 className="font-serif text-3xl mb-4">No Reservations Found</h2>
              <p className="text-lg opacity-70 mb-8">
                입력하신 전화번호로 예약 내역을 찾을 수 없습니다
              </p>
              <Link to="/events">
                <Button variant="solid" size="lg">
                  Browse Events
                </Button>
              </Link>
            </div>
          )}

          {reservations.length > 0 && (
            <div className="space-y-8">
              <h2 className="font-serif text-4xl mb-8">Your Reservations</h2>
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white border border-[var(--brand-dark)] p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* QR Code */}
                    <div className="flex justify-center items-center border-r-0 md:border-r border-[var(--brand-dark)]/10">
                      <div className="text-center">
                        <QRCodeSVG value={reservation.id} size={200} />
                        <div className="mt-4 text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)]">
                          Scan at Venue
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-1">
                          Event
                        </div>
                        <div className="font-serif text-3xl">{reservation.eventTitle}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.15em] mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date
                          </div>
                          <div>{reservation.date}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.15em] mb-1">Time</div>
                          <div>{reservation.time}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Venue
                        </div>
                        <div>{reservation.venue}</div>
                        <div className="text-sm opacity-70">{reservation.address}</div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] mb-1 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Attendees
                        </div>
                        <div>{reservation.attendeeCount} persons</div>
                      </div>

                      <div className="pt-4 border-t border-[var(--brand-dark)]/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-[0.15em] mb-1">Status</div>
                            <div className="flex items-center gap-2">
                              {reservation.checkedIn ? (
                                <span className="px-3 py-1 bg-[var(--brand-accent)] text-[var(--brand-dark)] text-xs uppercase tracking-wider">
                                  Checked In
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-[var(--brand-dark)] text-[var(--brand-lime)] text-xs uppercase tracking-wider">
                                  Confirmed
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-right opacity-50">
                            ID: {reservation.id}
                          </div>
                        </div>
                      </div>

                      {Object.keys(reservation.extraFields).length > 0 && (
                        <div className="pt-4 border-t border-[var(--brand-dark)]/10">
                          <div className="text-xs uppercase tracking-[0.15em] mb-2">Additional Info</div>
                          <div className="space-y-1 text-sm">
                            {Object.entries(reservation.extraFields).map(([key, value]) => (
                              <div key={key}>
                                <span className="opacity-70">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--brand-dark)] py-16 text-center mt-16">
        <p className="text-xs uppercase tracking-[0.15em]">
          © 2026 Aura Move-in Fairs. Not a straight line.
        </p>
      </footer>
    </div>
  );
}
