'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Pencil, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
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

type ShoppingFormState = {
  title: string;
  category: ShoppingCategory;
  areaTag: ShoppingAreaTag;
  note: string;
  estimatedCost: string;
  actualCost: string;
};

const defaultForm: ShoppingFormState = {
  title: '',
  category: '美妝 / 護膚',
  areaTag: '弘大',
  note: '',
  estimatedCost: '0',
  actualCost: '0'
};

export function ShoppingScreen() {
  const { shoppingItems, toggleShoppingItem, addShoppingItem, updateShoppingItem, removeShoppingItem } = useTripStore();
  const [form, setForm] = useState<ShoppingFormState>(defaultForm);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ShoppingItem | null>(null);

  const pendingItems = useMemo(() => shoppingItems.filter((item) => !item.completed), [shoppingItems]);
  const completedItems = useMemo(() => shoppingItems.filter((item) => item.completed), [shoppingItems]);
  const completedCount = completedItems.length;
  const totalCount = shoppingItems.length;

  const resetForm = () => setForm(defaultForm);

  const openCreateSheet = () => {
    setEditingItem(null);
    resetForm();
    setIsSheetOpen(true);
  };

  const openEditSheet = (item: ShoppingItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      areaTag: item.areaTag,
      note: item.note,
      estimatedCost: String(item.estimatedCost),
      actualCost: String(item.actualCost)
    });
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      category: form.category,
      areaTag: form.areaTag,
      note: form.note,
      estimatedCost: Number(form.estimatedCost || 0),
      actualCost: Number(form.actualCost || 0)
    };

    if (editingItem) {
      updateShoppingItem(editingItem.id, payload);
    } else {
      addShoppingItem(payload);
    }

    closeSheet();
    resetForm();
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
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">採買項目</h2>
            <Button onClick={openCreateSheet} className="rounded-xl bg-[var(--accent-strong)] px-3 py-2 text-xs text-[var(--bg-card)]">
              <Plus className="mr-1 h-4 w-4" /> 新增
            </Button>
          </div>
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
                    onEdit={() => openEditSheet(item)}
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
                    onEdit={() => openEditSheet(item)}
                    onDelete={() => setDeletingItem(item)}
                  />
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>

      {isSheetOpen && (
        <div className="fixed inset-0 z-[70] bg-[color:var(--balance-bluegrey-deep)]/45">
          <button className="h-full w-full" aria-label="關閉編輯面板" onClick={closeSheet} />
          <section className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <header className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text-main)]">{editingItem ? '編輯採買項目' : '新增採買項目'}</h3>
              <Button onClick={closeSheet} className="rounded-full p-2 text-[var(--text-muted)]" aria-label="關閉">
                <X className="h-4 w-4" />
              </Button>
            </header>

            <form className="space-y-2" onSubmit={handleSubmit}>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                placeholder="輸入品項名稱"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as ShoppingCategory }))}
                  className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                >
                  {shoppingCategories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <select
                  value={form.areaTag}
                  onChange={(event) => setForm((prev) => ({ ...prev, areaTag: event.target.value as ShoppingAreaTag }))}
                  className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                >
                  {areaTags.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <input
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                placeholder="備註（可選）"
              />
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 text-xs text-[var(--text-secondary)]">
                  <span>預估價格</span>
                  <input
                    type="number"
                    min={0}
                    value={form.estimatedCost}
                    onChange={(event) => setForm((prev) => ({ ...prev, estimatedCost: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                  />
                </label>
                <label className="space-y-1 text-xs text-[var(--text-secondary)]">
                  <span>實際價格</span>
                  <input
                    type="number"
                    min={0}
                    value={form.actualCost}
                    onChange={(event) => setForm((prev) => ({ ...prev, actualCost: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button type="button" onClick={closeSheet} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-[var(--balance-bluegrey-deep)]">取消</Button>
                <Button type="submit" className="rounded-xl bg-[var(--accent-strong)] px-4 py-3 text-[var(--bg-card)]">{editingItem ? '儲存變更' : '新增項目'}</Button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingItem && (
        <div className="fixed inset-0 z-[80] bg-[color:var(--balance-bluegrey-deep)]/45">
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

function ShoppingRow({
  item,
  onToggle,
  onEdit,
  onDelete
}: {
  item: ShoppingItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
            <p className="mt-1 text-xs text-[var(--text-secondary)]">預估 ₩{item.estimatedCost.toLocaleString()} · 實際 ₩{item.actualCost.toLocaleString()}</p>
            {item.note && <p className="mt-1 text-xs text-[var(--text-muted)]">{item.note}</p>}
          </span>
        </label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-card)] hover:text-[var(--balance-bluegrey-deep)]"
            aria-label={`編輯 ${item.title}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
            aria-label={`刪除 ${item.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
