'use client'
import Link from 'next/link'
import { Button } from '../../src/app/components/Button';
import { mockEvents } from '../../src/app/mockData';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

export default function EventsListPage() {
  const activeEvents = mockEvents.filter((e) => e.status === 'active');

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* Header */}
      <header className="border-b border-[var(--brand-dark)]">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <Link href="/" className="text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-xs uppercase tracking-[0.15em]">EDEN-Fair Link</div>
        </div>
      </header>

      {/* Events Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-baseline mb-12">
            <div>
              <h1 className="font-serif text-5xl mb-2">All Events</h1>
              <p className="text-sm opacity-70 uppercase tracking-wider">{activeEvents.length} upcoming events</p>
            </div>
            <Link href="/my-tickets">
              <Button variant="outline">My Tickets</Button>
            </Link>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeEvents.map((event) => (
              <Link
                key={event.id}
                href={`/e/${event.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-t-[300px] aspect-[3/4] bg-[var(--brand-dark)]">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-90 grayscale-[0.3] group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)] via-[var(--brand-dark)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-[var(--brand-lime)]">
                      <h3 className="font-serif text-2xl mb-2 break-keep">{event.title}</h3>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{event.dates[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                        <MapPin className="w-3 h-3" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title below image */}
                <div className="mt-4 px-2">
                  <h3 className="font-serif text-xl mb-1 break-keep">{event.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-[var(--brand-accent)]">{event.dates[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--brand-dark)] py-16 text-center mt-32">
        <p className="text-xs uppercase tracking-[0.15em]">
          © 2026 EDEN-Fair Link. Not a straight line.
        </p>
      </footer>
    </div>
  );
}
