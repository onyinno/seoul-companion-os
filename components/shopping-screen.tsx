'use client';

import { FormEvent, useMemo, useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useTripStore } from '@/store/use-trip-store';
import { Button } from '@/components/ui/button';
import type { ShoppingCategory, ShoppingItem } from '@/lib/types';

const shoppingCategories: ShoppingCategory[] = [
  '零食 / 手信',
  '美妝 / 護膚',
  '服飾 / 配件',
  '生活 / 雜貨',
  '藥妝 / 健康',
  '其他'
];

export function ShoppingScreen() {
  const { shoppingItems, toggleShoppingItem, addShoppingItem, removeShoppingItem } = useTripStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ShoppingCategory>('零食 / 手信');
  const [area, setArea] = useState('');
  const [note, setNote] = useState('');
  const [deletingItem, setDeletingItem] = useState<ShoppingItem | null>(null);

  const pendingItems = useMemo(() => shoppingItems.filter((item) => !item.completed), [shoppingItems]);
  const completedItems = useMemo(() => shoppingItems.filter((item) => item.completed), [shoppingItems]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addShoppingItem({ title, category, area, note });
    setTitle('');
    setArea('');
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
          <p className="text-sm text-[var(--text-muted)]">旅行期間購物清單，分開追蹤待買與已買項目。</p>
        </header>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <p className="text-sm text-[var(--text-secondary)]">進度</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text-main)]">已買 {completedItems.length} / {shoppingItems.length} 項</p>
          <div className="mt-3 h-2 rounded-full bg-[var(--balance-bluegrey-soft)]">
            <div
              className="h-full rounded-full bg-[var(--accent-primary)]"
              style={{ width: `${shoppingItems.length === 0 ? 0 : (completedItems.length / shoppingItems.length) * 100}%` }}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">新增購物項目</h2>
          <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ShoppingCategory)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
            >
              {shoppingCategories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              placeholder="輸入要購買的項目"
            />
            <input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              placeholder="地區（例如：Myeongdong，可選）"
            />
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
          <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--balance-bluegrey-deep)]">待買</h3>
              <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">{pendingItems.length}</span>
            </div>
            <ul className="mt-3 space-y-2">
              {pendingItems.map((item) => (
                <li key={item.id} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleShoppingItem(item.id)}
                        className="mt-1 h-4 w-4 rounded border-[var(--border-soft)] accent-[var(--accent-strong)]"
                      />
                      <span>
                        <p className="text-sm font-medium text-[var(--text-main)]">{item.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.category}</p>
                        {item.area && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <MapPin className="h-3.5 w-3.5" /> {item.area}
                          </p>
                        )}
                        {item.note && <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.note}</p>}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
                      aria-label={`刪除 ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
              {pendingItems.length === 0 && <li className="text-sm text-[var(--text-muted)]">太好啦，待買項目已清空。</li>}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--balance-bluegrey-deep)]">已買</h3>
              <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">{completedItems.length}</span>
            </div>
            <ul className="mt-3 space-y-2">
              {completedItems.map((item) => (
                <li key={item.id} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleShoppingItem(item.id)}
                        className="mt-1 h-4 w-4 rounded border-[var(--border-soft)] accent-[var(--accent-strong)]"
                      />
                      <span>
                        <p className="text-sm font-medium text-[var(--text-main)] line-through opacity-70">{item.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.category}</p>
                        {item.area && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <MapPin className="h-3.5 w-3.5" /> {item.area}
                          </p>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
                      aria-label={`刪除 ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
              {completedItems.length === 0 && <li className="text-sm text-[var(--text-muted)]">尚未有已買項目。</li>}
            </ul>
          </div>
        </section>
      </div>

      {deletingItem && (
        <div className="fixed inset-0 z-[70] bg-[color:var(--balance-bluegrey-deep)]/45">
          <section className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <h3 className="text-lg font-semibold text-[var(--text-main)]">確認移除購物項目？</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{deletingItem.title}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => setDeletingItem(null)} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-[var(--balance-bluegrey-deep)]">取消</Button>
              <Button onClick={handleConfirmDelete} className="rounded-xl bg-[var(--accent-strong)] px-4 py-3 text-[var(--bg-card)]">確認移除</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
