import getClient from "../../common/helpers/tests/getClient.ts";
import QuizRepositoryFactory from "../../quiz/factories/quiz-repository.factory.ts";
import QuestionRepositoryFactory from "../factories/question-repository.factory.ts";
import setEnvs from "../../../config/env/setEnvs.ts";
import { Quiz } from "../../quiz/types/quiz.types.ts";
import { assert, assertRejects } from "../../../../deps/deps.ts";

Deno.test("Question repository", async (t) => {
  await setEnvs();
  const client = await getClient();
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  const questionRepository = QuestionRepositoryFactory.makeRepository(client);
  const createdQuiz: Quiz = await quizRepository.create({
    name: "Quiz 1",
    subject: "Subject 1",
  });

  await t.step("It should insert a question correctly", async () => {
    const createdQuestion = await questionRepository.create({
      quiz_id: createdQuiz.id!,
      title: "Question 1",
    });

    assert(createdQuestion);
  });

  await t.step("It should throw and exception when fields are missing", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await questionRepository.create({
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
        await questionRepository.create({
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
        await questionRepository.create({});
      },
      "Error creating question",
    );
  });

  await t.step("It should throw and exception when param is null", () => {
    assertRejects(
      async () => {
        // @ts-expect-error - Testing if the exception is thrown
        await questionRepository.create(null);
      },
      "Error creating question",
    );
  });

  client.end();
});
