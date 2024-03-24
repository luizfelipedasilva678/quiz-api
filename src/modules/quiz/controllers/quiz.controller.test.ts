import getClient from "../../common/helpers/tests/getClient.ts";
import QuizRepositoryFactory from "../factories/quiz-repository.factory.ts";
import setEnvs from "../../../config/env/set-envs.ts";
import { Quiz } from "../types/quiz.types.ts";
import { assert, assertRejects } from "../../../../deps/deps.ts";
import QuizService from "../services/quiz.service.ts";
import QuizController from "./quiz.controller.ts";
import ImageHandlerFactory from "../../common/image/factories/image-handler.factory.ts";

Deno.test("Quiz Service", async (t) => {
  await setEnvs();
  const client = await getClient();
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  const quizService = new QuizService(quizRepository);
  const imageHandler = ImageHandlerFactory.makeImageHandler();
  const quizController = new QuizController(quizService, imageHandler);
  let createdQuiz: Quiz | null = null;

  await t.step("It should insert a quiz correctly", async () => {
    createdQuiz = await quizController.create({
      name: "Quiz 1",
      subject: "Subject 1",
    });

    assert(createdQuiz.id);
    assert(createdQuiz.image_id === null || createdQuiz.image_id);
    assert(createdQuiz.subject);
    assert(createdQuiz.name);
  });

  await t.step("It should throw and exception when fields are missing", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await quizController.create({
          name: "Quiz 1",
        });
      },
      "Error creating quiz",
    );
  });

  await t.step("It should find a quiz correctly", async () => {
    const quiz = await quizController.getById(createdQuiz!.id!);

    assert(quiz);
  });

  await t.step("It should return a object with all quiz infos", async () => {
    const quiz = await quizController.getById(createdQuiz!.id!);

    assert(quiz?.id === createdQuiz?.id);
    assert(quiz?.name === createdQuiz?.name);
    assert(quiz?.subject === createdQuiz?.subject);
    assert(quiz?.image_id === createdQuiz?.image_id);
  });

  await t.step("It should return null when id is negative", async () => {
    const quiz = await quizController.getById(-1);

    assert(quiz === null);
  });

  await t.step("It should return null when quiz doesnt exists", async () => {
    const quiz = await quizController.getById(100000);

    assert(quiz === null);
  });

  await t.step("It should return all quizzes", async () => {
    const quizzes = await quizController.getAll();

    assert(quizzes.length > 0);
  });

  client.end();
});
