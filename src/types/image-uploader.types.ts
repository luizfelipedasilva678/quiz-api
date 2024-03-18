export interface ImageUploader {
  uploadImage: (image: File) => Promise<UploadResult>;
}

export interface UploadResult {
  image_id: string;
}

export class ImageUploaderExeception extends Error {
}
