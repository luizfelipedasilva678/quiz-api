import { Client, Hono, HTTPException, validator } from "../../../deps/deps.ts";
import QuizController from "./quizzes.controller.ts";
import QuizService from "../../services/quiz.service.ts";
import QuizRDBRepository from "../../repositories/quiz-rdb.repository.ts";
import quizSchema from "./quizzes.schema.ts";
import mountErrorMessage from "../../utils/validation/mount-error-message.ts";

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
    "/:id",
    validator("param", (param) => {
      if (isNaN(Number(param.id))) {
        throw new HTTPException(400, { message: "Invalid id" });
      }

      return { id: Number(param.id) };
    }),
    async (c) => {
      const { id } = c.req.valid("param");

      const quiz = await controller.getById(Number(id));

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

  return quiz;
}

export default quizRouter;
