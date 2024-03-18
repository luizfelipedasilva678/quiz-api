import cloudinary from "../config/cloudinary/cloudinary.ts";
import { UploadApiResponse } from "npm:cloudinary@latest";
import {
  ImageUploader,
  ImageUploaderExeception,
  UploadResult,
} from "../types/image-uploader.types.ts";

const ERROR_MESSAGE = "Error uploading image";

export default class CloudinaryImageUploader implements ImageUploader {
  async uploadImage(image: File): Promise<UploadResult> {
    try {
      const byteArrayBuffer = new Uint8Array(await image.arrayBuffer());

      const uploadResult = await new Promise<UploadApiResponse | undefined>(
        (resolve, reject) => {
          cloudinary.uploader.upload_stream((error, uploadResult) => {
            if (uploadResult) {
              return resolve(uploadResult);
            }

            if (error) {
              return reject(error.message);
            }
            return resolve(uploadResult);
          }).end(byteArrayBuffer);
        },
      );

      if (!uploadResult) {
        throw new ImageUploaderExeception(ERROR_MESSAGE);
      }

      return {
        image_id: uploadResult.public_id,
      };
    } catch (_e) {
      throw new ImageUploaderExeception(ERROR_MESSAGE);
    }
  }
}
