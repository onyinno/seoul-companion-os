'use client';

import { useMemo, useState } from 'react';
import { Clock3, MapPin, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { formatDate, weatherLabel } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddActivitySheet } from '@/components/add-activity-sheet';
import type { Activity, ActivityCategory } from '@/lib/types';

const categoryLabel: Record<ActivityCategory, string> = {
  food: '美食',
  cafe: '咖啡店',
  sightseeing: '觀光',
  shopping: '購物',
  transport: '交通',
  hotel: '住宿',
  other: '其他'
};

const categoryStyle: Record<ActivityCategory, string> = {
  food: 'bg-rose-50 text-rose-700 border-rose-100',
  cafe: 'bg-amber-50 text-amber-700 border-amber-100',
  sightseeing: 'bg-sky-50 text-sky-700 border-sky-100',
  shopping: 'bg-purple-50 text-purple-700 border-purple-100',
  transport: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  hotel: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  other: 'bg-slate-100 text-slate-700 border-slate-200'
};

export function TripScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  const { days, activities, selectedDayId, selectDay, addActivity, updateActivity, deleteActivity, moveActivityUp, moveActivityDown } = useTripStore();
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const dayActivities = useMemo(
    () => activities.filter((activity) => activity.dayId === selectedDay.id).sort((a, b) => a.order - b.order),
    [activities, selectedDay.id]
  );

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingActivity(null);
  };

  const handleCreate = (input: {
    dayId: string;
    category: ActivityCategory;
    time: string;
    place: string;
    note: string;
    cost: number;
  }) => addActivity(input);

  const handleEdit = (input: {
    dayId: string;
    category: ActivityCategory;
    time: string;
    place: string;
    note: string;
    cost: number;
  }) => {
    if (!editingActivity) return;
    updateActivity(editingActivity.id, input);
  };

  const handleConfirmDelete = () => {
    if (!deletingActivity) return;
    deleteActivity(deletingActivity.id);
    setDeletingActivity(null);
  };

  return (
    <>
      <div className="space-y-4 pb-2">
        <section className="rounded-3xl bg-white p-5 shadow-soft">
          <h1 className="text-2xl font-semibold">行程</h1>
          <p className="mt-1 text-sm text-slate-500">{formatDate(selectedDay.date)} · {selectedDay.district}</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedDay.title}</h2>
              <p className="text-sm text-slate-600">{weatherLabel(selectedDay.weather.condition)}</p>
            </div>
            <p className="text-sm font-medium text-slate-700">{selectedDay.weather.minC}° / {selectedDay.weather.maxC}°</p>
          </div>
        </section>

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

        <ul className="space-y-3">
          {dayActivities.map((activity) => (
            <li key={activity.id} className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <span className={cn('rounded-full border px-2 py-1 text-xs font-medium', categoryStyle[activity.category])}>
                  {categoryLabel[activity.category]}
                </span>
                <div className="text-right text-sm font-semibold text-slate-800">{activity.time}</div>
              </div>

              <p className="mt-2 text-base font-semibold text-slate-900">{activity.title}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-600"><MapPin className="h-3.5 w-3.5" /> {activity.place}</p>
              <p className="mt-1 text-sm text-slate-600">{activity.note}</p>

              <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2 text-xs text-slate-700">
                <p className="flex items-center gap-1"><Clock3 className="h-3 w-3" /> {activity.time}</p>
                <p className="col-span-2 flex items-center gap-1 justify-end"><Wallet className="h-3 w-3" /> ₩{activity.cost.toLocaleString()}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setEditingActivity(activity);
                    setIsSheetOpen(true);
                  }}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                >
                  <Pencil className="mr-1 h-3 w-3" /> 編輯
                </Button>
                <Button
                  onClick={() => setDeletingActivity(activity)}
                  className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" /> 刪除
                </Button>
                <Button onClick={() => moveActivityUp(activity.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">上移</Button>
                <Button onClick={() => moveActivityDown(activity.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">下移</Button>
              </div>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => {
            setEditingActivity(null);
            setIsSheetOpen(true);
          }}
          className="fixed bottom-24 right-6 rounded-full bg-slate-900 p-4 text-white shadow-soft"
          aria-label="新增活動"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <AddActivitySheet
        open={isSheetOpen}
        mode={editingActivity ? 'edit' : 'create'}
        initialActivity={editingActivity}
        dayId={editingActivity?.dayId ?? selectedDay.id}
        onClose={handleCloseSheet}
        onSubmit={editingActivity ? handleEdit : handleCreate}
      />

      {deletingActivity && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40">
          <button className="h-full w-full" aria-label="關閉刪除確認" onClick={() => setDeletingActivity(null)} />
          <section className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 shadow-soft">
            <h3 className="text-lg font-semibold">確認刪除活動？</h3>
            <p className="mt-1 text-sm text-slate-600">{deletingActivity.time} · {deletingActivity.title}</p>
            <p className="text-sm text-slate-500">刪除後將無法復原。</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => setDeletingActivity(null)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700">取消</Button>
              <Button onClick={handleConfirmDelete} className="rounded-xl bg-red-600 px-4 py-3 text-white">確認刪除</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
