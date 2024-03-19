import { Client, Hono, HTTPException } from "../../deps/deps.ts";
import quizRoute from "./quizzes/quizzes.route.ts";
import questionRoute from "./questions/questions.route.ts";
import QuestionControllerFactory from "../factories/question/question-controller.factory.ts";
import OptionControllerFactory from "../factories/option/option-controller.factory.ts";
import QuizControllerFactory from "../factories/quiz/quiz-controller.factory.ts";

export default function app(client: Client) {
  const app = new Hono();
  const baseUrl = Deno.env.get("BASE_URL");
  const questionController = QuestionControllerFactory.makeController(client);
  const optionController = OptionControllerFactory.makeController(client);
  const quizController = QuizControllerFactory.makeController(client);

  app.route("/quizzes", quizRoute(questionController, quizController));
  app.route("/questions", questionRoute(optionController));

  app.get("/", (c) => {
    return c.json({
      quizzes: `${baseUrl}/quizzes`,
      questions: `${baseUrl}/questions`,
    });
  });

  app.notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
  });

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ message: err.message }, err.status);
    }

    return c.json({ message: err.message }, 500);
  });

  return app;
}
