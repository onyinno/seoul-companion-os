'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Image as ImageIcon, MapPin, Plus, Save } from 'lucide-react';
import { formatDate, googleMapsSearchUrl, weatherLabel } from '@/lib/utils';
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

const presetCovers = [
  {
    id: 'hangang-sunset',
    label: '漢江日落',
    description: '暖白天空 × 珊瑚晚霞 × 寧靜河面倒影',
    style: 'linear-gradient(145deg, #f9f4ea 8%, #f3c4a8 42%, #dbb39a 64%, #a4b3c2 100%)'
  },
  {
    id: 'hongdae-night',
    label: '弘大夜色',
    description: '柔和夜街感，帶一點克制霓虹',
    style: 'linear-gradient(145deg, #222a38 5%, #3b4257 48%, #56607a 76%, #c18aa6 100%)'
  },
  {
    id: 'seongsu-industrial',
    label: '聖水工業感',
    description: '柔灰混凝土 × 藍灰平衡 × 極簡質感',
    style: 'linear-gradient(145deg, #d9dce1 0%, #bfc6cf 45%, #93a2b1 100%)'
  },
  {
    id: 'seoul-morning',
    label: '首爾晨光',
    description: '淡黃晨光與微霧，乾淨而平靜',
    style: 'linear-gradient(145deg, #f9f1d7 0%, #f1e6c3 45%, #d6dde6 100%)'
  }
] as const;

const defaultCoverId = presetCovers[0].id;
const coverValueFromPreset = (id: string) => `preset:${id}`;

const resolveCoverPreview = (coverImage: string) => {
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return { type: 'image' as const, value: coverImage };
  }

  if (coverImage.startsWith('preset:')) {
    const id = coverImage.replace('preset:', '');
    const matched = presetCovers.find((cover) => cover.id === id);
    if (matched) return { type: 'gradient' as const, value: matched.style };
  }

  const fallback = presetCovers.find((cover) => cover.id === defaultCoverId) ?? presetCovers[0];
  return { type: 'gradient' as const, value: fallback.style };
};

