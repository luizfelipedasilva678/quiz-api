import { Client } from "../../deps/deps.ts";
import {
  Option,
  PartialOption,
  QuestionRepositoryException,
  QuestionRepositoryProtocol,
} from "../types/question.types.ts";

export default class QuestionRDBRepository
  implements QuestionRepositoryProtocol {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async createOption(partialOption: PartialOption): Promise<Option> {
    try {
      const result = await this.client.queryObject<Option>(
        "insert into option (question_id, description, is_correct) values ($1, $2, $3) returning id, description, is_correct, question_id",
        [
          partialOption.question_id,
          partialOption.description,
          partialOption.is_correct,
        ],
      );

      return result.rows.at(0)!;
    } catch (_e) {
      throw new QuestionRepositoryException(
        `Error creating option for question ${partialOption.question_id}`,
      );
    }
  }
}
