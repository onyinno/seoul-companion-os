'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CloudSun, Plane, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate, weatherLabel } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { Button } from '@/components/ui/button';
import { AddActivitySheet } from '@/components/add-activity-sheet';

const DAY_MS = 24 * 60 * 60 * 1000;

export function DashboardScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const { trip, days, activities, selectedDayId, addActivity, resetToSeed } = useTripStore();
  const todayDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const todayActivities = activities
    .filter((a) => a.dayId === todayDay.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

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

  return (
    <>
      <div className="space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-amber-100 bg-[#fffaf1] shadow-soft"
        >
          <div className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Plane className="h-4 w-4 text-rose-400" />
              距離出發
            </div>

            <div className="mt-3 flex items-end gap-2 text-rose-400">
              <p className="text-6xl font-semibold leading-none">{remainingDays}</p>
              <p className="pb-1 text-2xl text-slate-700">天</p>
              <p className="pb-1 text-2xl font-semibold tracking-wide">{String(remainingHours).padStart(2, '0')}:{String(remainingMinutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}</p>
            </div>

            <div className="mt-4">
              <div className="relative h-2.5 rounded-full bg-amber-100/90">
                <div className="h-full rounded-full bg-rose-300/90" style={{ width: `${progressRatio * 100}%` }} />
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

          <div className="border-t border-amber-100 bg-[#fff6ea] px-5 py-3 text-center">
            <p className="text-sm font-medium text-slate-700">{formatDate(trip.departureDate)} 出發</p>
          </div>
        </motion.section>

        <section className="rounded-3xl bg-slate-50 p-4 shadow-soft">
          <div className="flex items-center gap-2 text-sm text-slate-600"><CloudSun className="h-4 w-4" /> 天氣</div>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-slate-500">{formatDate(todayDay.date)} · {todayDay.title}</p>
            <p className="text-base font-semibold text-slate-900">{weatherLabel(todayDay.weather.condition)} {todayDay.weather.minC}° / {todayDay.weather.maxC}°</p>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-50 p-4 shadow-soft">
          <h2 className="text-base font-medium text-slate-800">今日行程</h2>
          {todayActivities.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">今日尚未安排活動</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {todayActivities.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="font-medium text-slate-900">{item.time} {item.title}</p>
                  <p className="mt-1 text-slate-500">{item.place}</p>
                  <p className="mt-1 text-xs text-slate-500">預計花費：₩{item.cost.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid grid-cols-3 gap-2">
          <Button onClick={() => setIsSheetOpen(true)} className="rounded-2xl bg-slate-900 px-3 py-3 text-xs font-medium text-white">
            <Plus className="mx-auto mb-1 h-4 w-4" /> 新增
          </Button>
          <Link href="/trip" className="rounded-2xl bg-white px-3 py-3 text-center text-xs font-medium text-slate-700 shadow-soft">打開行程</Link>
          <Button onClick={resetToSeed} className="rounded-2xl bg-white px-3 py-3 text-xs font-medium text-slate-700 shadow-soft">重設預設資料</Button>
        </section>
      </div>

      <AddActivitySheet
        open={isSheetOpen}
        mode="create"
        dayId={todayDay.id}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={addActivity}
      />
    </>
  );
}
