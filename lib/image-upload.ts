export const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const UNSUPPORTED_HEIC_TYPES = new Set(['image/heic', 'image/heif']);
export const MAX_INPUT_IMAGE_BYTES = 15 * 1024 * 1024;
const TARGET_OUTPUT_IMAGE_BYTES = 1.5 * 1024 * 1024;
const MAX_DIMENSION = 2560;

export type ImageUploadValidationCode = 'unsupported_file_type' | 'file_too_large' | null;

export function validateImageFileForUpload(file: File): ImageUploadValidationCode {
  if (UNSUPPORTED_HEIC_TYPES.has(file.type) || !SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return 'unsupported_file_type';
  }
  if (file.size > MAX_INPUT_IMAGE_BYTES) {
    return 'file_too_large';
  }
  return null;
}

export function mapImageUploadErrorMessage(code?: string): string {
  if (code === 'unsupported_file_type') {
    return '相片格式不支援，請使用 JPG、PNG 或 WebP';
  }
  if (code === 'file_too_large' || code === 'image_conversion_failed' || code === 'image_load_failed') {
    return '相片太大，請選擇較小的圖片';
  }
  return '相片上載失敗，請稍後再試';
}

export function createJpegBlobFromImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      let width = image.naturalWidth;
      let height = image.naturalHeight;
      const largerSide = Math.max(width, height);
      if (largerSide > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / largerSide;
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
      }
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('image_conversion_failed'));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      const qualitySteps = [0.9, 0.82, 0.75, 0.68, 0.6];
      const tryQuality = (index: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('image_conversion_failed'));
              return;
            }
            if (blob.size <= TARGET_OUTPUT_IMAGE_BYTES || index >= qualitySteps.length - 1) {
              URL.revokeObjectURL(objectUrl);
              resolve(blob);
              return;
            }
            tryQuality(index + 1);
          },
          'image/jpeg',
          qualitySteps[index]
        );
      };
      tryQuality(0);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('image_load_failed'));
    };

    image.src = objectUrl;
  });
}
