import QuestionService from "../services/question.service.ts";
import { PartialQuestion } from "../types/question.types.ts";

export default class QuestionController {
  private service: QuestionService;

  constructor(service: QuestionService) {
    this.service = service;
  }

  create(data: PartialQuestion) {
    return this.service.createQuestion(data);
  }
}
