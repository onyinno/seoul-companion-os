import type { Session, User } from '@supabase/supabase-js';

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

export async function getSupabaseSession(): Promise<Session | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client.auth.getSession();
    if (error) {
      return null;
    }

    return data.session ?? null;
  } catch {
    return null;
  }
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<{ user: User | null; errorMessage: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { user: null, errorMessage: 'supabase_disabled' };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { user: null, errorMessage: error.message || 'email_password_signin_failed' };
    }

    return { user: data.user ?? null, errorMessage: null };
  } catch {
    return { user: null, errorMessage: 'email_password_signin_exception' };
  }
}

export async function signOutSupabaseUser(): Promise<{ success: boolean; errorMessage: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, errorMessage: 'supabase_disabled' };
  }

  try {
    const { error } = await client.auth.signOut();
    if (error) {
      return { success: false, errorMessage: error.message || 'signout_failed' };
    }

    return { success: true, errorMessage: null };
  } catch {
    return { success: false, errorMessage: 'signout_exception' };
  }
}

export async function ensureAnonymousSupabaseUser(): Promise<User | null> {
  const result = await ensureAnonymousSupabaseUserWithReason();
  return result.user;
}

export async function ensureAnonymousSupabaseUserWithReason(): Promise<{ user: User | null; reason: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { user: null, reason: 'supabase_disabled' };
  }

  const existingUser = await getSupabaseUser();
  if (existingUser) {
    return { user: existingUser, reason: null };
  }

  try {
    const { data, error } = await client.auth.signInAnonymously();
    if (error) {
      return { user: null, reason: error.message || 'anonymous_signin_failed' };
    }

    if (!data.user?.id) {
      return { user: null, reason: 'anonymous_user_missing_id' };
    }

    return { user: data.user, reason: null };
  } catch {
    return { user: null, reason: 'anonymous_signin_exception' };
  }
}
