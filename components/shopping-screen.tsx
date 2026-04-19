'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';
import type { ShoppingAreaTag, ShoppingCategory, ShoppingItem } from '@/lib/types';

const shoppingCategories: ShoppingCategory[] = [
  '美妝 / 護膚',
  '服飾 / 配件',
  '零食 / 食品',
  '生活雜貨',
  '電子 / 配件',
  '手信'
];

const areaTags: ShoppingAreaTag[] = [
  '弘大',
  '延南',
  '聖水',
  '明洞',
  'Olive Young',
  'Daiso',
  '便利店'
];

const areaToneMap: Record<ShoppingAreaTag, string> = {
  弘大: 'bg-[var(--balance-bluegrey-soft)] text-[var(--balance-bluegrey-deep)]',
  延南: 'bg-[var(--balance-bluegrey-soft)] text-[var(--balance-bluegrey-deep)]',
  聖水: 'bg-[var(--balance-bluegrey-soft)] text-[var(--balance-bluegrey-deep)]',
  明洞: 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  'Olive Young': 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  Daiso: 'bg-[var(--bg-surface)] text-[var(--text-secondary)]',
  便利店: 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
};

export function ShoppingScreen() {
  const { shoppingItems, toggleShoppingItem, addShoppingItem, removeShoppingItem } = useTripStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ShoppingCategory>('美妝 / 護膚');
  const [areaTag, setAreaTag] = useState<ShoppingAreaTag>('弘大');
  const [note, setNote] = useState('');
  const [deletingItem, setDeletingItem] = useState<ShoppingItem | null>(null);

  const pendingItems = useMemo(() => shoppingItems.filter((item) => !item.completed), [shoppingItems]);
  const completedItems = useMemo(() => shoppingItems.filter((item) => item.completed), [shoppingItems]);
  const completedCount = completedItems.length;
  const totalCount = shoppingItems.length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addShoppingItem({ title, category, areaTag, note });
    setTitle('');
    setNote('');
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    removeShoppingItem(deletingItem.id);
    setDeletingItem(null);
  };

  return (
    <>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">購物</h1>
          <p className="text-sm text-[var(--text-muted)]">首爾採買清單，保持從容節奏與清晰優先順序。</p>
        </header>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">採買進度</p>
              <p className="mt-1 text-xl font-semibold text-[var(--text-main)]">已買 {completedCount} / {totalCount} 件</p>
            </div>
            <div className="rounded-2xl bg-[var(--bg-surface)] p-2.5 text-[var(--balance-bluegrey-deep)]">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[var(--balance-bluegrey-soft)]">
            <div
              className="h-full rounded-full bg-[var(--accent-primary)]"
              style={{ width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%` }}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">新增採買項目</h2>
          <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              placeholder="輸入品項名稱（例如：防曬棒）"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as ShoppingCategory)}
                className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              >
                {shoppingCategories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select
                value={areaTag}
                onChange={(event) => setAreaTag(event.target.value as ShoppingAreaTag)}
                className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              >
                {areaTags.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              placeholder="備註（可選）"
            />
            <Button type="submit" className="w-full rounded-xl bg-[var(--accent-strong)] px-4 py-2.5 text-sm text-[var(--bg-card)]">
              <Plus className="mr-1 h-4 w-4" /> 新增項目
            </Button>
          </form>
        </section>

        <section className="space-y-3">
          <article className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">待買</h2>
              <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">{pendingItems.length} 項</span>
            </div>
            {pendingItems.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">太好了，待買項目已清空。</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingItems.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleShoppingItem(item.id)}
                    onDelete={() => setDeletingItem(item)}
                  />
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">已買</h2>
              <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">{completedItems.length} 項</span>
            </div>
            {completedItems.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">尚未完成採買項目。</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {completedItems.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleShoppingItem(item.id)}
                    onDelete={() => setDeletingItem(item)}
                  />
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>

      {deletingItem && (
        <div className="fixed inset-0 z-[70] bg-[color:var(--balance-bluegrey-deep)]/45">
          <section className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <h3 className="text-lg font-semibold text-[var(--text-main)]">確認刪除採買項目？</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{deletingItem.title}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">刪除後不會自動還原，請確認後再繼續。</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => setDeletingItem(null)} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-[var(--balance-bluegrey-deep)]">取消</Button>
              <Button onClick={handleConfirmDelete} className="rounded-xl bg-[var(--accent-strong)] px-4 py-3 text-[var(--bg-card)]">確認刪除</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function ShoppingRow({ item, onToggle, onDelete }: { item: ShoppingItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <li className={cn('rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2.5', item.completed && 'opacity-85')}>
      <div className="flex items-start justify-between gap-2">
        <label className="flex min-w-0 flex-1 items-start gap-2">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={onToggle}
            className="mt-1 h-4 w-4 rounded border-[var(--border-soft)] accent-[var(--accent-strong)]"
          />
          <span className="min-w-0">
            <p className={cn('truncate text-sm font-medium text-[var(--text-main)]', item.completed && 'line-through text-[var(--text-muted)]')}>
              {item.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[var(--bg-card)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">{item.category}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', areaToneMap[item.areaTag])}>{item.areaTag}</span>
            </div>
            {item.note && <p className="mt-1 text-xs text-[var(--text-muted)]">{item.note}</p>}
          </span>
        </label>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
          aria-label={`刪除 ${item.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
