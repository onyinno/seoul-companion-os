import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '首爾旅伴',
  description: '手機優先的首爾旅遊同行應用程式'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body>{children}</body>
    </html>
  );
}
