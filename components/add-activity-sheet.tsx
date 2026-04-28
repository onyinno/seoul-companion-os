'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Activity, ActivityCategory } from '@/lib/types';

type ActivityFormInput = {
  dayId: string;
  category: ActivityCategory;
  time: string;
  place: string;
  address?: string;
  googleMapsUrl?: string;
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
  photoUrl?: string;
  isUploadingPhoto?: boolean;
  uploadError?: string;
  onUploadPhoto?: (file: File) => void;
  onRemovePhoto?: () => void;
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
  address: '',
  googleMapsUrl: '',
  note: '',
  cost: '0'
};

type FormErrors = {
  place?: string;
  note?: string;
  cost?: string;
};

export function AddActivitySheet({
  open,
  dayId,
  mode,
  initialActivity,
  onClose,
  onSubmit,
  photoUrl,
  isUploadingPhoto,
  uploadError,
  onUploadPhoto,
  onRemovePhoto
}: AddActivitySheetProps) {
  const [category, setCategory] = useState<ActivityCategory>(defaultForm.category);
  const [time, setTime] = useState(defaultForm.time);
  const [place, setPlace] = useState(defaultForm.place);
  const [address, setAddress] = useState(defaultForm.address);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(defaultForm.googleMapsUrl);
  const [note, setNote] = useState(defaultForm.note);
  const [cost, setCost] = useState(defaultForm.cost);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const hasPhotoPreview = Boolean(photoUrl);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setSuccessMessage('');

    if (mode === 'edit' && initialActivity) {
      setCategory(initialActivity.category);
      setTime(initialActivity.time);
      setPlace(initialActivity.place);
      setAddress(initialActivity.address ?? '');
      setGoogleMapsUrl(initialActivity.googleMapsUrl ?? '');
      setNote(initialActivity.note);
      setCost(String(initialActivity.cost));
      return;
    }

    setCategory(defaultForm.category);
    setTime(defaultForm.time);
    setPlace(defaultForm.place);
    setAddress(defaultForm.address);
    setGoogleMapsUrl(defaultForm.googleMapsUrl);
    setNote(defaultForm.note);
    setCost(defaultForm.cost);
  }, [open, mode, initialActivity]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPlace = place.trim();
    const trimmedNote = note.trim();
    const parsedCost = Number(cost || 0);

    const nextErrors: FormErrors = {};

    if (!trimmedPlace) nextErrors.place = '請填寫地點名稱。';
    if (!trimmedNote) nextErrors.note = '請填寫備註內容。';
    if (!Number.isFinite(parsedCost) || parsedCost < 0) nextErrors.cost = '花費不可為負數。';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    onSubmit({
      dayId,
      category,
      time,
      place: trimmedPlace,
      address: address.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      note: trimmedNote,
      cost: parsedCost
    });

    setSuccessMessage(mode === 'edit' ? '已更新活動內容' : '已新增活動');
    window.setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[color:var(--balance-bluegrey-deep)]/40">
      <button className="h-full w-full" aria-label="關閉活動面板" onClick={onClose} />
      <section className="surface-raised absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl p-4">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === 'edit' ? '編輯活動' : '新增活動'}</h2>
          <Button onClick={onClose} aria-label="關閉" className="rounded-full p-2 text-[var(--text-secondary)]">
            <X className="h-4 w-4" />
          </Button>
        </header>

        {successMessage && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent-strong)]">
            <CheckCircle2 className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block space-y-1 text-sm">
            <span>活動類型</span>
            <select
              className="w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
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
              className="w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span>地點名稱</span>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                if (errors.place) setErrors((prev) => ({ ...prev, place: undefined }));
              }}
              required
            />
            {errors.place && <p className="text-xs text-[var(--accent-strong)]">{errors.place}</p>}
          </label>

          <label className="block space-y-1 text-sm">
            <span>備註</span>
            <textarea
              className="min-h-20 w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (errors.note) setErrors((prev) => ({ ...prev, note: undefined }));
              }}
              required
            />
            {errors.note && <p className="text-xs text-[var(--accent-strong)]">{errors.note}</p>}
          </label>

          <label className="block space-y-1 text-sm">
            <span>地址（可選）</span>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span>Google Maps 連結（可選）</span>
            <input
              type="url"
              className="w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span>預計花費</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-[var(--border-soft)] px-3 py-2"
              value={cost}
              onChange={(e) => {
                setCost(e.target.value);
                if (errors.cost) setErrors((prev) => ({ ...prev, cost: undefined }));
              }}
            />
            {errors.cost && <p className="text-xs text-[var(--accent-strong)]">{errors.cost}</p>}
          </label>

          {mode === 'edit' && initialActivity && (
            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3">
              <p className="text-xs font-medium text-[var(--text-secondary)]">行程相片</p>
              {hasPhotoPreview ? (
                <img src={photoUrl} alt={`${initialActivity.title} 行程相片`} className="mt-2 h-24 w-24 rounded-lg object-cover" />
              ) : (
                <p className="mt-2 text-xs text-[var(--text-muted)]">尚未新增相片</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--balance-bluegrey-deep)]">
                  {hasPhotoPreview ? '更換相片' : '新增相片'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingPhoto}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = '';
                      if (file) {
                        onUploadPhoto?.(file);
                      }
                    }}
                  />
                </label>
                {hasPhotoPreview && (
                  <Button
                    type="button"
                    onClick={() => onRemovePhoto?.()}
                    className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                  >
                    移除相片
                  </Button>
                )}
              </div>
              {isUploadingPhoto && <p className="mt-2 text-xs text-[var(--text-muted)]">正在上載...</p>}
              {uploadError && <p className="mt-2 text-xs text-[var(--accent-strong)]">{uploadError}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button type="button" onClick={onClose} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-[var(--balance-bluegrey-deep)]">
              取消
            </Button>
            <Button type="submit" className="rounded-xl bg-[var(--accent-strong)] px-4 py-3 text-[var(--bg-card)]">
              {mode === 'edit' ? '儲存變更' : '儲存'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
