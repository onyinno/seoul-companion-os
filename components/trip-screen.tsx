'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, MapPin, Plus } from 'lucide-react';
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

const categoryBadgeClass: Record<ActivityCategory, string> = {
  food: 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  cafe: 'bg-[var(--bg-surface)] text-[var(--balance-bluegrey-deep)]',
  sightseeing: 'bg-[var(--balance-bluegrey-soft)] text-[var(--balance-bluegrey-deep)]',
  shopping: 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  transport: 'bg-[var(--balance-bluegrey-soft)] text-[var(--balance-bluegrey-deep)]',
  hotel: 'bg-[var(--bg-surface)] text-[var(--balance-bluegrey-deep)]',
  other: 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
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

  useEffect(() => {
    if (!deletingActivity) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [deletingActivity]);

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
  }) => {
    addActivity(input);
  };

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
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">行程</h1>
          <p className="text-sm text-[var(--text-muted)]">首爾單一行程 · 使用上移 / 下移穩定排序</p>
        </header>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {days.map((day) => (
            <Button
              key={day.id}
              onClick={() => selectDay(day.id)}
              className={cn(
                'min-w-max rounded-full border px-4 py-2 text-sm',
                day.id === selectedDay.id ? 'border-[var(--balance-bluegrey-deep)] bg-[var(--balance-bluegrey-deep)] text-[var(--bg-card)]' : 'border-[var(--border-soft)] bg-[var(--bg-card)] text-[var(--balance-bluegrey-deep)]'
              )}
            >
              第 {day.dayNumber} 天
            </Button>
          ))}
        </div>

        <section className="surface-raised rounded-3xl p-5">
          <p className="text-sm text-[var(--text-muted)]">{formatDate(selectedDay.date)} · {selectedDay.district}</p>
          <h2 className="text-lg font-semibold">{selectedDay.title}</h2>
          <p className="text-sm text-[var(--text-secondary)]">{weatherLabel(selectedDay.weather.condition)} · {selectedDay.weather.minC}°/{selectedDay.weather.maxC}°</p>
        </section>

        <ul className="space-y-3">
          {dayActivities.map((activity) => (
            <li key={activity.id} className="surface-raised-soft rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', categoryBadgeClass[activity.category])}>
                  {categoryLabel[activity.category]}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <p className="flex items-start gap-3">
                  <span className="w-14 shrink-0 font-semibold text-[var(--text-main)]">{activity.time}</span>
                  <span className="font-semibold text-[var(--text-main)]">{activity.title}</span>
                </p>
                <p className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                  <span>{activity.place}</span>
                </p>
                <p className="text-sm text-[var(--text-muted)]">{activity.note}</p>
              </div>

              <p className="mt-3 text-right text-sm font-medium text-[var(--balance-bluegrey-deep)]">預計花費：₩{activity.cost.toLocaleString()}</p>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingActivity(activity);
                      setIsSheetOpen(true);
                    }}
                    className="rounded-lg border border-[var(--border-soft)] px-3 py-1.5 text-xs"
                  >
                    編輯
                  </Button>
                  <Button
                    onClick={() => setDeletingActivity(activity)}
                    className="rounded-lg border border-[var(--accent-soft)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--accent-strong)]"
                  >
                    刪除
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-[var(--text-muted)]">
                  <Button onClick={() => moveActivityUp(activity.id)} className="rounded-lg border border-[var(--border-soft)] p-1.5 text-[var(--text-muted)]" aria-label="上移排序">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button onClick={() => moveActivityDown(activity.id)} className="rounded-lg border border-[var(--border-soft)] p-1.5 text-[var(--text-muted)]" aria-label="下移排序">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => {
            setEditingActivity(null);
            setIsSheetOpen(true);
          }}
          className="fixed bottom-24 right-6 rounded-full bg-[var(--accent-strong)] p-4 text-[var(--bg-card)] shadow-soft"
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
        <div className="fixed inset-0 z-[70] bg-[color:var(--balance-bluegrey-deep)]/45">
          <section className="surface-raised absolute bottom-0 left-0 right-0 rounded-t-3xl p-4">
            <h3 className="text-lg font-semibold">確認刪除活動？</h3>
            <div className="mt-2 rounded-xl bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-secondary)]">
              <p>分類：{categoryLabel[deletingActivity.category]}</p>
              <p className="mt-1">時間：{deletingActivity.time}</p>
              <p className="mt-1">地點：{deletingActivity.place}</p>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">刪除後將無法復原，請再次確認是否為目標活動。</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => setDeletingActivity(null)} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-[var(--balance-bluegrey-deep)]">取消</Button>
              <Button onClick={handleConfirmDelete} className="rounded-xl bg-[var(--accent-strong)] px-4 py-3 text-[var(--bg-card)]">確認刪除</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
