import OptionControllerFactory from "../option/factories/option-controller.factory.ts";
import QuestionControllerFactory from "../questions/factories/question-controller.factory.ts";
import QuizControllerFactory from "../quiz/factories/quiz-controller.factory.ts";
import AppV1 from "./v1/app.v1.ts";
import { Router } from "../common/types/router.types.ts";
import {
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_METHOD_NOT_ALLOWED_MESSAGE,
} from "../common/helpers/constants.ts";
import {
  Client,
  cors,
  Hono,
  HTTPException,
  logger,
  prettyJSON,
  secureHeaders,
} from "../../../deps/deps.ts";

const rateLimit = {
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again after 1 minute.",
};

const requestTimestamps: Map<string, number[]> = new Map();

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

    app.use(async (c, next) => {
      const ip = c.env!.clientIp as string;
      const now = Date.now();
      const timestamps = requestTimestamps.get(ip) || [];

      while (timestamps.length && timestamps[0] <= now - rateLimit.windowMs) {
        timestamps.shift();
      }

      timestamps.push(now);
      requestTimestamps.set(ip, timestamps);

      if (timestamps.length > rateLimit.max) {
        throw new HTTPException(429, { message: rateLimit.message });
      }

      await next();
    });
    app.use(secureHeaders());
    app.use(logger());
    app.use(prettyJSON());
    app.use(cors());

    app.route("/v1", appV1.getRouter());
    app.get("/v1", (c) => {
      return c.json({
        quizzes: `${baseUrl}/v1/quizzes`,
        questions: `${baseUrl}/v1/questions`,
        doc: `${baseUrl}/v1/doc`,
        swaggerUi: `${baseUrl}/v1/doc/ui`,
      });
    }).all(() => {
      throw new HTTPException(HTTP_METHOD_NOT_ALLOWED, {
        message: HTTP_METHOD_NOT_ALLOWED_MESSAGE,
      });
    });

    app.get("/", (c) => {
      return c.json({
        v1: `${baseUrl}/v1`,
      });
    }).all(() => {
      throw new HTTPException(HTTP_METHOD_NOT_ALLOWED, {
        message: HTTP_METHOD_NOT_ALLOWED_MESSAGE,
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
