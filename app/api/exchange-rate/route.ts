import { NextResponse } from 'next/server';

const FRANKFURTER_API_URL = 'https://api.frankfurter.app/latest?from=KRW&to=HKD';
const SAFE_DEFAULT_RATE = 0.0057;

export async function GET() {
  try {
    const response = await fetch(FRANKFURTER_API_URL, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Frankfurter response failed: ${response.status}`);
    }

    const data = (await response.json()) as { date?: string; rates?: Record<string, number> };
    const rate = data.rates?.HKD;

    if (typeof rate !== 'number' || Number.isNaN(rate)) {
      throw new Error('Invalid HKD rate payload');
    }

    return NextResponse.json({
      base: 'KRW',
      quote: 'HKD',
      rate,
      date: data.date ?? null,
      fetchedAt: new Date().toISOString(),
      source: 'frankfurter',
      isFallback: false
    });
  } catch (error) {
    console.error('Failed to fetch live exchange rate', error);

    return NextResponse.json(
      {
        base: 'KRW',
        quote: 'HKD',
        rate: SAFE_DEFAULT_RATE,
        date: null,
        fetchedAt: new Date().toISOString(),
        source: 'fallback',
        isFallback: true
      },
      { status: 200 }
    );
  }
}
