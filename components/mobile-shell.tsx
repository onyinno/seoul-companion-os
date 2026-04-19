'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpenCheck, CalendarDays, House, ListChecks } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: '首頁', icon: House },
  { href: '/trip', label: '行程', icon: CalendarDays },
  { href: '/bookings', label: '預約', icon: BookOpenCheck },
  { href: '/prep', label: '準備', icon: ListChecks }
];

const SWIPE_THRESHOLD = 70;
const SWIPE_RATIO = 1.4;
const IOS_EDGE_GUARD = 24;

const pageSlideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 64 : -64,
    opacity: 0.85
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -64 : 64,
    opacity: 0.85
  })
};

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const startedFromEdge = useRef(false);
  const [direction, setDirection] = useState(0);
  const prevIndexRef = useRef(0);

  const activeIndex = useMemo(() => {
    const index = nav.findIndex((item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
    return index === -1 ? 0 : index;
  }, [pathname]);

  const activeRouteKey = nav[activeIndex]?.href ?? '/';

  useEffect(() => {
    const previous = prevIndexRef.current;
    if (previous !== activeIndex) {
      setDirection(activeIndex > previous ? 1 : -1);
      prevIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  const navigateToIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex > nav.length - 1 || nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    router.push(nav[nextIndex].href);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement;
    const scrollable = target.closest('.no-scrollbar');
    if (scrollable) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    startedFromEdge.current = touch.clientX <= IOS_EDGE_GUARD;
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLElement> = (event) => {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    touchStart.current = null;

    if (absDx < SWIPE_THRESHOLD) return;
    if (absDx < absDy * SWIPE_RATIO) return;
    if (startedFromEdge.current && dx > 0) return;

    if (dx < 0) {
      navigateToIndex(activeIndex + 1);
      return;
    }

    navigateToIndex(activeIndex - 1);
  };

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={activeRouteKey}
          custom={direction}
          variants={pageSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[var(--border-soft)] bg-[color:var(--bg-card)]/95 p-2 shadow-soft backdrop-blur">
        <ul className="grid grid-cols-4 gap-2">
          {nav.map(({ href, label, icon: Icon }, index) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setDirection(index > activeIndex ? 1 : -1)}
                  className={cn(
                    'flex h-12 items-center justify-center gap-1 rounded-xl text-sm font-medium transition',
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
