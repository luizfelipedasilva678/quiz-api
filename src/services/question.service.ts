import {
  PartialQuestion,
  QuestionRepositoryProtocol,
  QuestionServiceException,
} from "../types/question.types.ts";

export default class QuizService {
  private repository: QuestionRepositoryProtocol;

  constructor(repository: QuestionRepositoryProtocol) {
    this.repository = repository;
  }

  async createQuestion(data: PartialQuestion) {
    try {
      return await this.repository.create(data);
    } catch (e) {
      throw new QuestionServiceException(e.message);
    }
  }
}
