import { Client } from "../../../../deps/deps.ts";
import {
  PartialQuiz,
  Quiz,
  QuizFull,
  QuizQueryResult,
  QuizRepositoryException,
  QuizRepositoryProtocol,
} from "../types/quiz.types.ts";
import { Nullable } from "../../common/helpers/types/utility.types.ts";

export default class QuizRDBRepository implements QuizRepositoryProtocol {
  private client: Client;
  private static baseSelect = `
    SELECT 
      q.id as quiz_id, 
      q.image_id as quiz_image_id, 
      q.name as quiz_name, 
      q.subject as quiz_subject, 
      qu.id as question_id, 
      qu.title as question_title, 
      qu.image_id as question_image_id, 
      o.id as option_id, 
      o.description as option_descrition, 
      o.is_correct as option_is_correct
    FROM quiz q
    LEFT JOIN question qu ON q.id = qu.quiz_id
    LEFT JOIN option o ON qu.id = o.question_id
  `;

  constructor(client: Client) {
    this.client = client;
  }

  async getExpiradedQuizzes(): Promise<Nullable<QuizQueryResult>[] | null> {
    try {
      const result = await this.client.queryObject<Nullable<QuizQueryResult>>(
        `${QuizRDBRepository.baseSelect} 
          WHERE q.expiration_date < NOW();
        `,
      );

      if (!result.rowCount) return null;

      return result.rows;
    } catch (_e) {
      throw new QuizRepositoryException("Error finding expiraded quizzes");
    }
  }

  private tranformQueryResultToQuizFullObj(queryResult: QuizQueryResult[]) {
    const quiz: QuizFull = {
      id: queryResult.at(0)!.quiz_id,
      name: queryResult.at(0)!.quiz_name,
      subject: queryResult.at(0)!.quiz_subject,
      image_id: queryResult.at(0)!.quiz_image_id,
      questions: [],
    };

    for (const row of queryResult) {
      if (!row.question_id) continue;

      const question = quiz.questions.find((q) => q.id === row.question_id);

      if (!question) {
        quiz.questions.push({
          id: row.question_id,
          title: row.question_title,
          image_id: row.question_image_id,
          options: [
            {
              id: row.option_id,
              description: row.option_descrition,
              is_correct: row.option_is_correct,
            },
          ],
        });
      } else {
        question.options.push({
          id: row.option_id,
          description: row.option_descrition,
          is_correct: row.option_is_correct,
        });
      }
    }

    return quiz;
  }

  async getById(id: number): Promise<QuizFull | null> {
    try {
      const result = await this.client.queryObject<QuizQueryResult>(
        `${QuizRDBRepository.baseSelect} 
          WHERE q.id = $1;`,
        [id],
      );

      if (!result.rowCount) return null;

      return this.tranformQueryResultToQuizFullObj(result.rows);
    } catch (_e) {
      throw new QuizRepositoryException(`Error finding quiz ${id}`);
    }
  }

  async delete(ids: string) {
    try {
      const convertedIds = ids.split(",").map(Number);
      const argsStr = convertedIds.map((_, i) => `$${i + 1}`).join(", ");

      const result = await this.client.queryObject(
        `delete from quiz where id in (${argsStr})`,
        [...convertedIds],
      );

      if (!result.rowCount) return false;

      return true;
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
