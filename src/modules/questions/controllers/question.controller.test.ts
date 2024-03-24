import getClient from "../../common/helpers/tests/getClient.ts";
import QuizRepositoryFactory from "../../quiz/factories/quiz-repository.factory.ts";
import QuestionRepositoryFactory from "../factories/question-repository.factory.ts";
import setEnvs from "../../../config/env/set-envs.ts";
import { Quiz } from "../../quiz/types/quiz.types.ts";
import { assert, assertRejects } from "../../../../deps/deps.ts";
import QuestionService from "../services/question.service.ts";
import QuestionController from "./question.controller.ts";
import ImageHandlerFactory from "../../common/image/factories/image-handler.factory.ts";

Deno.test("Question Service", async (t) => {
  await setEnvs();
  const client = await getClient();
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  const questionRepository = QuestionRepositoryFactory.makeRepository(client);
  const imageHandler = ImageHandlerFactory.makeImageHandler();
  const questionService = new QuestionService(questionRepository);
  const questionController = new QuestionController(
    questionService,
    imageHandler,
  );
  const createdQuiz: Quiz = await quizRepository.create({
    name: "Quiz",
    subject: "Subject",
  });

  await t.step("It should insert a question correctly", async () => {
    const createdQuestion = await questionController.create({
      quiz_id: createdQuiz.id!,
      title: "Question 1",
    });

    assert(createdQuestion);
  });

  await t.step("It should throw and exception when fields are missing", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await questionController.create({
          quiz_id: createdQuiz.id!,
        });
      },
      "Error creating question",
    );
  });

  await t.step("It should throw and exception when quiz_id is missing", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await questionController.create({
          title: "title",
        });
      },
      "Error creating question",
    );
  });

  await t.step("It should throw and exception when object is empty", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await questionController.create({});
      },
      "Error creating question",
    );
  });

  await t.step("It should throw and exception when param is null", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await questionController.create(null);
      },
      "Error creating question",
    );
  });

  client.end();
});
