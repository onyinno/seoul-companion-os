import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-HK', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }).format(new Date(date));
}

export function daysUntil(date: string) {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function weatherLabel(condition: string) {
  const map: Record<string, string> = {
    'Partly Cloudy': '局部多雲',
    Cloudy: '多雲',
    Sunny: '晴朗',
    Clear: '天晴'
  };

  return map[condition] ?? condition;
}

export function googleMapsSearchUrl(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}
