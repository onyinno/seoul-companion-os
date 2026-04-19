'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTripStore } from '@/store/use-trip-store';
import { Button } from '@/components/ui/button';
import type { PrepCategory, PrepChecklistItem } from '@/lib/types';

const prepCategories: PrepCategory[] = [
  '文件 / 財務',
  '電子 / 工具',
  '服飾 / 穿搭',
  '盥洗 / 個人護理',
  '醫療 / 健康 / 私人物品',
  '日用品 / 雜項'
];

export function PrepScreen() {
  const { prepItems, prepReminders, togglePrepItem, addPrepItem, removePrepItem } = useTripStore();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<PrepCategory>('文件 / 財務');
  const [deletingItem, setDeletingItem] = useState<PrepChecklistItem | null>(null);

  const completedCount = prepItems.filter((item) => item.completed).length;

  const grouped = useMemo(
    () =>
      prepCategories.map((currentCategory) => ({
        category: currentCategory,
        items: prepItems.filter((item) => item.category === currentCategory)
      })),
    [prepItems]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addPrepItem({ title, category, note });
    setTitle('');
    setNote('');
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    removePrepItem(deletingItem.id);
    setDeletingItem(null);
  };

  return (
    <>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">準備</h1>
          <p className="text-sm text-[var(--text-muted)]">出發前打包清單，一項一項完成更安心。</p>
        </header>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <p className="text-sm text-[var(--text-secondary)]">Checklist 進度</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text-main)]">已完成 {completedCount} / {prepItems.length} 項</p>
          <div className="mt-3 h-2 rounded-full bg-[var(--balance-bluegrey-soft)]">
            <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${prepItems.length === 0 ? 0 : (completedCount / prepItems.length) * 100}%` }} />
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">新增自訂項目</h2>
          <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as PrepCategory)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
            >
              {prepCategories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
              placeholder="輸入項目名稱"
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
          {grouped.map((group) => (
            <details key={group.category} className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft" open>
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--balance-bluegrey-deep)]">{group.category}</h3>
                  <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">{group.items.filter((item) => item.completed).length} / {group.items.length}</span>
                </div>
              </summary>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => togglePrepItem(item.id)}
                          className="mt-1 h-4 w-4 rounded border-[var(--border-soft)] accent-[var(--accent-strong)]"
                        />
                        <span>
                          <p className="text-sm font-medium text-[var(--text-main)]">{item.title}</p>
                          {item.note && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.note}</p>}
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
              </ul>
            </details>
          ))}
        </section>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
          <h2 className="text-base font-semibold text-[var(--balance-bluegrey-deep)]">醫療注意事項</h2>
          <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
            {prepReminders.map((reminder) => (
              <li key={reminder}>• {reminder}</li>
            ))}
          </ul>
        </section>
      </div>

      {deletingItem && (
        <div className="fixed inset-0 z-[70] bg-[color:var(--balance-bluegrey-deep)]/45">
          <section className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-[var(--border-soft)] bg-[var(--bg-card)] p-4 shadow-soft">
            <h3 className="text-lg font-semibold text-[var(--text-main)]">確認移除清單項目？</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{deletingItem.title}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">可於「重設預設資料」後還原預設項目。</p>
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
