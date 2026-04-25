'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Moon, Palette, SlidersHorizontal, Type } from 'lucide-react';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';
import type { FontSizeLevel, ThemeColor, VisualPreference } from '@/lib/types';
import {
  getSupabaseSession,
  getSupabaseUser,
  signInWithEmailPassword,
  signOutSupabaseUser
} from '@/lib/supabase-auth';
import { getSupabaseMissingEnvKeys } from '@/lib/supabase-client';

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
  const { settings, setThemeColor, setFontSizeLevel, setDarkMode, setVisualPreference, resetToSeed } = useTripStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authStatus, setAuthStatus] = useState<'unknown' | 'signed_in' | 'anonymous' | 'signed_out'>('unknown');
  const [signedInEmail, setSignedInEmail] = useState('');

  const missingEnv = useMemo(() => getSupabaseMissingEnvKeys(), []);

  const refreshAuthState = async () => {
    const session = await getSupabaseSession();
    const user = await getSupabaseUser();

    if (!session || !user) {
      setAuthStatus('signed_out');
      setSignedInEmail('');
      return;
    }

    if (user.is_anonymous) {
      setAuthStatus('anonymous');
      setSignedInEmail('');
      return;
    }

    setAuthStatus('signed_in');
    setSignedInEmail(user.email ?? '');
  };

  useEffect(() => {
    void refreshAuthState();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setAuthError('請輸入 Email 與密碼。');
      return;
    }

    setIsAuthLoading(true);
    const result = await signInWithEmailPassword(normalizedEmail, password);
    setIsAuthLoading(false);

    if (!result.user) {
      setAuthError('登入失敗，請確認帳號密碼。');
      return;
    }

    setPassword('');
    await refreshAuthState();
  };

  const handleLogout = async () => {
    setAuthError('');
    setIsAuthLoading(true);
    const result = await signOutSupabaseUser();
    setIsAuthLoading(false);

    if (!result.success) {
      setAuthError('登出失敗，請稍後再試。');
      return;
    }

    await refreshAuthState();
  };

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

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">同步帳戶</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          使用同一個帳戶登入，你和同行者可在不同裝置查看同一份旅行資料。
        </p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          目前匿名模式僅限單一裝置，不適合跨裝置同步；若要共用資料，請使用同一組 Email 帳戶登入。
        </p>
        {missingEnv.length > 0 ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            尚未完成 Supabase 設定，請先補上：{missingEnv.join('、')}
          </p>
        ) : (
          <>
            <form onSubmit={handleLogin} className="mt-3 space-y-2">
              <label className="block text-xs text-[var(--text-muted)]">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                />
              </label>
              <label className="block text-xs text-[var(--text-muted)]">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                />
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="rounded-xl border border-[var(--accent-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-medium text-[var(--accent-strong)] disabled:opacity-60"
                >
                  登入
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isAuthLoading}
                  className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-medium text-[var(--text-main)] disabled:opacity-60"
                >
                  登出
                </button>
              </div>
            </form>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {authStatus === 'signed_in' && signedInEmail
                ? `目前已登入：${signedInEmail}`
                : authStatus === 'anonymous'
                  ? '目前為匿名模式（僅此裝置可用）。'
                  : authStatus === 'signed_out'
                    ? '目前尚未登入共享帳戶。'
                    : '正在檢查登入狀態...'}
            </p>
            {authError ? <p className="mt-1 text-xs text-rose-600">{authError}</p> : null}
          </>
        )}
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">維護操作</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">僅在需要時使用，會將行程資料還原為初始狀態。</p>
        <button
          type="button"
          onClick={resetToSeed}
          className="mt-3 w-full rounded-xl border border-[var(--accent-soft)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-medium text-[var(--accent-strong)]"
        >
          重設預設資料
        </button>
      </section>
    </div>
  );
}
