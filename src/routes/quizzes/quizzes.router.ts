import { Client, Hono, HTTPException, validator } from "../../../deps/deps.ts";
import { questionSchema, quizSchema } from "./quizzes.schema.ts";
import QuizController from "./quizzes.controller.ts";
import QuizService from "../../services/quiz.service.ts";
import QuizRDBRepository from "../../repositories/quiz-rdb.repository.ts";
import mountErrorMessage from "../../utils/validation/mount-error-message.ts";
import validateParam from "../../utils/validation/validate-param.ts";

function quizRouter(client: Client) {
  const repository = new QuizRDBRepository(client);
  const service = new QuizService(repository);
  const controller = new QuizController(service);

  const quiz = new Hono();

  quiz.get("/", async (c) => {
    const quizzes = await controller.getAll();
    return c.json(quizzes);
  });

  quiz.get(
    "/:quizId",
    validator("param", (param) => {
      if (!validateParam(param.quizId)) {
        throw new HTTPException(400, { message: "Invalid id" });
      }

      return { quizId: Number(param.quizId) };
    }),
    async (c) => {
      const { quizId } = c.req.valid("param");

      const quiz = await controller.getById(quizId);

      return c.json(quiz);
    },
  );

  quiz.post(
    "/",
    validator("form", (value) => {
      const parsed = quizSchema.safeParse(value);

      if (!parsed.success) {
        const message = mountErrorMessage(parsed.error.errors);
        throw new HTTPException(400, { message });
      }

      return parsed.data;
    }),
    async (c) => {
      const body = c.req.valid("form");

      const quiz = await controller.create({
        name: body.name,
        subject: body.subject,
      });

      return c.json(quiz);
    },
  );

  quiz.post(
    "/:quizId/questions",
    validator("param", (param) => {
      if (!validateParam(param.quizId)) {
        throw new HTTPException(400, { message: "Invalid quiz id" });
      }

      return { quizId: Number(param.quizId) };
    }),
    validator("form", (value) => {
      const parsed = questionSchema.safeParse(value);

      if (!parsed.success) {
        const message = mountErrorMessage(parsed.error.errors);
        throw new HTTPException(400, { message });
      }

      return parsed.data;
    }),
    async (c) => {
      const { quizId } = c.req.valid("param");
      const body = c.req.valid("form");

      const question = await controller.createQuestion({
        title: body.title,
        quiz_id: quizId,
      });

      return c.json(question);
    },
  );

  return quiz;
}

export default quizRouter;
