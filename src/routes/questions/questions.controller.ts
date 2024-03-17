import QuestionService from "../../services/question.service.ts";
import { PartialOption } from "../../types/question.types.ts";

export default class QuestionController {
  private service: QuestionService;

  constructor(service: QuestionService) {
    this.service = service;
  }

  createOption(data: PartialOption) {
    return this.service.createOption(data);
  }
}
