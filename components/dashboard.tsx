'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CloudSun, Hotel, MapPin, PlaneTakeoff, Plus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { daysUntil, formatDate, weatherLabel } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { Button } from '@/components/ui/button';
import { AddActivitySheet } from '@/components/add-activity-sheet';

export function DashboardScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { trip, days, activities, selectedDayId, addActivity, resetToSeed } = useTripStore();

  const todayDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const todayActivities = useMemo(
    () => activities.filter((activity) => activity.dayId === todayDay.id).sort((a, b) => a.order - b.order),
    [activities, todayDay.id]
  );

  return (
    <>
      <div className="space-y-4 pb-2">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-soft"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs tracking-wide text-white/70">出發倒數</p>
              <p className="mt-1 text-4xl font-semibold">D-{daysUntil(trip.departureDate)}</p>
              <p className="mt-1 text-sm text-white/80">{formatDate(trip.departureDate)} 出發</p>
            </div>
            <PlaneTakeoff className="mt-1 h-5 w-5 text-white/80" />
          </div>
          <div className="mt-4 rounded-2xl bg-white/10 p-3">
            <p className="text-sm font-medium">{trip.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80"><MapPin className="h-3 w-3" /> {trip.destination}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80"><Hotel className="h-3 w-3" /> {trip.hotel}</p>
          </div>
        </motion.section>

        <section className="rounded-3xl bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800"><CloudSun className="h-4 w-4" /> 天氣</h2>
            <span className="text-xs text-slate-500">{todayDay.title}</span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-lg font-medium">{weatherLabel(todayDay.weather.condition)}</p>
              <p className="text-sm text-slate-500">{todayDay.district}</p>
            </div>
            <p className="text-sm font-medium text-slate-700">{todayDay.weather.minC}° / {todayDay.weather.maxC}°</p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">今日行程</h2>
            <span className="text-xs text-slate-500">共 {todayActivities.length} 項</span>
          </div>
          {todayActivities.length === 0 ? (
            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">今日未有活動，按下方「新增」開始規劃。</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {todayActivities.slice(0, 3).map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-200 px-3 py-3 text-sm">
                  <p className="font-medium text-slate-800">{item.time} · {item.title}</p>
                  <p className="mt-1 text-slate-500">{item.place}</p>
                  <p className="mt-1 text-xs text-slate-500">預計花費：₩{item.cost.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid grid-cols-2 gap-2">
          <Button onClick={() => setIsSheetOpen(true)} className="h-14 rounded-2xl bg-slate-900 text-sm text-white">
            <Plus className="mr-1 h-4 w-4" /> 新增活動
          </Button>
          <Link href="/trip" className="flex h-14 items-center justify-center rounded-2xl bg-white text-sm font-medium text-slate-700 shadow-soft">
            打開行程
          </Link>
          <Button onClick={resetToSeed} className="h-12 rounded-2xl border border-slate-300 bg-white text-xs text-slate-700">
            <RotateCcw className="mr-1 h-3 w-3" /> 重設預設資料
          </Button>
          <div className="flex h-12 items-center justify-center rounded-2xl bg-slate-50 text-xs text-slate-500">住宿區域：{trip.baseArea}</div>
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
