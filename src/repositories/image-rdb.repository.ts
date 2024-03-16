import { Client } from "../../deps/deps.ts";
import {
  Image,
  ImageRepositoryException,
  ImageRepositoryProtocol,
} from "../types/image.types.ts";

export default class ImageRepositoryRDB implements ImageRepositoryProtocol {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async saveImage(image: Image): Promise<Image> {
    try {
      const result = await this.client.queryObject<{ id: bigint }>(
        "INSERT INTO image (url) VALUES ($1) RETURNING id",
        [image.url],
      );

      if (result.rowCount === 0) {
        throw new ImageRepositoryException("Error saving image");
      }

      Object.assign(image, { id: Number(result.rows.at(0)!.id) });
      return image;
    } catch (_e) {
      throw new ImageRepositoryException("Error saving image");
    }
  }

  async getImage(id: number): Promise<Image | null> {
    try {
      const result = await this.client.queryObject<Image>(
        "SELECT id, url FROM image WHERE id = $1",
        [id],
      );

      if (result.rowCount === 0) {
        return null;
      }

      const image = result.rows.at(0)!;
      Object.assign(image, { id: Number(image.id) });

      return image;
    } catch (_e) {
      console.log(_e);
      throw new ImageRepositoryException(
        `Error getting image with id equal ${id}`,
      );
    }
  }
}
