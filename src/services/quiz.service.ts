import {
  PartialQuestion,
  PartialQuiz,
  QuizRepositoryProtocol,
  QuizServiceException,
} from "../types/quiz.types.ts";

export default class QuizService {
  private repository: QuizRepositoryProtocol;

  constructor(repository: QuizRepositoryProtocol) {
    this.repository = repository;
  }

  async getAll() {
    try {
      return await this.repository.getAll();
    } catch (e) {
      throw new QuizServiceException(e.message);
    }
  }

  async getById(id: number) {
    try {
      return await this.repository.getById(id);
    } catch (e) {
      throw new QuizServiceException(e.message);
    }
  }

  async create(data: PartialQuiz) {
    try {
      return await this.repository.create(data);
    } catch (e) {
      throw new QuizServiceException(e.message);
    }
  }

  async createQuestion(data: PartialQuestion) {
    try {
      return await this.repository.createQuestion(data);
    } catch (e) {
      throw new QuizServiceException(e.message);
    }
  }
}
