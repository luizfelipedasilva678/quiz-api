import { Hono, HTTPException, validator } from "../../../../deps/deps.ts";
import quizSchema from "../schemas/quiz.schema.ts";
import questionSchema from "../../questions/schemas/question.schema.ts";
import QuizController from "../controllers/quiz.controller.ts";
import QuestionController from "../../questions/controllers/question.controller.ts";
import mountErrorMessage from "../../common/helpers/validation/mount-error-message.ts";
import validateParam from "../../common/helpers/validation/validate-param.ts";
import {
  HTTP_BAD_REQUEST,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_METHOD_NOT_ALLOWED_MESSAGE,
  HTTP_NOT_FOUND,
} from "../../common/helpers/constants.ts";

function quizRoute(
  questionController: QuestionController,
  quizController: QuizController,
) {
  const quiz = new Hono();

  quiz.get("/", async (c) => {
    const quizzes = await quizController.getAll();
    return c.json(quizzes);
  })
    .post(
      "/",
      validator("form", (value) => {
        const parsed = quizSchema.safeParse(value);

        if (!parsed.success) {
          const message = mountErrorMessage(parsed.error.errors);
          throw new HTTPException(HTTP_BAD_REQUEST, { message });
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
    ).all(() => {
      throw new HTTPException(HTTP_METHOD_NOT_ALLOWED, {
        message: HTTP_METHOD_NOT_ALLOWED_MESSAGE,
      });
    });

  quiz.get(
    "/:quizId",
    validator("param", (param) => {
      if (!validateParam(param.quizId)) {
        throw new HTTPException(HTTP_BAD_REQUEST, { message: "Invalid id" });
      }

      return { quizId: Number(param.quizId) };
    }),
    async (c) => {
      const { quizId } = c.req.valid("param");

      const quiz = await quizController.getById(quizId);

      if (quiz === null) {
        throw new HTTPException(HTTP_NOT_FOUND, { message: "Quiz not found" });
      }

      return c.json(quiz);
    },
  ).all(() => {
    throw new HTTPException(HTTP_METHOD_NOT_ALLOWED, {
      message: HTTP_METHOD_NOT_ALLOWED_MESSAGE,
    });
  });

  quiz.post(
    "/:quizId/questions",
    validator("param", (param) => {
      if (!validateParam(param.quizId)) {
        throw new HTTPException(HTTP_BAD_REQUEST, {
          message: "Invalid quiz id",
        });
      }

      return { quizId: Number(param.quizId) };
    }),
    validator("form", (value) => {
      const parsed = questionSchema.safeParse(value);

      if (!parsed.success) {
        const message = mountErrorMessage(parsed.error.errors);
        throw new HTTPException(HTTP_BAD_REQUEST, { message });
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
  ).all(() => {
    throw new HTTPException(HTTP_METHOD_NOT_ALLOWED, {
      message: HTTP_METHOD_NOT_ALLOWED_MESSAGE,
    });
  });

  return quiz;
}

export default quizRoute;
