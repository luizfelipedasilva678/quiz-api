import { Hono, HTTPException, validator } from "../../../deps/deps.ts";
import quizSchema from "../../schemas/quiz.schema.ts";
import questionSchema from "../../schemas/question.schema.ts";
import QuizController from "../../controllers/quiz.controller.ts";
import QuestionController from "../../controllers/question.controller.ts";
import mountErrorMessage from "../../utils/validation/mount-error-message.ts";
import validateParam from "../../utils/validation/validate-param.ts";

function quizRoute(
  questionController: QuestionController,
  quizController: QuizController,
) {
  const quiz = new Hono();

  quiz.get("/", async (c) => {
    const quizzes = await quizController.getAll();
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

      const quiz = await quizController.getById(quizId);

      if (quiz === null) {
        throw new HTTPException(404, { message: "Quiz not found" });
      }

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

      const quiz = await quizController.create({
        name: body.name,
        subject: body.subject,
        image: body.image,
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

      const question = await questionController.create({
        title: body.title,
        quiz_id: quizId,
        image: body.image,
      });

      return c.json(question);
    },
  );

  return quiz;
}

export default quizRoute;
