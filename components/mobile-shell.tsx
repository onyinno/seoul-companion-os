'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpenCheck, CalendarDays, House, ListChecks } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardScreen } from '@/components/dashboard';
import { TripScreen } from '@/components/trip-screen';
import { BookingsScreen } from '@/components/bookings-screen';
import { PrepScreen } from '@/components/prep-screen';

type TopTab = 'home' | 'trip' | 'bookings' | 'prep';

const nav: { key: TopTab; href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'home', href: '/', label: '首頁', icon: House },
  { key: 'trip', href: '/trip', label: '行程', icon: CalendarDays },
  { key: 'bookings', href: '/bookings', label: '預約', icon: BookOpenCheck },
  { key: 'prep', href: '/prep', label: '準備', icon: ListChecks }
];

const SWIPE_THRESHOLD = 70;
const SWIPE_RATIO = 1.4;
const IOS_EDGE_GUARD = 24;

const pageSlideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? '22%' : '-22%',
    opacity: 0.96
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? '-22%' : '22%',
    opacity: 0.96
  })
};

const tabFromPath = (pathname: string): TopTab => {
  if (pathname.startsWith('/trip')) return 'trip';
  if (pathname.startsWith('/bookings')) return 'bookings';
  if (pathname.startsWith('/prep')) return 'prep';
  return 'home';
};

const screenByTab: Record<TopTab, React.ReactNode> = {
  home: <DashboardScreen />,
  trip: <TripScreen />,
  bookings: <BookingsScreen />,
  prep: <PrepScreen />
};

export function MobileShell() {
  const pathname = usePathname();
  const router = useRouter();

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [startedFromEdge, setStartedFromEdge] = useState(false);
  const [activeTab, setActiveTab] = useState<TopTab>(() => tabFromPath(pathname));
  const [direction, setDirection] = useState(0);

  const activeIndex = useMemo(() => nav.findIndex((item) => item.key === activeTab), [activeTab]);

  useEffect(() => {
    const nextTab = tabFromPath(pathname);
    if (nextTab === activeTab) return;
    const nextIndex = nav.findIndex((item) => item.key === nextTab);
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveTab(nextTab);
  }, [pathname, activeTab, activeIndex]);

  useEffect(() => {
    const target = nav.find((item) => item.key === activeTab);
    if (!target) return;
    if (pathname === target.href) return;
    router.push(target.href);
  }, [activeTab, pathname, router]);

  useEffect(() => {
    const prev = nav[activeIndex - 1];
    const next = nav[activeIndex + 1];
    if (prev) router.prefetch(prev.href);
    if (next) router.prefetch(next.href);
  }, [activeIndex, router]);

  const switchTabByIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex > nav.length - 1 || nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveTab(nav[nextIndex].key);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement;
    const scrollable = target.closest('.no-scrollbar');
    if (scrollable) {
      setTouchStart(null);
      return;
    }

    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setStartedFromEdge(touch.clientX <= IOS_EDGE_GUARD);
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLElement> = (event) => {
    if (!touchStart) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    setTouchStart(null);

    if (absDx < SWIPE_THRESHOLD) return;
    if (absDx < absDy * SWIPE_RATIO) return;
    if (startedFromEdge && dx > 0) return;

    if (dx < 0) {
      switchTabByIndex(activeIndex + 1);
      return;
    }

    switchTabByIndex(activeIndex - 1);
  };

  return (
    <main
      className="mx-auto flex h-screen w-full max-w-md flex-col px-4 pb-24 pt-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={pageSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-y-auto"
          >
            {screenByTab[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[var(--border-soft)] bg-[color:var(--bg-card)]/95 p-2 shadow-soft backdrop-blur">
        <ul className="grid grid-cols-4 gap-2">
          {nav.map(({ key, href, label, icon: Icon }, index) => {
            const active = activeTab === key;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={(event) => {
                    event.preventDefault();
                    switchTabByIndex(index);
                  }}
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
