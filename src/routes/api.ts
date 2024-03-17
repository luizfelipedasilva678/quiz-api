import { Client, Hono } from "../../deps/deps.ts";
import quizRouter from "./quiz/quiz.router.ts";

export default function app(client: Client) {
  const app = new Hono();

  app.route("/quizzes", quizRouter(client));

  return app;
}
