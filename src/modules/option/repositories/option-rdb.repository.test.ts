import getClient from "../../common/helpers/tests/getClient.ts";
import setEnvs from "../../../config/env/set-envs.ts";
import { Quiz } from "../../quiz/types/quiz.types.ts";
import { assert, assertRejects } from "../../../../deps/deps.ts";
import QuizRepositoryFactory from "../../quiz/factories/quiz-repository.factory.ts";
import QuestionRepositoryFactory from "../../questions/factories/question-repository.factory.ts";
import OptionRepositoryFactory from "../factories/option-repository.factory.ts";

Deno.test("Option repository", async (t) => {
  await setEnvs();
  const client = await getClient();
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  const questionRepository = QuestionRepositoryFactory.makeRepository(client);
  const optionRepository = OptionRepositoryFactory.makeRepository(client);
  const createdQuiz: Quiz = await quizRepository.create({
    name: "Quiz",
    subject: "Subject",
  });
  const question = await questionRepository.create({
    quiz_id: createdQuiz.id!,
    title: "Question",
  });

  await t.step("It should insert an option correctly", async () => {
    const option = await optionRepository.create({
      question_id: question.id!,
      description: "Option 1",
      is_correct: true,
    });

    assert(option);
  });

  await t.step(
    "It should throw and exception when description is missing",
    () => {
      assertRejects(
        async () => {
          // @ts-expect-error - Testing if the exception is thrown
          await optionRepository.create({
            question_id: question.id!,
            is_correct: true,
          });
        },
        "Error creating option",
      );
    },
  );

  await t.step(
    "It should throw and exception when is_correct is missing",
    () => {
      assertRejects(
        async () => {
          // @ts-expect-error - Testing if the exception is thrown
          await optionRepository.create({
            question_id: question.id!,
            description: "Option 1",
          });
        },
        "Error creating option",
      );
    },
  );

  await t.step(
    "It should throw and exception when question_id is missing",
    () => {
      assertRejects(
        async () => {
          // @ts-expect-error - Testing if the exception is thrown
          await optionRepository.create({
            description: "Option 1",
            is_correct: true,
          });
        },
        "Error creating option",
      );
    },
  );

  await t.step(
    "It should throw and exception when object is null",
    () => {
      assertRejects(
        async () => {
          // @ts-expect-error - Testing if the exception is thrown
          await optionRepository.create(null);
        },
        "Error creating option",
      );
    },
  );

  await t.step(
    "It should throw and exception when object is empty",
    () => {
      assertRejects(
        async () => {
          // @ts-expect-error - Testing if the exception is thrown
          await optionRepository.create(null);
        },
        "Error creating option",
      );
    },
  );

  client.end();
});
