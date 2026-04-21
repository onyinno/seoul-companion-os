import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F8F6F1'
      },
      boxShadow: {
        soft: '0 2px 12px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 6px 20px rgba(15, 23, 42, 0.07)',
        nav: '0 4px 14px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
};

export default config;
