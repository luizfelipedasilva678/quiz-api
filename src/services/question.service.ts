import {
  PartialOption,
  QuestionRepositoryProtocol,
  QuestionServiceException,
} from "../types/question.types.ts";

export default class QuizService {
  private repository: QuestionRepositoryProtocol;

  constructor(repository: QuestionRepositoryProtocol) {
    this.repository = repository;
  }

  async createOption(data: PartialOption) {
    try {
      return await this.repository.createOption(data);
    } catch (e) {
      throw new QuestionServiceException(e.message);
    }
  }
}
