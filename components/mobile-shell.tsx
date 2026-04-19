'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenCheck, CalendarDays, House } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: '首頁', icon: House },
  { href: '/trip', label: '行程', icon: CalendarDays },
  { href: '/bookings', label: '預約', icon: BookOpenCheck }
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-6">
      {children}
      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-soft backdrop-blur">
        <ul className="grid grid-cols-3 gap-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium transition',
                    active ? 'bg-slate-900 text-white' : 'text-slate-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
