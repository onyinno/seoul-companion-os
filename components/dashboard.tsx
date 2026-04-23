'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ClipboardCheck, Plane, ShoppingBag, TicketCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';

const DAY_MS = 24 * 60 * 60 * 1000;

export function DashboardScreen() {
  const [now, setNow] = useState(() => Date.now());
  const { trip, days, activities, bookings, prepItems, shoppingItems, selectedDayId } = useTripStore();
  const todayDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const todayActivities = activities
    .filter((a) => a.dayId === todayDay.id)
    .sort((a, b) => a.order - b.order);
  const todayPreview = todayActivities.slice(0, 2);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const departureAt = useMemo(() => new Date(`${trip.departureDate}T00:00:00`).getTime(), [trip.departureDate]);
  const planningStartAt = useMemo(() => departureAt - 30 * DAY_MS, [departureAt]);

  const remainingMs = Math.max(0, departureAt - now);
  const remainingDays = Math.floor(remainingMs / DAY_MS);
  const remainingHours = Math.floor((remainingMs % DAY_MS) / (60 * 60 * 1000));
  const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  const remainingSeconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

  const progressRatio = Math.min(1, Math.max(0, (now - planningStartAt) / (departureAt - planningStartAt)));
  const prepCompletedCount = prepItems.filter((item) => item.completed).length;
  const prepIncompleteItems = prepItems.filter((item) => !item.completed).slice(0, 2);
  const prepProgress = prepItems.length === 0 ? 0 : (prepCompletedCount / prepItems.length) * 100;

  const pendingShoppingItems = shoppingItems.filter((item) => !item.completed);

  const nextBooking = useMemo(() => {
    const bookingCandidates = [
      ...bookings.flights.map((flight) => ({
        id: flight.id,
        when: new Date(`${flight.date}T${flight.departureTime}:00`).getTime(),
        label: `航班 · ${flight.routeTitle}`,
        detail: `${formatDate(flight.date)} ${flight.departureTime} · ${flight.flightNumber}`
      })),
      {
        id: bookings.accommodation.id,
        when: new Date(`${bookings.accommodation.checkInDate}T15:00:00`).getTime(),
        label: `住宿 · ${bookings.accommodation.name}`,
        detail: `${formatDate(bookings.accommodation.checkInDate)} 入住`
      },
      {
        id: bookings.clinic.id,
        when: new Date(`${bookings.clinic.date}T${bookings.clinic.time}:00`).getTime(),
        label: `Clinic · ${bookings.clinic.clinicName}`,
        detail: `${formatDate(bookings.clinic.date)} ${bookings.clinic.time}`
      }
    ]
      .filter((candidate) => Number.isFinite(candidate.when))
      .sort((a, b) => a.when - b.when);

    return bookingCandidates.find((candidate) => candidate.when >= now) ?? bookingCandidates[bookingCandidates.length - 1] ?? null;
  }, [bookings, now]);

  return (
    <>
      <div className="space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-raised-hero overflow-hidden rounded-3xl"
        >
          <div className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              <Plane className="h-4 w-4 text-[var(--accent-primary)]" />
              距離出發
            </div>

            <div className="mt-3 flex items-end gap-2 text-[var(--accent-primary)]">
              <p className="text-6xl font-semibold leading-none">{remainingDays}</p>
              <p className="pb-1 text-2xl text-[var(--text-secondary)]">天</p>
              <p className="pb-1 text-2xl font-semibold tracking-wide">{String(remainingHours).padStart(2, '0')}:{String(remainingMinutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}</p>
            </div>

            <div className="mt-4">
              <div className="relative h-2.5 rounded-full bg-[var(--accent-soft)]">
                <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${progressRatio * 100}%` }} />
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-base"
                  style={{ left: `calc(${progressRatio * 100}% - 8px)` }}
                  aria-hidden="true"
                >
                  ✈️
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-3 text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">{formatDate(trip.departureDate)} 出發</p>
          </div>
        </motion.section>

        <section className="surface-raised rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
              <CalendarDays className="h-4 w-4" />
              今日行程
            </h2>
            <span className="rounded-full bg-[var(--bg-card)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">{todayActivities.length} 項</span>
          </div>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{formatDate(todayDay.date)} · {todayDay.title}</p>
          {todayPreview.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--text-muted)]">今日尚未安排活動</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {todayPreview.map((item) => (
                <li key={item.id} className="surface-raised-soft rounded-2xl p-3">
                  <p className="font-medium text-[var(--text-main)]">{item.time} {item.title}</p>
                  <p className="mt-1 text-[var(--text-muted)]">{item.place}</p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/trip" className="mt-3 inline-flex rounded-xl bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--balance-bluegrey-deep)]">
            前往行程 →
          </Link>
        </section>

        <section className="surface-raised rounded-3xl p-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
            <TicketCheck className="h-4 w-4" />
            下一個預約
          </h2>
          {nextBooking ? (
            <div className="surface-raised-soft mt-2 rounded-2xl p-3">
              <p className="text-sm font-medium text-[var(--text-main)]">{nextBooking.label}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{nextBooking.detail}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-muted)]">暫時未有預約資料</p>
          )}
          <Link href="/bookings" className="mt-3 inline-flex rounded-xl bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--balance-bluegrey-deep)]">
            前往預約 →
          </Link>
        </section>

        <section className="surface-raised rounded-3xl p-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
            <ClipboardCheck className="h-4 w-4" />
            準備進度
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">已完成 {prepCompletedCount} / {prepItems.length} 項</p>
          <div className="mt-2 h-2 rounded-full bg-[var(--balance-bluegrey-soft)]">
            <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${prepProgress}%` }} />
          </div>
          {prepIncompleteItems.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
              {prepIncompleteItems.map((item) => (
                <li key={item.id}>• {item.title}</li>
              ))}
            </ul>
          )}
          <Link href="/prep" className="mt-3 inline-flex rounded-xl bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--balance-bluegrey-deep)]">
            前往準備 →
          </Link>
        </section>

        <section className="surface-raised rounded-3xl p-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
            <ShoppingBag className="h-4 w-4" />
            購物提醒
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">尚有 {pendingShoppingItems.length} 項待買</p>
          {pendingShoppingItems.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
              {pendingShoppingItems.slice(0, 3).map((item) => (
                <li key={item.id}>• {item.title}（{item.areaTag}）</li>
              ))}
            </ul>
          )}
          <Link href="/shopping" className="mt-3 inline-flex rounded-xl bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--balance-bluegrey-deep)]">
            前往購物 →
          </Link>
        </section>

        <section className="surface-raised rounded-3xl p-4">
          <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">快捷入口</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/trip" className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-3 text-center text-sm font-medium text-[var(--balance-bluegrey-deep)]">行程</Link>
            <Link href="/bookings" className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-3 text-center text-sm font-medium text-[var(--balance-bluegrey-deep)]">預約</Link>
            <Link href="/prep" className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-3 text-center text-sm font-medium text-[var(--balance-bluegrey-deep)]">準備</Link>
            <Link href="/shopping" className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-3 text-center text-sm font-medium text-[var(--balance-bluegrey-deep)]">購物</Link>
          </div>
        </section>

      </div>
    </>
  );
}