export function TripScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [coverMode, setCoverMode] = useState<'preset' | 'url'>('preset');
  const [selectedPresetCover, setSelectedPresetCover] = useState<string>(defaultCoverId);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [baseArea, setBaseArea] = useState('');
  const [hotel, setHotel] = useState('');
  const [savedState, setSavedState] = useState<'idle' | 'saved'>('idle');

  const {
    trip,
    days,
    activities,
    selectedDayId,
    selectDay,
    addActivity,
    updateActivity,
    deleteActivity,
    moveActivityUp,
    moveActivityDown,
    updateTripBasicInfo,
    setTripCoverImage
  } = useTripStore();
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const dayActivities = useMemo(
    () => activities.filter((activity) => activity.dayId === selectedDay.id).sort((a, b) => a.order - b.order),
    [activities, selectedDay.id]
  );
  const coverPreview = useMemo(() => resolveCoverPreview(trip.coverImage), [trip.coverImage]);

  const buildActivityMapQuery = (activity: Activity) => {
    const overrideUrl = activity.googleMapsUrl?.trim();
    if (overrideUrl) return overrideUrl;

    const address = activity.address?.trim();
    if (address) return address;

    const place = activity.place.trim();
    if (!place) return '';

    const area = selectedDay.district?.trim();
    if (area) return `${place} ${area} Seoul`;
    return place;
  };

  useEffect(() => {
    if (!deletingActivity) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [deletingActivity]);

  useEffect(() => {
    setTripTitle(trip.title);
    setEndDate(trip.endDate);
    setDepartureDate(trip.departureDate);
    setBaseArea(trip.baseArea);
    setHotel(trip.hotel);

    if (trip.coverImage.startsWith('http://') || trip.coverImage.startsWith('https://')) {
      setCoverMode('url');
      setCustomCoverUrl(trip.coverImage);
      return;
    }

    const presetId = trip.coverImage.startsWith('preset:') ? trip.coverImage.replace('preset:', '') : defaultCoverId;
    const matchedPreset = presetCovers.find((cover) => cover.id === presetId)?.id ?? defaultCoverId;
    setCoverMode('preset');
    setSelectedPresetCover(matchedPreset);
    setCustomCoverUrl('');
  }, [trip]);

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingActivity(null);
  };

  const handleCreate = (input: {
    dayId: string;
    category: ActivityCategory;
    time: string;
    place: string;
    address?: string;
    googleMapsUrl?: string;
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
    address?: string;
    googleMapsUrl?: string;
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

  const handleSaveTripInfo = () => {
    updateTripBasicInfo({
      title: tripTitle,
      startDate: departureDate,
      endDate,
      departureDate,
      baseArea,
      hotel
    });

    if (coverMode === 'url') {
      setTripCoverImage(customCoverUrl);
    } else {
      setTripCoverImage(coverValueFromPreset(selectedPresetCover));
    }

    setSavedState('saved');
    window.setTimeout(() => setSavedState('idle'), 1500);
  };

  return (
    <>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">行程</h1>
          <p className="text-sm text-[var(--text-muted)]">首爾單一行程 · 使用上移 / 下移穩定排序</p>
        </header>

        <section className="surface-raised overflow-hidden rounded-3xl">
          <div className="relative h-36 w-full">
            {coverPreview.type === 'image' ? (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${coverPreview.value})` }}
                aria-label="旅程封面預覽"
              />
            ) : (
              <div className="h-full w-full" style={{ background: coverPreview.value }} aria-label="旅程封面預覽" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-[var(--bg-card)]">
              <p className="text-xs opacity-90">旅程封面</p>
              <p className="line-clamp-1 text-base font-semibold">{trip.title}</p>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">旅程基本資料</h2>
            <div className="grid grid-cols-1 gap-2">
              <Field label="旅程名稱" value={tripTitle} onChange={setTripTitle} placeholder="例如：2026 首爾療癒散步旅" />
              <div className="grid grid-cols-2 gap-2">
                <DateField label="出發日期" value={departureDate} onChange={setDepartureDate} />
                <DateField label="回程日期" value={endDate} onChange={setEndDate} />
              </div>
              <Field label="Base area" value={baseArea} onChange={setBaseArea} placeholder="例如：弘大 / 聖水" />
              <Field label="酒店名稱" value={hotel} onChange={setHotel} placeholder="例如：Maple Mansion Hongdae" />
            </div>

            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--balance-bluegrey-deep)]">
                <ImageIcon className="h-4 w-4" /> 封面設定
              </h3>

              <div className="mt-2 flex rounded-xl bg-[var(--bg-card)] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCoverMode('preset')}
                  className={cn('flex-1 rounded-lg px-2 py-1.5', coverMode === 'preset' ? 'bg-[var(--balance-bluegrey-deep)] text-[var(--bg-card)]' : 'text-[var(--text-secondary)]')}
                >
                  精選封面
                </button>
                <button
                  type="button"
                  onClick={() => setCoverMode('url')}
                  className={cn('flex-1 rounded-lg px-2 py-1.5', coverMode === 'url' ? 'bg-[var(--balance-bluegrey-deep)] text-[var(--bg-card)]' : 'text-[var(--text-secondary)]')}
                >
                  自訂網址
                </button>
              </div>

              {coverMode === 'preset' ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {presetCovers.map((cover) => {
                    const active = selectedPresetCover === cover.id;
                    return (
                      <button
                        key={cover.id}
                        type="button"
                        onClick={() => setSelectedPresetCover(cover.id)}
                        className={cn('overflow-hidden rounded-xl border text-left', active ? 'border-[var(--accent-primary)]' : 'border-[var(--border-soft)]')}
                      >
                        <div className="h-14 w-full" style={{ background: cover.style }} />
                        <div className="p-2">
                          <p className="text-xs font-medium text-[var(--text-main)]">{cover.label}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{cover.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <input
                    type="url"
                    value={customCoverUrl}
                    onChange={(event) => setCustomCoverUrl(event.target.value)}
                    placeholder="https://example.com/seoul-cover.jpg"
                    className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-main)]"
                  />
                  <p className="text-[11px] text-[var(--text-muted)]">支援自訂圖片網址（本任務未包含上載檔案）。</p>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSaveTripInfo}
              className="w-full rounded-xl bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-medium text-[var(--bg-card)]"
            >
              <Save className="mr-1 h-4 w-4" />
              儲存旅程資料
            </Button>
            {savedState === 'saved' && <p className="text-center text-xs text-[var(--text-secondary)]">已儲存，重新整理後仍會保留。</p>}
          </div>
        </section>

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
                {(() => {
                  const query = buildActivityMapQuery(activity);
                  const href = query.startsWith('http') ? query : googleMapsSearchUrl(query);
                  if (!href) return null;
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--balance-bluegrey-deep)] underline-offset-2 hover:underline"
                    >
                      在 Google 地圖開啟 <ExternalLink className="h-3 w-3" />
                    </a>
                  );
                })()}
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

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-main)]"
      />
    </label>
  );
}

function DateField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-main)]"
      />
    </label>
  );
}
