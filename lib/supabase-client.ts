import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientStatus = {
  enabled: boolean;
  missingKeys: string[];
};

const SUPABASE_ENV_KEYS = {
  url: 'NEXT_PUBLIC_SUPABASE_URL',
  publishableKey: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
} as const;

function getSupabaseClientStatus(): SupabaseClientStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

  const missingKeys = Object.entries({
    [SUPABASE_ENV_KEYS.url]: url,
    [SUPABASE_ENV_KEYS.publishableKey]: publishableKey
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return {
    enabled: missingKeys.length === 0,
    missingKeys
  };
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }

  const status = getSupabaseClientStatus();
  if (!status.enabled) {
    return null;
  }

  cachedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    }
  );

  return cachedClient;
}

export function isSupabaseEnabled(): boolean {
  return getSupabaseClientStatus().enabled;
}

export function getSupabaseMissingEnvKeys(): string[] {
  return getSupabaseClientStatus().missingKeys;
}
