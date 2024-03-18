import QuizService from "../services/quiz.service.ts";
import { ImageUploader } from "../types/image-uploader.types.ts";
import { CreateQuizControllerArg, PartialQuiz } from "../types/quiz.types.ts";

export default class QuizController {
  private service: QuizService;
  private imageUploader: ImageUploader;

  constructor(service: QuizService, imageUploader: ImageUploader) {
    this.service = service;
    this.imageUploader = imageUploader;
  }

  getById(id: number) {
    return this.service.getById(id);
  }

  getAll() {
    return this.service.getAll();
  }

  async create(data: CreateQuizControllerArg) {
    const partialQuiz: PartialQuiz = {
      name: data.name,
      subject: data.subject,
    };

    if (data.image) {
      const uploadResult = await this.imageUploader.uploadImage(data.image);
      partialQuiz.image_id = uploadResult.image_id;
    }

    return this.service.createQuiz(partialQuiz);
  }
}
