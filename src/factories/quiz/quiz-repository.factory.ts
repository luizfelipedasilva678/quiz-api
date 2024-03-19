import { Client } from "../../../deps/deps.ts";
import { QuizRepositoryProtocol } from "../../types/quiz.types.ts";
import QuizRDBRepository from "../../repositories/quiz-rdb.repository.ts";

export default class QuizRepositoryFactory {
  static makeRepository(client: Client): QuizRepositoryProtocol {
    return new QuizRDBRepository(client);
  }
}
