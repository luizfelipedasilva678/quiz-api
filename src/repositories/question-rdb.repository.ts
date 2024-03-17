import { Client } from "../../deps/deps.ts";
import {
  PartialQuestion,
  Question,
  QuestionRepositoryException,
  QuestionRepositoryProtocol,
} from "../types/question.types.ts";

export default class QuestionRDBRepository
  implements QuestionRepositoryProtocol {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async create(partialQuestion: PartialQuestion): Promise<Question> {
    try {
      const result = await this.client.queryObject<Question>(
        "insert into question (quiz_id, title, image_id) values ($1, $2, $3) returning id, quiz_id, title, image_id",
        [
          partialQuestion.quiz_id,
          partialQuestion.title,
          partialQuestion.image_id,
        ],
      );
      return result.rows.at(0)!;
    } catch (_e) {
      throw new QuestionRepositoryException("Error creating question");
    }
  }
}
