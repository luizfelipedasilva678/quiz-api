import CloudinaryIMageHandler from "../providers/cloudinary-image-handler.ts";
import { ImageHandler } from "../types/image-handler.types.ts";

export default class ImageHandlerFactory {
  static makeImageHandler(): ImageHandler {
    return new CloudinaryIMageHandler();
  }
}
