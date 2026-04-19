'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenCheck, CalendarDays, CircleDollarSign, House, ListChecks, Settings, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';

const nav = [
  { href: '/', label: '首頁', icon: House },
  { href: '/trip', label: '行程', icon: CalendarDays },
  { href: '/shopping', label: '購物', icon: ShoppingBag },
  { href: '/budget', label: '預算', icon: CircleDollarSign },
  { href: '/bookings', label: '預約', icon: BookOpenCheck },
  { href: '/prep', label: '準備', icon: ListChecks },
  { href: '/settings', label: '設定', icon: Settings }
];

const pageSlideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? '18%' : '-18%',
    opacity: 0.96
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? '-18%' : '18%',
    opacity: 0.96
  })
};

const getTabIndexFromPath = (pathname: string) => {
  const index = nav.findIndex((item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
  return index === -1 ? 0 : index;
};

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);
  const prevIndexRef = useRef(0);
  const { settings } = useTripStore();

  const activeIndex = useMemo(() => getTabIndexFromPath(pathname), [pathname]);
  const activeRouteKey = nav[activeIndex]?.href ?? '/';

  useEffect(() => {
    const previous = prevIndexRef.current;
    if (previous !== activeIndex) {
      setDirection(activeIndex > previous ? 1 : -1);
      prevIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.darkMode ? 'dark' : 'light';
    root.dataset.accent = settings.themeColor;
    root.dataset.visual = settings.visualPreference;
    root.dataset.fontSize = settings.fontSizeLevel;
  }, [settings]);

  const shellDensityClass = settings.visualPreference === 'comfortable'
    ? 'px-5 pt-7'
    : settings.visualPreference === 'lightweight'
      ? 'px-3 pt-5'
      : 'px-4 pt-6';

  const shellFontClass = settings.fontSizeLevel === 'lg'
    ? 'text-[17px]'
    : settings.fontSizeLevel === 'sm'
      ? 'text-[15px]'
      : 'text-base';

  return (
    <main className={cn('mx-auto flex h-screen w-full max-w-md flex-col pb-24', shellDensityClass, shellFontClass)}>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeRouteKey}
            custom={direction}
            variants={pageSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-y-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[var(--border-soft)] bg-[color:var(--bg-card)]/95 p-2 shadow-soft backdrop-blur">
        <ul className={cn('grid gap-2', nav.length === 7 ? 'grid-cols-7' : nav.length === 6 ? 'grid-cols-6' : nav.length === 5 ? 'grid-cols-5' : 'grid-cols-4')}>
          {nav.map(({ href, label, icon: Icon }, index) => {
            const active = activeIndex === index;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setDirection(index > activeIndex ? 1 : -1)}
                  className={cn(
                    'flex h-12 items-center justify-center gap-1 rounded-xl font-medium transition',
                    nav.length >= 7 ? 'text-xs' : 'text-sm',
                    active ? 'bg-[var(--balance-bluegrey-deep)] text-[var(--bg-card)]' : 'text-[var(--text-secondary)]'
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
