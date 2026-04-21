'use client';

import { Building2, CalendarRange, Clock3, PlaneTakeoff, Stethoscope } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';

export function BookingsScreen() {
  const { bookings } = useTripStore();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">預約</h1>
        <p className="text-sm text-[var(--text-muted)]">機票、住宿與診所預約一頁查看</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[var(--text-muted)]">機票</h2>
        {bookings.flights.map((flight) => (
          <article key={flight.id} className="surface-raised overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between bg-[var(--accent-strong)] px-4 py-2.5 text-white">
              <p className="text-[11px] font-medium tracking-[0.16em]">HK EXPRESS</p>
              <p className="text-xs font-semibold tracking-[0.18em]">BOARDING PASS</p>
            </div>

            <div className="border-b border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-2 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-[var(--balance-bluegrey-deep)]">{flight.routeTitle}</p>
                <p>{formatDate(flight.date)}</p>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">出發</p>
                  <p className="mt-1 text-3xl font-semibold leading-none text-[var(--text-main)]">{flight.departureTime}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--balance-bluegrey-deep)]">{flight.departureAirport}</p>
                  <p className="text-xs text-[var(--text-muted)]">{flight.departureTerminal}</p>
                </div>

                <div className="mt-5 flex min-w-[84px] flex-col items-center">
                  <p className="text-[11px] text-[var(--text-muted)]">{flight.duration}</p>
                  <div className="my-1 flex w-full items-center gap-1.5">
                    <span className="h-px flex-1 bg-[var(--balance-bluegrey-soft)]" />
                    <PlaneTakeoff className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="h-px flex-1 bg-[var(--balance-bluegrey-soft)]" />
                  </div>
                  <p className="rounded-full border border-[var(--accent-soft)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent-strong)]">直航</p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">到達</p>
                  <p className="mt-1 text-3xl font-semibold leading-none text-[var(--text-main)]">{flight.arrivalTime}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--balance-bluegrey-deep)]">{flight.arrivalAirport}</p>
                  <p className="text-xs text-[var(--text-muted)]">{flight.arrivalTerminal}</p>
                </div>
              </div>
            </div>

            <div className="relative border-t border-dashed border-[var(--border-soft)] px-4 py-3">
              <span className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--bg-app)]" />
              <span className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--bg-app)]" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] tracking-wide text-[var(--text-muted)]">航班號碼</p>
                  <p className="mt-1 font-semibold text-[var(--text-main)]">{flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-wide text-[var(--text-muted)]">訂位代號</p>
                  <p className="mt-1 font-semibold text-[var(--text-main)]">{flight.bookingRef}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[var(--border-soft)] pt-2">
                <p className="text-[10px] tracking-[0.22em] text-[var(--text-muted)]">0123456789</p>
                <p className="text-[10px] text-[var(--text-muted)]">電子登機證</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--balance-bluegrey-deep)]">
          <Building2 className="h-4 w-4" />
          住宿
        </div>
        <h2 className="mt-3 text-lg font-semibold text-[var(--text-main)]">{bookings.accommodation.name}</h2>
        <div className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
          <p className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-[var(--text-muted)]" /> 入住：{formatDate(bookings.accommodation.checkInDate)}</p>
          <p className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-[var(--text-muted)]" /> 退房：{formatDate(bookings.accommodation.checkOutDate)}</p>
        </div>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{bookings.accommodation.address}</p>
        <p className="mt-2 rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-muted)]">{bookings.accommodation.note}</p>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--balance-bluegrey-deep)]">
          <Stethoscope className="h-4 w-4" />
          診所預約
        </div>
        <h2 className="mt-3 text-lg font-semibold text-[var(--text-main)]">{bookings.clinic.clinicName}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock3 className="h-4 w-4 text-[var(--text-muted)]" />
          {formatDate(bookings.clinic.date)} {bookings.clinic.time}
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{bookings.clinic.address}</p>
        <p className="mt-2 rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-muted)]">{bookings.clinic.note}</p>
      </section>
    </div>
  );
}
