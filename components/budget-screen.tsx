'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Coins, PieChart, RefreshCcw } from 'lucide-react';
import { useTripStore } from '@/store/use-trip-store';

type BudgetCategory = '餐飲' | '交通' | '住宿' | '觀光' | '購物' | '其他';

type ExchangeRateApiResponse = {
  base: 'KRW';
  quote: 'HKD';
  rate: number;
  date: string | null;
  fetchedAt: string;
  source: 'frankfurter' | 'fallback';
  isFallback: boolean;
};

const budgetCategories: BudgetCategory[] = ['餐飲', '交通', '住宿', '觀光', '購物', '其他'];

const categoryColor: Record<BudgetCategory, string> = {
  餐飲: '#E5747B',
  交通: '#7E98B8',
  住宿: '#8A74B8',
  觀光: '#6AAFA5',
  購物: '#F29C6B',
  其他: '#A5AFBE'
};

const categoryFromActivity: Record<string, BudgetCategory> = {
  food: '餐飲',
  cafe: '餐飲',
  transport: '交通',
  hotel: '住宿',
  sightseeing: '觀光',
  shopping: '購物',
  other: '其他'
};

const SAFE_DEFAULT_RATE = 0.0057;
const STORAGE_KEY = 'budget.exchange.krw_hkd';

