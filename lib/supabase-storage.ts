import { getSupabaseClient } from '@/lib/supabase-client';

export const SUPABASE_TRIP_PHOTOS_BUCKET = 'trip-photos';

export function buildShoppingImagePath(userId: string, itemId: string, fileId: string): string {
  return `${userId}/shopping/${itemId}/${fileId}`;
}

export function buildActivityImagePath(userId: string, activityId: string, fileId: string): string {
  return `${userId}/activities/${activityId}/${fileId}`;
}

type UploadImageParams = {
  path: string;
  file: Blob | File | ArrayBuffer | Uint8Array;
  contentType?: string;
  upsert?: boolean;
};

export async function uploadImageToSupabaseStorage({
  path,
  file,
  contentType,
  upsert = false
}: UploadImageParams): Promise<{ path: string | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { path: null, error: 'supabase_disabled' };
  }

  const { data, error } = await client.storage.from(SUPABASE_TRIP_PHOTOS_BUCKET).upload(path, file, {
    contentType,
    upsert
  });

  if (error) {
    return { path: null, error: error.message };
  }

  return {
    path: data.path,
    error: null
  };
}

export async function deleteSupabaseStorageImage(path: string): Promise<{ success: boolean; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'supabase_disabled' };
  }

  const { error } = await client.storage.from(SUPABASE_TRIP_PHOTOS_BUCKET).remove([path]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function createSupabaseSignedImageUrl(
  path: string,
  expiresIn = 60 * 60
): Promise<{ signedUrl: string | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { signedUrl: null, error: 'supabase_disabled' };
  }

  const { data, error } = await client.storage
    .from(SUPABASE_TRIP_PHOTOS_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    return { signedUrl: null, error: error.message };
  }

  return {
    signedUrl: data.signedUrl,
    error: null
  };
}
