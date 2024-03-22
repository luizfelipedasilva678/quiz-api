import { OpenAPIHono } from "npm:@hono/zod-openapi@latest";
import { swaggerUI } from "npm:@hono/swagger-ui@latest";
import { createQuestionOption } from "./questions/questions.doc.ts";
import { Router } from "../common/types/router.types.ts";
import {
  createQuiz,
  createQuizQuestion,
  getAllQuizzes,
  getQuiz,
} from "./quizzes/quiz.doc.ts";

class DocRouter implements Router<OpenAPIHono> {
  getRouter() {
    const app = new OpenAPIHono();

    app.openapi(createQuestionOption, (c) => {
      const id = c.req.valid("param").questionId;

      return c.json({
        description: "Description",
        question_id: id,
        id: 1,
        message: "Error creating Option",
        is_correct: true,
      });
    });

    app.openapi(createQuizQuestion, (c) => {
      const id = c.req.valid("param").quizId;

      return c.json({
        id: 1,
        quiz_id: id,
        title: "Test",
        message: "Create question",
      });
    });

    app.openapi(getAllQuizzes, (c) => {
      return c.json({
        message: "Getting all quizzes",
      });
    });

    app.openapi(getQuiz, (c) => {
      const id = c.req.valid("param").quizId;

      return c.json({
        message: `Quiz ${id} found`,
      });
    });

    app.openapi(createQuiz, (c) => {
      return c.json({
        id: 1,
        name: "Example name",
        subject: "Example subject",
        image_id: null,
      });
    });

    app.get(
      "/ui",
      swaggerUI({
        url: "/v1/doc",
      }),
    );

    app.doc("/", {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Quiz API",
      },
    });

    return app;
  }
}

export default DocRouter;
