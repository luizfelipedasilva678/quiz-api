import { Client, Logger } from "../../../deps/deps.ts";
import QuizRepositoryFactory from "../../factories/quiz/quiz-repository.factory.ts";
import ImageHandlerFactory from "../../factories/image-handler/image-handler.factory.ts";

function cronJobRemoveExpiredQuizzes(client: Client) {
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  const imageHandler = ImageHandlerFactory.makeImageHandler();
  const logger = new Logger();

  Deno.cron("Remove expired quizzes", "00 00 * * *", async () => {
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

export default cronJobRemoveExpiredQuizzes;
