'use client';

import { Moon, Palette, SlidersHorizontal, Type } from 'lucide-react';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';
import type { FontSizeLevel, ThemeColor, VisualPreference } from '@/lib/types';

const themeOptions: { value: ThemeColor; label: string; description: string }[] = [
  { value: 'seoul', label: '首爾柔和', description: '預設色系，平衡而清爽。' },
  { value: 'rose', label: '暖玫瑰', description: '稍微偏暖、柔軟可愛。' },
  { value: 'mint', label: '薄荷灰藍', description: '冷靜清透、夜間也舒適。' }
];

const fontOptions: { value: FontSizeLevel; label: string; preview: string }[] = [
  { value: 'sm', label: '小', preview: '資訊更密集' },
  { value: 'md', label: '中', preview: '閱讀最平衡' },
  { value: 'lg', label: '大', preview: '更易讀' }
];

const visualOptions: { value: VisualPreference; label: string; description: string }[] = [
  { value: 'lightweight', label: '輕量', description: '更緊湊，適合快速查看。' },
  { value: 'simple', label: '簡潔', description: '預設節奏，最穩定。' },
  { value: 'comfortable', label: '舒展', description: '更寬鬆，觸控更安全。' }
];

export function SettingsScreen() {
  const { settings, setThemeColor, setFontSizeLevel, setDarkMode, setVisualPreference } = useTripStore();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">設定</h1>
        <p className="text-sm text-[var(--text-muted)]">按你的旅行節奏調整畫面，保持 calm、好讀、手機友善。</p>
      </header>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
          <Palette className="h-4 w-4" /> 主題色切換
        </h2>
        <div className="mt-3 space-y-2">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setThemeColor(option.value)}
              className={cn(
                'w-full rounded-2xl border px-3 py-2.5 text-left transition',
                settings.themeColor === option.value
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-surface)]'
                  : 'border-[var(--border-soft)] bg-[var(--bg-surface)]'
              )}
            >
              <p className="text-sm font-medium text-[var(--text-main)]">{option.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{option.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
          <Type className="h-4 w-4" /> 字體大小
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {fontOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFontSizeLevel(option.value)}
              className={cn(
                'rounded-2xl border px-2 py-2 text-center transition',
                settings.fontSizeLevel === option.value
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-surface)]'
                  : 'border-[var(--border-soft)] bg-[var(--bg-surface)]'
              )}
            >
              <p className="text-sm font-semibold text-[var(--text-main)]">{option.label}</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{option.preview}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
          <Moon className="h-4 w-4" /> 深色模式
        </h2>
        <label className="mt-3 flex items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2.5">
          <span className="text-sm text-[var(--text-main)]">啟用深色模式</span>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(event) => setDarkMode(event.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-soft)] accent-[var(--accent-strong)]"
          />
        </label>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
          <SlidersHorizontal className="h-4 w-4" /> 視覺偏好
        </h2>
        <div className="mt-3 space-y-2">
          {visualOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setVisualPreference(option.value)}
              className={cn(
                'w-full rounded-2xl border px-3 py-2.5 text-left transition',
                settings.visualPreference === option.value
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-surface)]'
                  : 'border-[var(--border-soft)] bg-[var(--bg-surface)]'
              )}
            >
              <p className="text-sm font-medium text-[var(--text-main)]">{option.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{option.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
