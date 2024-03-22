import OptionControllerFactory from "../option/factories/option-controller.factory.ts";
import QuestionControllerFactory from "../questions/factories/question-controller.factory.ts";
import QuizControllerFactory from "../quiz/factories/quiz-controller.factory.ts";
import AppV1 from "./v1/app.v1.ts";
import { Router } from "../common/types/router.types.ts";
import {
  Client,
  cors,
  Hono,
  HTTPException,
  logger,
  prettyJSON,
  secureHeaders,
} from "../../../deps/deps.ts";

class App implements Router<Hono> {
  constructor(private client: Client) {}

  getRouter() {
    const app = new Hono();
    const baseUrl = Deno.env.get("BASE_URL");
    const questionController = QuestionControllerFactory.makeController(
      this.client,
    );
    const optionController = OptionControllerFactory.makeController(
      this.client,
    );
    const quizController = QuizControllerFactory.makeController(this.client);
    const appV1 = new AppV1(
      questionController,
      optionController,
      quizController,
    );

    app.use("*", secureHeaders());
    app.use("*", logger());
    app.use("*", prettyJSON());
    app.use(
      "*",
      cors(),
    );
    app.route("/v1", appV1.getRouter());

    app.get("/", (c) => {
      return c.json({
        v1: `${baseUrl}/v1`,
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
}

export default App;
