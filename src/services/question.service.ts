import {
  PartialQuestion,
  QuestionRepositoryProtocol,
} from "../types/question.types.ts";

export default class QuestionService {
  private repository: QuestionRepositoryProtocol;

  constructor(repository: QuestionRepositoryProtocol) {
    this.repository = repository;
  }

  create(partialQuestion: PartialQuestion) {
    return this.repository.create(partialQuestion);
  }
}
