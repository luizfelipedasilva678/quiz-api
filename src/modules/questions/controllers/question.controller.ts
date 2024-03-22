import QuestionService from "../services/question.service.ts";
import { ImageHandler } from "../../common/image/types/image-handler.types.ts";
import {
  CreateQuestionControllerArg,
  PartialQuestion,
} from "../types/question.types.ts";

export default class QuestionController {
  private service: QuestionService;
  private imageUploader: ImageHandler;

  constructor(service: QuestionService, imageUploader: ImageHandler) {
    this.service = service;
    this.imageUploader = imageUploader;
  }

  async create(data: CreateQuestionControllerArg) {
    const partialQuestion: PartialQuestion = {
      title: data.title,
      quiz_id: data.quiz_id,
    };

    if (data.image) {
      const uploadResult = await this.imageUploader.uploadImage(data.image);
      partialQuestion.image_id = uploadResult.image_id;
    }

    return this.service.createQuestion(partialQuestion);
  }
}
