import type { RealtimeChannel } from '@supabase/supabase-js';

import { getSupabaseCurrentUser } from '@/lib/supabase-auth';
import { getSupabaseClient } from '@/lib/supabase-client';
import type { ShoppingItem } from '@/lib/types';

const SHOPPING_TABLE = 'shopping_items';
const SHOPPING_CHANNEL_PREFIX = 'shopping-items-';

let activeShoppingChannel: RealtimeChannel | null = null;
let activeShoppingChannelUserId: string | null = null;
const shoppingChangeListeners = new Set<() => void>();

type ShoppingItemRow = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  location: string | null;
  store_name: string | null;
  address: string | null;
  google_maps_url: string | null;
  note: string | null;
  estimated_price: number | null;
  actual_price: number | null;
  checked: boolean | null;
  photo_storage_path: string | null;
  photo_file_name: string | null;
  photo_uploaded_at: string | null;
  deleted_at: string | null;
  updated_at: string | null;
};

type ShoppingRepoError = {
  message: string;
};

function mapRowToShoppingItem(row: ShoppingItemRow): ShoppingItem {
  return {
    id: row.id,
    title: row.name,
    category: (row.category as ShoppingItem['category']) || '生活雜貨',
    area: row.location ?? '',
    storeName: row.store_name ?? '',
    address: row.address ?? '',
    googleMapsUrl: row.google_maps_url ?? '',
    note: row.note ?? '',
    estimatedCost: Math.max(0, Math.round(row.estimated_price ?? 0)),
    actualCost: Math.max(0, Math.round(row.actual_price ?? 0)),
    completed: Boolean(row.checked),
    photo: row.photo_storage_path
      ? {
          storagePath: row.photo_storage_path,
          fileName: row.photo_file_name ?? '',
          updatedAt: row.photo_uploaded_at ?? row.updated_at ?? new Date().toISOString()
        }
      : undefined
  };
}

function mapShoppingItemToRow(item: ShoppingItem, userId: string): Omit<ShoppingItemRow, 'updated_at'> {
  return {
    id: item.id,
    user_id: userId,
    name: item.title,
    category: item.category ?? null,
    location: item.area || item.areaTag || null,
    store_name: item.storeName || null,
    address: item.address || null,
    google_maps_url: item.googleMapsUrl || null,
    note: item.note || null,
    estimated_price: Math.max(0, Math.round(item.estimatedCost || 0)),
    actual_price: Math.max(0, Math.round(item.actualCost || 0)),
    checked: Boolean(item.completed),
    photo_storage_path: item.photo?.storagePath ?? null,
    photo_file_name: item.photo?.fileName ?? null,
    photo_uploaded_at: item.photo?.updatedAt ?? null,
    deleted_at: null
  };
}

async function getSharedUserId(): Promise<string | null> {
  const user = await getSupabaseCurrentUser();
  if (!user?.id || user.is_anonymous) {
    return null;
  }

  return user.id;
}

export async function fetchShoppingItems(): Promise<{ items: ShoppingItem[]; error: ShoppingRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { items: [], error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { items: [], error: { message: 'shared_user_not_found' } };
  }

  const { data, error } = await client
    .from(SHOPPING_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    return { items: [], error: { message: error.message } };
  }

  return {
    items: (data ?? []).map((row) => mapRowToShoppingItem(row as ShoppingItemRow)),
    error: null
  };
}

export async function upsertShoppingItem(item: ShoppingItem): Promise<{ success: boolean; error: ShoppingRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  const payload = mapShoppingItemToRow(item, userId);
  const { error } = await client.from(SHOPPING_TABLE).upsert(payload, { onConflict: 'id' });
  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}

export async function upsertShoppingItemsBatch(items: ShoppingItem[]): Promise<{ success: boolean; error: ShoppingRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  if (items.length === 0) {
    return { success: true, error: null };
  }

  const payload = items.map((item) => mapShoppingItemToRow(item, userId));
  const { error } = await client.from(SHOPPING_TABLE).upsert(payload, { onConflict: 'id' });
  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}

export async function deleteShoppingItem(itemId: string): Promise<{ success: boolean; error: ShoppingRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  const { error } = await client
    .from(SHOPPING_TABLE)
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}

export async function subscribeToShoppingItemsChanges(
  onChange: () => void
): Promise<{ unsubscribe: () => void; error: ShoppingRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { unsubscribe: () => undefined, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { unsubscribe: () => undefined, error: { message: 'shared_user_not_found' } };
  }

  const channelName = `${SHOPPING_CHANNEL_PREFIX}${userId}`;
  const releaseListener = () => {
    shoppingChangeListeners.delete(onChange);
    if (shoppingChangeListeners.size === 0 && activeShoppingChannel) {
      void client.removeChannel(activeShoppingChannel);
      activeShoppingChannel = null;
      activeShoppingChannelUserId = null;
    }
  };

  if (activeShoppingChannel && activeShoppingChannelUserId !== userId) {
    await client.removeChannel(activeShoppingChannel);
    activeShoppingChannel = null;
    activeShoppingChannelUserId = null;
    shoppingChangeListeners.clear();
  }

  shoppingChangeListeners.add(onChange);

  if (!activeShoppingChannel) {
    const staleChannels = client.getChannels().filter((channel) => {
      const topic = (channel as RealtimeChannel & { topic?: string }).topic ?? '';
      return topic === `realtime:${channelName}` || topic === channelName;
    });
    await Promise.all(staleChannels.map((channel) => client.removeChannel(channel)));

    activeShoppingChannel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: SHOPPING_TABLE,
          filter: `user_id=eq.${userId}`
        },
        () => {
          shoppingChangeListeners.forEach((listener) => listener());
        }
      )
      .subscribe((status) => {
        if (process.env.NODE_ENV !== 'production' && status === 'CHANNEL_ERROR') {
          console.warn('[shopping-realtime] channel error', { userId });
        }
      });
    activeShoppingChannelUserId = userId;
  }

  return {
    unsubscribe: releaseListener,
    error: null
  };
}
