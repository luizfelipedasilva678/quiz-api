import { PartialQuiz, QuizRepositoryProtocol } from "../types/quiz.types.ts";

export default class QuizService {
  private repository: QuizRepositoryProtocol;

  constructor(repository: QuizRepositoryProtocol) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.getAll();
  }

  async getById(id: number) {
    return await this.repository.getById(id);
  }

  async create(data: PartialQuiz) {
    return await this.repository.create(data);
  }
}
