'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Activity, ActivityCategory } from '@/lib/types';

type ActivityFormInput = {
  dayId: string;
  category: ActivityCategory;
  time: string;
  place: string;
  note: string;
  cost: number;
};

type AddActivitySheetProps = {
  open: boolean;
  dayId: string;
  mode: 'create' | 'edit';
  initialActivity?: Activity | null;
  onClose: () => void;
  onSubmit: (input: ActivityFormInput) => void;
};

const categoryOptions: { value: ActivityCategory; label: string }[] = [
  { value: 'food', label: '美食' },
  { value: 'cafe', label: '咖啡店' },
  { value: 'sightseeing', label: '觀光' },
  { value: 'shopping', label: '購物' },
  { value: 'transport', label: '交通' },
  { value: 'hotel', label: '住宿' },
  { value: 'other', label: '其他' }
];

const defaultForm = {
  category: 'sightseeing' as ActivityCategory,
  time: '12:00',
  place: '',
  note: '',
  cost: '0'
};

export function AddActivitySheet({ open, dayId, mode, initialActivity, onClose, onSubmit }: AddActivitySheetProps) {
  const [category, setCategory] = useState<ActivityCategory>(defaultForm.category);
  const [time, setTime] = useState(defaultForm.time);
  const [place, setPlace] = useState(defaultForm.place);
  const [note, setNote] = useState(defaultForm.note);
  const [cost, setCost] = useState(defaultForm.cost);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && initialActivity) {
      setCategory(initialActivity.category);
      setTime(initialActivity.time);
      setPlace(initialActivity.place);
      setNote(initialActivity.note);
      setCost(String(initialActivity.cost));
      return;
    }

    setCategory(defaultForm.category);
    setTime(defaultForm.time);
    setPlace(defaultForm.place);
    setNote(defaultForm.note);
    setCost(defaultForm.cost);
  }, [open, mode, initialActivity]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPlace = place.trim();
    const trimmedNote = note.trim();
    if (!trimmedPlace || !trimmedNote) return;

    onSubmit({
      dayId,
      category,
      time,
      place: trimmedPlace,
      note: trimmedNote,
      cost: Number(cost || 0)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40">
      <button className="h-full w-full" aria-label="關閉活動面板" onClick={onClose} />
      <section className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 shadow-soft">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === 'edit' ? '編輯活動' : '新增活動'}</h2>
          <Button onClick={onClose} aria-label="關閉" className="rounded-full p-2 text-slate-600">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block space-y-1 text-sm">
            <span>活動類型</span>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              required
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1 text-sm">
            <span>時間</span>
            <input
              type="time"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span>地點名稱</span>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span>備註</span>
            <textarea
              className="min-h-20 w-full rounded-xl border border-slate-300 px-3 py-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span>預計花費</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button type="button" onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700">
              取消
            </Button>
            <Button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-white">
              {mode === 'edit' ? '儲存變更' : '儲存'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
