import { Client, Logger } from "../../../deps/deps.ts";
import QuizRepositoryFactory from "../../modules/quiz/factories/quiz-repository.factory.ts";
import ImageHandlerFactory from "../../modules/common/image/factories/image-handler.factory.ts";

class CronJobRemoveExpiredQuizzes {
  constructor(private client: Client) {}

  start() {
    const quizRepository = QuizRepositoryFactory.makeRepository(this.client);
    const imageHandler = ImageHandlerFactory.makeImageHandler();
    const logger = new Logger();

    Deno.cron("Remove expired quizzes", "30 2 * * *", async () => {
      const expiredQuizzes = await quizRepository.getExpiradedQuizzes();
      const requests = [];

      if (!expiredQuizzes) return;

      const expiredQuizzesIds = [
        ...new Set(expiredQuizzes.map((quiz) => quiz.quiz_id)),
      ].filter(Boolean);
      const expiredsImagesId = expiredQuizzes.map((
        quiz,
      ) => [quiz.quiz_image_id, quiz.question_image_id]).flat(Infinity).filter(
        Boolean,
      );

      if (expiredQuizzesIds) {
        requests.push(quizRepository.delete(expiredQuizzesIds.join(",")));
      }

      if (expiredsImagesId) {
        requests.push(imageHandler.deleteImage(expiredsImagesId.join(",")));
      }

      logger.info(
        "Removing expired quizzes job status:",
        (await Promise.allSettled(requests)).map((p) => p.status).find((s) =>
            s === "rejected"
          )
          ? "Something went wrong"
          : "Worked fine",
      );
    });
  }
}

export default CronJobRemoveExpiredQuizzes;
