'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AlertTriangle, Coins, PieChart } from 'lucide-react';
import { useTripStore } from '@/store/use-trip-store';

type BudgetCategory = '餐飲' | '交通' | '住宿' | '觀光' | '購物' | '其他';

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

export function BudgetScreen() {
  const { trip, activities, shoppingItems, setTotalBudget } = useTripStore();
  const [editingBudget, setEditingBudget] = useState(String(trip.totalBudget));

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

  const handleSaveBudget = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTotalBudget(Number(editingBudget || 0));
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">預算</h1>
        <p className="text-sm text-[var(--text-muted)]">行程花費 + 購物金額整合統計，簡潔掌握首爾旅費節奏。</p>
      </header>

      <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
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

      <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
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

      <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
        <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">購物預算追蹤</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <StatCard label="購物預估" value={`₩${estimatedShoppingSpend.toLocaleString()}`} />
          <StatCard label="購物實際（已買）" value={`₩${actualShoppingSpend.toLocaleString()}`} />
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
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
    </div>
  );
}

function StatCard({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2 py-2.5">
      <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${emphasize ? 'text-[var(--accent-strong)]' : 'text-[var(--text-main)]'}`}>{value}</p>
    </div>
  );
}
