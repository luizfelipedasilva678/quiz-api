export interface Image {
  id: number;
  url: string;
}

export interface ImageRepositoryProtocol {
  getImage(id: number): Promise<Image | null>;
  saveImage(image: Image): Promise<Image>;
}

export class ImageRepositoryException extends Error {}
