import getClient from "../../common/helpers/tests/getClient.ts";
import QuizRepositoryFactory from "../factories/quiz-repository.factory.ts";
import setEnvs from "../../../config/env/setEnvs.ts";
import { assert } from "https://deno.land/std@0.220.0/assert/mod.ts";
import { Quiz } from "../types/quiz.types.ts";

Deno.test("Quiz repository", async (t) => {
  await setEnvs();
  const client = await getClient();
  const quizRepository = QuizRepositoryFactory.makeRepository(client);
  let createdQuiz: Quiz | null = null;

  await t.step("It should insert a quiz correctly", async () => {
    createdQuiz = await quizRepository.create({
      name: "Quiz 1",
      subject: "Subject 1",
    });

    assert(createdQuiz.id);
    assert(createdQuiz.image_id === null || createdQuiz.image_id);
    assert(createdQuiz.subject);
    assert(createdQuiz.name);
  });

  await t.step("It should find a quiz correctly", async () => {
    const quiz = await quizRepository.getById(createdQuiz!.id!);

    assert(quiz);
  });

  await t.step("It should return a object with all quiz infos", async () => {
    const quiz = await quizRepository.getById(createdQuiz!.id!);

    assert(quiz?.id === createdQuiz?.id);
    assert(quiz?.name === createdQuiz?.name);
    assert(quiz?.subject === createdQuiz?.subject);
    assert(quiz?.image_id === createdQuiz?.image_id);
  });

  await t.step("It should return null when id is negative", async () => {
    const quiz = await quizRepository.getById(-1);

    assert(quiz === null);
  });

  await t.step("It should return null when quiz doesnt exists", async () => {
    const quiz = await quizRepository.getById(100000);

    assert(quiz === null);
  });

  await t.step("It should return null or all expirated quizzes", async () => {
    const quizzes = await quizRepository.getExpiradedQuizzes();

    assert(quizzes === null || quizzes);
  });

  await t.step("It should return all quizzes", async () => {
    const quizzes = await quizRepository.getAll();

    assert(quizzes.length > 0);
  });

  await t.step("It should delete a quiz correctly", async () => {
    const deleted = await quizRepository.delete(String(createdQuiz!.id!));
    assert(deleted);
  });

  await t.step("It should not delete correctly", async () => {
    const deleted = await quizRepository.delete("-10");

    assert(!deleted);
  });

  client.end();
});