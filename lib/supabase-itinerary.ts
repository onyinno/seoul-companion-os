import { getSupabaseCurrentUser } from '@/lib/supabase-auth';
import { getSupabaseClient } from '@/lib/supabase-client';
import type { Activity } from '@/lib/types';

const ITINERARY_ACTIVITIES_TABLE = 'itinerary_activities';

type ItineraryActivityRow = {
  id: string;
  user_id: string;
  day_id: string;
  title: string;
  category: string;
  time: string;
  place: string;
  address: string | null;
  google_maps_url: string | null;
  note: string | null;
  cost: number | null;
  display_order: number | null;
  photo_storage_path: string | null;
  photo_file_name: string | null;
  photo_uploaded_at: string | null;
  deleted_at: string | null;
  updated_at: string | null;
};

type ItineraryActivityCoreUpsertRow = {
  id: string;
  user_id: string;
  day_id: string;
  title: string;
  category: string;
  time: string;
  place: string;
  address: string | null;
  google_maps_url: string | null;
  note: string | null;
  cost: number | null;
  display_order: number | null;
  deleted_at: string | null;
};

type ItineraryRepoError = {
  message: string;
};

function mapRowToActivity(row: ItineraryActivityRow): Activity {
  return {
    id: row.id,
    dayId: row.day_id,
    title: row.title,
    category: row.category as Activity['category'],
    time: row.time,
    place: row.place,
    address: row.address ?? '',
    googleMapsUrl: row.google_maps_url ?? '',
    note: row.note ?? '',
    cost: row.cost == null ? 0 : Number(row.cost),
    order: row.display_order ?? 0,
    photo: row.photo_storage_path
      ? {
          storagePath: row.photo_storage_path,
          fileName: row.photo_file_name ?? '',
          uploadedAt: row.photo_uploaded_at ?? row.updated_at ?? new Date().toISOString()
        }
      : undefined
  };
}

function normalizeCost(value: Activity['cost']): number | null {
  if (value == null) {
    return null;
  }

  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.round(numeric);
}

function mapActivityToCoreUpsertRow(activity: Activity, userId: string): ItineraryActivityCoreUpsertRow {
  return {
    id: activity.id,
    user_id: userId,
    day_id: activity.dayId,
    title: activity.title,
    category: activity.category,
    time: activity.time,
    place: activity.place,
    address: activity.address?.trim() || null,
    google_maps_url: activity.googleMapsUrl?.trim() || null,
    note: activity.note?.trim() || null,
    cost: normalizeCost(activity.cost),
    display_order: Number.isFinite(activity.order) ? Math.round(activity.order) : null,
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

export async function fetchItineraryActivities(): Promise<{ activities: Activity[]; error: ItineraryRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { activities: [], error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { activities: [], error: { message: 'shared_user_not_found' } };
  }

  const { data, error } = await client
    .from(ITINERARY_ACTIVITIES_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('day_id', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    return { activities: [], error: { message: error.message } };
  }

  return {
    activities: (data ?? []).map((row) => mapRowToActivity(row as ItineraryActivityRow)),
    error: null
  };
}

export async function upsertItineraryActivity(activity: Activity): Promise<{ success: boolean; error: ItineraryRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  const payload = mapActivityToCoreUpsertRow(activity, userId);
  const { error } = await client.from(ITINERARY_ACTIVITIES_TABLE).upsert(payload, { onConflict: 'id' });
  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}

export async function upsertItineraryActivitiesBatch(activities: Activity[]): Promise<{ success: boolean; error: ItineraryRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  if (activities.length === 0) {
    return { success: true, error: null };
  }

  const payload = activities.map((activity) => mapActivityToCoreUpsertRow(activity, userId));
  const { error } = await client.from(ITINERARY_ACTIVITIES_TABLE).upsert(payload, { onConflict: 'id' });
  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}

export async function deleteItineraryActivity(activityId: string): Promise<{ success: boolean; error: ItineraryRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  const { error } = await client
    .from(ITINERARY_ACTIVITIES_TABLE)
    .delete()
    .eq('id', activityId)
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}

export async function updateItineraryActivityPhotoMetadata(params: {
  activityId: string;
  photoStoragePath: string | null;
  photoFileName: string | null;
  photoUploadedAt: string | null;
}): Promise<{ success: boolean; error: ItineraryRepoError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const userId = await getSharedUserId();
  if (!userId) {
    return { success: false, error: { message: 'shared_user_not_found' } };
  }

  const { error } = await client
    .from(ITINERARY_ACTIVITIES_TABLE)
    .update({
      photo_storage_path: params.photoStoragePath,
      photo_file_name: params.photoFileName,
      photo_uploaded_at: params.photoUploadedAt
    })
    .eq('id', params.activityId)
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true, error: null };
}
