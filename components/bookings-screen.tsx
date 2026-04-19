'use client';

import { Building2, CalendarRange, Clock3, PlaneTakeoff, Stethoscope } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';

const ticketTone: Record<'outbound' | 'return', string> = {
  outbound: 'from-slate-900 to-slate-700 text-white',
  return: 'from-slate-800 to-slate-600 text-white'
};

export function BookingsScreen() {
  const { bookings } = useTripStore();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">預約</h1>
        <p className="text-sm text-slate-500">機票、住宿與診所預約一頁查看</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-slate-500">機票</h2>
        {bookings.flights.map((flight) => (
          <article key={flight.id} className={cn('overflow-hidden rounded-3xl bg-gradient-to-br p-4 shadow-soft', ticketTone[flight.tripType])}>
            <div className="flex items-center justify-between text-xs/5 text-white/80">
              <p>{flight.routeTitle}</p>
              <p>{formatDate(flight.date)}</p>
            </div>

            <div className="mt-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-3xl font-semibold leading-none">{flight.departureTime}</p>
                  <p className="mt-2 text-sm text-white/85">{flight.departureAirport} {flight.departureTerminal}</p>
                </div>

                <div className="mt-1 flex min-w-[92px] flex-1 flex-col items-center px-2">
                  <p className="text-[11px] text-white/75">{flight.duration}</p>
                  <div className="my-1.5 flex w-full items-center gap-1.5">
                    <div className="h-px flex-1 bg-white/50" />
                    <PlaneTakeoff className="h-3.5 w-3.5" />
                    <div className="h-px flex-1 bg-white/50" />
                  </div>
                  <p className="text-[11px] text-white/75">直航</p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-semibold leading-none">{flight.arrivalTime}</p>
                  <p className="mt-2 text-sm text-white/85">{flight.arrivalAirport} {flight.arrivalTerminal}</p>
                </div>
              </div>

              <div className="relative mt-4 border-t border-dashed border-white/40 pt-3 text-xs text-white/80">
                <span className="absolute -left-7 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-slate-100" />
                <span className="absolute -right-7 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-slate-100" />
                <div className="flex items-center justify-between">
                  <p>航班號碼：{flight.flightNumber}</p>
                  <p>訂位代號：{flight.bookingRef}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Building2 className="h-4 w-4" />
          住宿
        </div>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">{bookings.accommodation.name}</h2>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-slate-400" /> 入住：{formatDate(bookings.accommodation.checkInDate)}</p>
          <p className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-slate-400" /> 退房：{formatDate(bookings.accommodation.checkOutDate)}</p>
        </div>
        <p className="mt-3 text-sm text-slate-600">{bookings.accommodation.address}</p>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">{bookings.accommodation.note}</p>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Stethoscope className="h-4 w-4" />
          診所預約
        </div>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">{bookings.clinic.clinicName}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <Clock3 className="h-4 w-4 text-slate-400" />
          {formatDate(bookings.clinic.date)} {bookings.clinic.time}
        </p>
        <p className="mt-2 text-sm text-slate-600">{bookings.clinic.address}</p>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">{bookings.clinic.note}</p>
      </section>
    </div>
  );
}
