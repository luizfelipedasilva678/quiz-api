import { Router } from "../../common/types/router.types.ts";
import { Hono } from "../../../../deps/deps.ts";
import DocRouter from "../../doc/doc.route.ts";
import OptionController from "../../option/controllers/option.controller.ts";
import QuestionController from "../../questions/controllers/question.controller.ts";
import QuestionRouter from "../../questions/routes/questions.route.ts";
import QuizController from "../../quiz/controllers/quiz.controller.ts";
import QuizRouter from "../../quiz/routes/quizzes.route.ts";

class AppV1Router implements Router<Hono> {
  constructor(
    private readonly questionController: QuestionController,
    private readonly optionController: OptionController,
    private readonly quizController: QuizController,
  ) {}

  getRouter() {
    const app = new Hono();
    const baseUrl = Deno.env.get("BASE_URL");
    const docRuoter = new DocRouter();
    const questionRouter = new QuestionRouter(this.optionController);
    const quizRouter = new QuizRouter(
      this.questionController,
      this.quizController,
    );

    app.route("/doc", docRuoter.getRouter() as unknown as Hono);
    app.route("/quizzes", quizRouter.getRouter());
    app.route("/questions", questionRouter.getRouter());

    app.get("/", (c) => {
      return c.json({
        quizzes: `${baseUrl}/v1/quizzes`,
        questions: `${baseUrl}/v1/questions`,
        doc: `${baseUrl}/v1/doc`,
        swaggerUi: `${baseUrl}/v1/doc/ui`,
      });
    });

    return app;
  }
}

export default AppV1Router;
