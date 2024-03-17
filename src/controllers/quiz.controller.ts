import QuizService from "../services/quiz.service.ts";
import { PartialQuiz } from "../types/quiz.types.ts";

export default class QuizController {
  private service: QuizService;

  constructor(service: QuizService) {
    this.service = service;
  }

  getById(id: number) {
    return this.service.getById(id);
  }

  getAll() {
    return this.service.getAll();
  }

  create(data: PartialQuiz) {
    return this.service.create(data);
  }
}
