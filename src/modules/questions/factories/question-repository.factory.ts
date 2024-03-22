import { Client } from "../../../../deps/deps.ts";
import { QuestionRepositoryProtocol } from "../types/question.types.ts";
import QuestionRDBRepository from "../repositories/question-rdb.repository.ts";

export default class QuestionRepositoryFactory {
  static makeRepository(client: Client): QuestionRepositoryProtocol {
    return new QuestionRDBRepository(client);
  }
}
