import { getSupabaseClient } from '@/lib/supabase-client';
import { getSupabaseCurrentUser } from '@/lib/supabase-auth';

export const SUPABASE_TRIP_PHOTOS_BUCKET = 'trip-photos';

export function buildShoppingImagePath(userId: string, itemId: string, fileId: string): string {
  return `${userId}/shopping/${itemId}/${fileId}.jpg`;
}

export function buildActivityImagePath(userId: string, activityId: string, fileId: string): string {
  return `${userId}/activities/${activityId}/${fileId}.jpg`;
}

type UploadImageParams = {
  path: string;
  file: Blob | File | ArrayBuffer | Uint8Array;
  contentType?: string;
  upsert?: boolean;
};

export type SupabaseStorageError = {
  message: string;
  statusCode?: string;
};

export async function uploadImageToSupabaseStorage({
  path,
  file,
  contentType,
  upsert = false
}: UploadImageParams): Promise<{ path: string | null; error: SupabaseStorageError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { path: null, error: { message: 'supabase_disabled' } };
  }

  const { data, error } = await client.storage.from(SUPABASE_TRIP_PHOTOS_BUCKET).upload(path, file, {
    contentType,
    upsert
  });

  if (error) {
    return {
      path: null,
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    };
  }

  return {
    path: data.path,
    error: null
  };
}

export async function deleteSupabaseStorageImage(path: string): Promise<{ success: boolean; error: SupabaseStorageError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: { message: 'supabase_disabled' } };
  }

  const { error } = await client.storage.from(SUPABASE_TRIP_PHOTOS_BUCKET).remove([path]);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    };
  }

  return { success: true, error: null };
}

export async function createSupabaseSignedImageUrl(
  path: string,
  expiresIn = 60 * 60
): Promise<{ signedUrl: string | null; error: SupabaseStorageError | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { signedUrl: null, error: { message: 'supabase_disabled' } };
  }

  const { data, error } = await client.storage
    .from(SUPABASE_TRIP_PHOTOS_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    return {
      signedUrl: null,
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    };
  }

  return {
    signedUrl: data.signedUrl,
    error: null
  };
}

export async function uploadActivityImage(
  activityId: string,
  file: Blob | File | ArrayBuffer | Uint8Array
): Promise<{ path: string | null; error: SupabaseStorageError | null }> {
  const user = await getSupabaseCurrentUser();
  if (!user?.id) {
    return { path: null, error: { message: 'shared_user_not_found' } };
  }

  const fileId = crypto.randomUUID();
  const path = buildActivityImagePath(user.id, activityId, fileId);
  return uploadImageToSupabaseStorage({
    path,
    file,
    contentType: 'image/jpeg'
  });
}

export async function removeActivityImage(path: string): Promise<{ success: boolean; error: SupabaseStorageError | null }> {
  return deleteSupabaseStorageImage(path);
}
