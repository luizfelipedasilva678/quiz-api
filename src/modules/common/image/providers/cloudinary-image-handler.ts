import cloudinary from "../../../../config/cloudinary/cloudinary.ts";
import { UploadApiResponse } from "npm:cloudinary@latest";
import {
  ImageHandler,
  ImageHandlerExeception,
  UploadResult,
} from "../types/image-handler.types.ts";

const ERROR_MESSAGE = "Error uploading image";

export default class CloudinaryImageHandler implements ImageHandler {
  async deleteImage(imageIdentifiers: string): Promise<boolean> {
    try {
      const ids = imageIdentifiers.split(",");
      const requests = [];

      for (const id of ids) {
        requests.push(await cloudinary.uploader.destroy(id));
      }

      const status = (await Promise.allSettled(requests)).map((p) => p.status);
      if (status.includes("rejected")) return false;

      return true;
    } catch (_e) {
      throw new ImageHandlerExeception("Error deleting image");
    }
  }

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
            // @ts-expect-error - This is a workaround to avoid the type error
          }).end(byteArrayBuffer);
        },
      );

      if (!uploadResult) {
        throw new ImageHandlerExeception(ERROR_MESSAGE);
      }

      return {
        image_id: uploadResult.public_id,
      };
    } catch (_e) {
      throw new ImageHandlerExeception(ERROR_MESSAGE);
    }
  }
}
