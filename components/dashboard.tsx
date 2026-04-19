'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CloudSun, Plane, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { daysUntil, formatDate, weatherLabel } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { Button } from '@/components/ui/button';
import { AddActivitySheet } from '@/components/add-activity-sheet';

export function DashboardScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { trip, days, activities, selectedDayId, addActivity, resetToSeed } = useTripStore();
  const todayDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const todayActivities = activities
    .filter((a) => a.dayId === todayDay.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <>
      <div className="space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow-soft"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Plane className="h-4 w-4" />
            出發倒數
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-5xl font-semibold leading-none">D-{daysUntil(trip.departureDate)}</p>
            <p className="text-sm text-slate-500">{formatDate(trip.departureDate)}</p>
            <div className="pt-1 text-sm text-slate-600">
              <p>住宿區域：{trip.baseArea}</p>
              <p className="mt-1">酒店：{trip.hotel}</p>
            </div>
          </div>
        </motion.section>

        <section className="rounded-3xl bg-slate-50 p-5 shadow-soft">
          <div className="flex items-center gap-2 text-sm text-slate-600"><CloudSun className="h-4 w-4" /> 天氣</div>
          <p className="mt-3 text-sm text-slate-500">{todayDay.title}</p>
          <p className="mt-1 text-lg font-medium text-slate-800">{weatherLabel(todayDay.weather.condition)} · {todayDay.weather.minC}° / {todayDay.weather.maxC}°</p>
        </section>

        <section className="rounded-3xl bg-slate-50 p-5 shadow-soft">
          <h2 className="text-base font-medium text-slate-800">今日行程</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {todayActivities.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="font-medium">{item.time} · {item.title}</p>
                <p className="text-slate-500">{item.place}</p>
                <p className="text-xs text-slate-500">預計花費：₩{item.cost.toLocaleString()}</p>
              </li>
            ))}
          </ul>
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
