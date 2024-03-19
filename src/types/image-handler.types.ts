export interface ImageHandler {
  uploadImage: (image: File) => Promise<UploadResult>;
  deleteImage: (imageIdentifier: string) => Promise<boolean>;
}

export interface UploadResult {
  image_id: string;
}

export class ImageHandlerExeception extends Error {
}
