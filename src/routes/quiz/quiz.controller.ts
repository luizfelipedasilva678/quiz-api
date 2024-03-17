import QuizService from "../../services/quiz.service.ts";

export default class QuizController {
  private service: QuizService;

  constructor(service: QuizService) {
    this.service = service;
  }

  async getById(id: number) {
    const quiz = await this.service.getById(id);

    return quiz;
  }
}
