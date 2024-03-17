import { Client } from "../../deps/deps.ts";
import {
  PartialQuiz,
  Quiz,
  QuizRepositoryException,
  QuizRepositoryProtocol,
} from "../types/quiz.types.ts";

export default class QuizRDBRepository implements QuizRepositoryProtocol {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async getById(id: number) {
    try {
      const result = await this.client.queryObject<Quiz>(
        "select id, name, subject, image_id from quiz where id = $1",
        [id],
      );

      return result.rows.at(0)!;
    } catch (_e) {
      console.log(_e);
      throw new QuizRepositoryException(`Error finding quiz ${id}`);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.client.queryObject<Quiz>(
        "delete from quiz where id = $1 returning id",
        [id],
      );

      return result.rows.at(0)!;
    } catch (_e) {
      throw new QuizRepositoryException("Error deleting quiz");
    }
  }

  async getAll() {
    try {
      const result = await this.client.queryObject<Quiz>(
        "select id, name, subject, image_id from quiz",
      );

      return result.rows;
    } catch (_e) {
      throw new QuizRepositoryException("Error finding all quizzes");
    }
  }

  async create(partialQuiz: PartialQuiz): Promise<Quiz> {
    try {
      const result = await this.client.queryObject<Quiz>(
        "insert into quiz (name, subject, image_id) values ($1, $2, $3) returning id, name, image_id, subject",
        [partialQuiz.name, partialQuiz.subject, partialQuiz.image_id],
      );

      return result.rows.at(0)!;
    } catch (_e) {
      throw new QuizRepositoryException("Error creating quiz");
    }
  }
}
