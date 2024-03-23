import App from "./app.ts";
import getClient from "../common/helpers/tests/getClient.ts";
import setEnvs from "../../config/env/setEnvs.ts";
import { assert } from "../../../deps/deps.ts";
import { Quiz } from "../quiz/types/quiz.types.ts";
import { Question } from "../questions/types/question.types.ts";

Deno.test("App", async (t) => {
  await setEnvs();
  const client = await getClient();
  const app = new App(client).getRouter();
  let createdQuiz: Quiz | null = null, createdQuestion: Question | null = null;

  await t.step("It should an object with v1 key", async () => {
    const result = await app.request("/");

    assert((await (result.json())).v1);
  });

  await t.step(
    "It should an object with quizzes, doc, questions and swaggerUi keys",
    async () => {
      const result = await app.request("/v1");
      const obj = await result.json();

      assert(obj.quizzes);
      assert(obj.questions);
      assert(obj.doc);
      assert(obj.swaggerUi);
    },
  );

  await t.step(
    "It should create a quiz",
    async () => {
      const formData = new FormData();
      formData.append("name", "Test Quiz");
      formData.append("subject", "Test Quiz");

      const result = await app.request("/v1/quizzes", {
        body: formData,
        method: "POST",
      });
      createdQuiz = await result.json();

      assert(result.ok);
      assert(createdQuiz);
    },
  );

  await t.step(
    "It should get all quizzes",
    async () => {
      const result = await app.request("/v1/quizzes");
      const obj = await result.json();

      assert(result.ok);
      assert(obj);
    },
  );

  await t.step("It should get a quiz by id", async () => {
    const result = await app.request(`/v1/quizzes/${createdQuiz?.id}`);
    const obj = await result.json();

    assert(result.ok);
    assert(obj);
  });

  await t.step("It should create a question for a quiz", async () => {
    const formData = new FormData();
    formData.append("title", "Test Question");

    const result = await app.request(
      `/v1/quizzes/${createdQuiz?.id}/questions`,
      {
        body: formData,
        method: "POST",
      },
    );
    createdQuestion = await result.json();

    assert(result.ok);
    assert(createdQuestion);
  });

  await t.step("It should create a option for a question", async () => {
    const result = await app.request(
      `/v1/questions/${createdQuestion?.id}/options`,
      {
        body: JSON.stringify({
          question_id: createdQuestion?.id,
          description: "Option test",
          is_correct: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
    const createdOption = await result.json();

    assert(result.ok);
    assert(createdOption);
  });

  await t.step("It should return status 405 on /v1", async () => {
    const result = await app.request(`/v1`, {
      method: "PUT",
    });

    assert(result.status === 405);
  });

  await t.step("It should return status 405 on /v1/quizzes", async () => {
    const result = await app.request(`/v1/quizzes`, {
      method: "PUT",
    });

    assert(result.status === 405);
  });

  await t.step("It should return status 400 on /v1/quizzes", async () => {
    const result = await app.request(`/v1/quizzes/sss`);

    assert(result.status === 400);
  });

  await t.step("It should return 400", async () => {
    const formData = new FormData();

    const result = await app.request(
      `/v1/quizzes/${createdQuiz?.id}/questions`,
      {
        body: formData,
        method: "POST",
      },
    );

    assert(!result.ok);
    assert(result.status === 400);
  });

  await t.step("It should return 400", async () => {
    const result = await app.request(
      `/v1/questions/${createdQuestion?.id}/options`,
      {
        method: "POST",
      },
    );

    assert(!result.ok);
    assert(result.status === 400);
  });

  await t.step(
    "It should return 400",
    async () => {
      const formData = new FormData();

      const result = await app.request("/v1/quizzes", {
        body: formData,
        method: "POST",
      });

      assert(!result.ok);
      assert(result.status === 400);
    },
  );

  client.end();
});
