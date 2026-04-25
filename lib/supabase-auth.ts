import type { User } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/lib/supabase-client';

export async function getSupabaseUser(): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client.auth.getUser();
    if (error) {
      return null;
    }

    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function ensureAnonymousSupabaseUser(): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const existingUser = await getSupabaseUser();
  if (existingUser) {
    return existingUser;
  }

  try {
    const { data, error } = await client.auth.signInAnonymously();
    if (error) {
      return null;
    }

    return data.user ?? null;
  } catch {
    return null;
  }
}
