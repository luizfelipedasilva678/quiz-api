import getClient from "../../common/helpers/tests/getClient.ts";
import setEnvs from "../../../config/env/setEnvs.ts";
import { Quiz } from "../../quiz/types/quiz.types.ts";
import { assert, assertRejects } from "../../../../deps/deps.ts";
import QuizRepositoryFactory from "../../quiz/factories/quiz-repository.factory.ts";
import QuestionRepositoryFactory from "../../questions/factories/question-repository.factory.ts";
import OptionRepositoryFactory from "../factories/option-repository.factory.ts";
import OptionService from "./option.service.ts";

Deno.test("Option service", async (t) => {
  await setEnvs();
  const client = await getClient();
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  const questionRepository = QuestionRepositoryFactory.makeRepository(client);
  const optionRepository = OptionRepositoryFactory.makeRepository(client);
  const optionService = new OptionService(optionRepository);
  const createdQuiz: Quiz = await quizRepository.create({
    name: "Quiz",
    subject: "Subject",
  });
  const question = await questionRepository.create({
    quiz_id: createdQuiz.id!,
    title: "Question",
  });

  await t.step("It should insert an option correctly", async () => {
    const option = await optionService.createOption({
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
          await optionService.createOption({
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
          await optionService.createOption({
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
          await optionService.createOption({
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
          await optionService.createOption(null);
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
          await optionService.createOption(null);
        },
        "Error creating option",
      );
    },
  );

  client.end();
});