export function BudgetScreen() {
  const { trip, activities, shoppingItems, setTotalBudget } = useTripStore();
  const [editingBudget, setEditingBudget] = useState(String(trip.totalBudget));
  const [exchangeRate, setExchangeRate] = useState<number>(SAFE_DEFAULT_RATE);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRateLoading, setIsRateLoading] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [krwInput, setKrwInput] = useState('10000');
  const [hkdInput, setHkdInput] = useState((10000 * SAFE_DEFAULT_RATE).toFixed(2));

  const spentByCategory = useMemo(() => {
    const summary = Object.fromEntries(budgetCategories.map((category) => [category, 0])) as Record<BudgetCategory, number>;

    for (const activity of activities) {
      const category = categoryFromActivity[activity.category] ?? '其他';
      summary[category] += Math.max(0, activity.cost || 0);
    }

    const shoppingActual = shoppingItems
      .filter((item) => item.completed)
      .reduce((acc, item) => acc + Math.max(0, item.actualCost || 0), 0);
    summary['購物'] += shoppingActual;

    return summary;
  }, [activities, shoppingItems]);

  const estimatedShoppingSpend = useMemo(
    () => shoppingItems.reduce((acc, item) => acc + Math.max(0, item.estimatedCost || 0), 0),
    [shoppingItems]
  );
  const actualShoppingSpend = useMemo(
    () => shoppingItems.filter((item) => item.completed).reduce((acc, item) => acc + Math.max(0, item.actualCost || 0), 0),
    [shoppingItems]
  );

  const totalSpent = useMemo(
    () => budgetCategories.reduce((acc, category) => acc + spentByCategory[category], 0),
    [spentByCategory]
  );

  const remaining = trip.totalBudget - totalSpent;
  const usageRatio = trip.totalBudget === 0 ? 0 : Math.min(1, totalSpent / trip.totalBudget);
  const overSpentAmount = Math.max(0, totalSpent - trip.totalBudget);

  const pieGradient = useMemo(() => {
    if (totalSpent <= 0) {
      return 'conic-gradient(var(--balance-bluegrey-soft) 0deg 360deg)';
    }

    let currentDeg = 0;
    const stops = budgetCategories
      .map((category) => {
        const amount = spentByCategory[category];
        if (amount <= 0) return null;
        const deg = (amount / totalSpent) * 360;
        const start = currentDeg;
        currentDeg += deg;
        return `${categoryColor[category]} ${start}deg ${currentDeg}deg`;
      })
      .filter(Boolean);

    return `conic-gradient(${stops.join(', ')})`;
  }, [spentByCategory, totalSpent]);

  useEffect(() => {
    const bootstrap = () => {
      try {
        const savedRaw = localStorage.getItem(STORAGE_KEY);
        if (!savedRaw) return;

        const saved = JSON.parse(savedRaw) as { rate?: number; updatedAt?: string };
        if (typeof saved.rate === 'number' && !Number.isNaN(saved.rate) && saved.rate > 0) {
          setExchangeRate(saved.rate);
          setKrwInput((krw) => (Number(krw || 0) || 0).toString());
          setHkdInput((Number(krwInput || 0) * saved.rate).toFixed(2));
          setLastUpdated(saved.updatedAt ?? null);
        }
      } catch {
        // no-op
      }
    };

    bootstrap();

    const fetchRate = async () => {
      setIsRateLoading(true);
      setRateError(null);

      try {
        const response = await fetch('/api/exchange-rate', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('無法取得即時匯率');
        }

        const data = (await response.json()) as ExchangeRateApiResponse;
        if (typeof data.rate !== 'number' || Number.isNaN(data.rate) || data.rate <= 0) {
          throw new Error('匯率格式異常');
        }

        if (data.source === 'frankfurter' && !data.isFallback) {
          setExchangeRate(data.rate);
          setLastUpdated(data.fetchedAt);
          setIsUsingFallback(false);
          setHkdInput((Number(krwInput || 0) * data.rate).toFixed(2));

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              rate: data.rate,
              updatedAt: data.fetchedAt
            })
          );
        } else {
          throw new Error('服務目前使用備援匯率');
        }
      } catch (error) {
        let recovered = false;
        try {
          const savedRaw = localStorage.getItem(STORAGE_KEY);
          if (savedRaw) {
            const saved = JSON.parse(savedRaw) as { rate?: number; updatedAt?: string };
            if (typeof saved.rate === 'number' && !Number.isNaN(saved.rate) && saved.rate > 0) {
              setExchangeRate(saved.rate);
              setLastUpdated(saved.updatedAt ?? null);
              setHkdInput((Number(krwInput || 0) * saved.rate).toFixed(2));
              recovered = true;
            }
          }
        } catch {
          // no-op
        }

        if (!recovered) {
          setExchangeRate(SAFE_DEFAULT_RATE);
          setHkdInput((Number(krwInput || 0) * SAFE_DEFAULT_RATE).toFixed(2));
        }

        setIsUsingFallback(true);
        setRateError(error instanceof Error ? error.message : '匯率服務暫時不可用');
      } finally {
        setIsRateLoading(false);
      }
    };

    fetchRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveBudget = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTotalBudget(Number(editingBudget || 0));
  };

  const handleKrwChange = (value: string) => {
    setKrwInput(value);
    const numeric = Number(value || 0);
    if (!Number.isNaN(numeric)) {
      setHkdInput((numeric * exchangeRate).toFixed(2));
    }
  };

  const handleHkdChange = (value: string) => {
    setHkdInput(value);
    const numeric = Number(value || 0);
    if (!Number.isNaN(numeric)) {
      const nextKrw = exchangeRate <= 0 ? 0 : numeric / exchangeRate;
      setKrwInput(nextKrw.toFixed(0));
    }
  };

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return '尚無更新時間';
    const formatted = new Intl.DateTimeFormat('zh-HK', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(lastUpdated));
    return formatted;
  }, [lastUpdated]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">預算</h1>
        <p className="text-sm text-[var(--text-muted)]">行程花費 + 購物金額整合統計，簡潔掌握首爾旅費節奏。</p>
      </header>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
          <Coins className="h-4 w-4" /> 預算總覽
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <StatCard label="總預算" value={`₩${trip.totalBudget.toLocaleString()}`} />
          <StatCard label="已花費" value={`₩${totalSpent.toLocaleString()}`} />
          <StatCard label="剩餘預算" value={`₩${Math.max(remaining, 0).toLocaleString()}`} emphasize={remaining < 0} />
        </div>
        <div className="mt-3 h-2 rounded-full bg-[var(--balance-bluegrey-soft)]">
          <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${usageRatio * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">已使用 {Math.round(usageRatio * 100)}%</p>
        {overSpentAmount > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--accent-strong)]">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>目前超支 ₩{overSpentAmount.toLocaleString()}，建議優先調整高額活動。</p>
          </div>
        )}
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">編輯總預算</h2>
        <form className="mt-3 flex items-center gap-2" onSubmit={handleSaveBudget}>
          <input
            type="number"
            min={0}
            value={editingBudget}
            onChange={(event) => setEditingBudget(event.target.value)}
            className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
            placeholder="輸入總預算"
          />
          <button type="submit" className="rounded-xl bg-[var(--accent-strong)] px-4 py-2 text-sm font-medium text-[var(--bg-card)]">
            儲存
          </button>
        </form>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">購物預算追蹤</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <StatCard label="購物預估" value={`₩${estimatedShoppingSpend.toLocaleString()}`} />
          <StatCard label="購物實際（已買）" value={`₩${actualShoppingSpend.toLocaleString()}`} />
        </div>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--balance-bluegrey-deep)]">
          <PieChart className="h-4 w-4" /> 類別支出
        </h2>

        <div className="mt-3 flex items-center gap-4">
          <div className="h-24 w-24 rounded-full" style={{ background: pieGradient }} aria-label="支出比例圖" />
          <ul className="flex-1 space-y-1.5 text-sm">
            {budgetCategories.map((category) => (
              <li key={category} className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColor[category] }} />
                  {category}
                </span>
                <span className="font-medium text-[var(--text-main)]">₩{spentByCategory[category].toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 space-y-2">
          {budgetCategories.map((category) => {
            const amount = spentByCategory[category];
            const ratio = trip.totalBudget === 0 ? 0 : Math.min(1, amount / trip.totalBudget);
            return (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>{category}</span>
                  <span>{Math.round(ratio * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--balance-bluegrey-soft)]">
                  <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, backgroundColor: categoryColor[category] }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="surface-raised rounded-3xl p-4">
        <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">KRW ⇄ HKD 換算</h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">使用 Frankfurter 即時匯率，並由本 App 端點統一提供資料。</p>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="surface-raised-soft rounded-2xl p-3">
            <span className="text-xs text-[var(--text-muted)]">韓元 KRW</span>
            <input
              type="number"
              min={0}
              value={krwInput}
              onChange={(event) => handleKrwChange(event.target.value)}
              className="mt-1 w-full bg-transparent text-lg font-semibold text-[var(--text-main)] outline-none"
            />
          </label>

          <label className="surface-raised-soft rounded-2xl p-3">
            <span className="text-xs text-[var(--text-muted)]">港幣 HKD</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={hkdInput}
              onChange={(event) => handleHkdChange(event.target.value)}
              className="mt-1 w-full bg-transparent text-lg font-semibold text-[var(--text-main)] outline-none"
            />
          </label>
        </div>

        <div className="mt-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-secondary)]">
          <p className="flex items-center gap-1">
            <RefreshCcw className={`h-3.5 w-3.5 ${isRateLoading ? 'animate-spin' : ''}`} />
            目前匯率：1 KRW = {exchangeRate.toFixed(6)} HKD
          </p>
          <p className="mt-1">更新時間：{isRateLoading ? '讀取中…' : lastUpdatedLabel}</p>
          {rateError && <p className="mt-1 text-[var(--accent-strong)]">狀態：{rateError}</p>}
          {isUsingFallback && (
            <p className="mt-1 text-[var(--accent-strong)]">備註：目前使用備援匯率（快取或預設值），稍後會自動再嘗試即時更新。</p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="surface-raised-soft rounded-2xl px-2 py-2.5">
      <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${emphasize ? 'text-[var(--accent-strong)]' : 'text-[var(--text-main)]'}`}>{value}</p>
    </div>
  );
}
