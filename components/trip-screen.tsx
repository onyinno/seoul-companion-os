'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { formatDate, weatherLabel } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddActivitySheet } from '@/components/add-activity-sheet';
import type { ActivityCategory } from '@/lib/types';

const categoryLabel: Record<ActivityCategory, string> = {
  food: '美食',
  cafe: '咖啡店',
  sightseeing: '觀光',
  shopping: '購物',
  transport: '交通',
  hotel: '住宿',
  other: '其他'
};

export function TripScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { days, activities, selectedDayId, selectDay, addActivity, moveActivityUp, moveActivityDown } = useTripStore();
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const dayActivities = useMemo(
    () => activities.filter((a) => a.dayId === selectedDay.id).sort((a, b) => a.order - b.order),
    [activities, selectedDay.id]
  );

  return (
    <>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">行程</h1>
          <p className="text-sm text-slate-500">首爾單一行程 · 使用上移 / 下移穩定排序</p>
        </header>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {days.map((day) => (
            <Button
              key={day.id}
              onClick={() => selectDay(day.id)}
              className={cn(
                'min-w-max rounded-full border px-4 py-2 text-sm',
                day.id === selectedDay.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
              )}
            >
              第 {day.dayNumber} 天
            </Button>
          ))}
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">{formatDate(selectedDay.date)} · {selectedDay.district}</p>
          <h2 className="text-lg font-semibold">{selectedDay.title}</h2>
          <p className="text-sm text-slate-600">{weatherLabel(selectedDay.weather.condition)} · {selectedDay.weather.minC}°/{selectedDay.weather.maxC}°</p>
        </section>

        <ul className="space-y-3">
          {dayActivities.map((activity) => (
            <li key={activity.id} className="rounded-2xl bg-white p-4 shadow-soft">
              <p className="text-xs uppercase tracking-wide text-slate-500">{categoryLabel[activity.category]}</p>
              <p className="mt-1 font-medium">{activity.time} · {activity.title}</p>
              <p className="text-sm text-slate-600">{activity.place}</p>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => moveActivityUp(activity.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">上移</Button>
                <Button onClick={() => moveActivityDown(activity.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">下移</Button>
              </div>
            </li>
          ))}
        </ul>

        <Button onClick={() => setIsSheetOpen(true)} className="fixed bottom-24 right-6 rounded-full bg-slate-900 p-4 text-white shadow-soft" aria-label="新增活動">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <AddActivitySheet
        open={isSheetOpen}
        dayId={selectedDay.id}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={addActivity}
      />
    </>
  );
}
