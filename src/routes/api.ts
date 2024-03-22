import quizRoute from "../modules/quiz/routes/quizzes.route.ts";
import docRuote from "../modules/doc/doc.route.ts";
import questionRoute from "../modules/questions/routes/questions.route.ts";
import QuestionControllerFactory from "../modules/questions/factories/question-controller.factory.ts";
import OptionControllerFactory from "../modules/option/factories/option-controller.factory.ts";
import QuizControllerFactory from "../modules/quiz/factories/quiz-controller.factory.ts";
import {
  Client,
  cors,
  Hono,
  HTTPException,
  logger,
  prettyJSON,
  secureHeaders,
} from "../../deps/deps.ts";

export default function app(client: Client) {
  const app = new Hono();
  const baseUrl = Deno.env.get("BASE_URL");
  const questionController = QuestionControllerFactory.makeController(client);
  const optionController = OptionControllerFactory.makeController(client);
  const quizController = QuizControllerFactory.makeController(client);

  app.use("*", secureHeaders());
  app.use("*", logger());
  app.use("*", prettyJSON());
  app.use(
    "*",
    cors(),
  );

  // @ts-expect-error - workaround for the lack of type definitions
  app.route("/v1/doc", docRuote);
  app.route("/v1/quizzes", quizRoute(questionController, quizController));
  app.route("/v1/questions", questionRoute(optionController));

  app.get("/", (c) => {
    return c.json({
      v1: `${baseUrl}/v1`,
    });
  });

  app.get("/v1", (c) => {
    return c.json({
      quizzes: `${baseUrl}/v1/quizzes`,
      questions: `${baseUrl}/v1/questions`,
      doc: `${baseUrl}/v1/doc`,
      swaggerUi: `${baseUrl}/v1/doc/ui`,
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
