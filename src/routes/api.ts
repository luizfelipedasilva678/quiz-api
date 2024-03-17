import { Client, Hono } from "../../deps/deps.ts";
import quizRouter from "./quizzes/quizzes.router.ts";
import questionRouter from "./questions/questions.router.ts";

export default function app(client: Client) {
  const app = new Hono();
  const baseUrl = Deno.env.get("BASE_URL");

  app.route("/quizzes", quizRouter(client));
  app.route("/questions", questionRouter(client));

  app.get("/", (c) => {
    return c.json({
      quizzes: `${baseUrl}/quizzes`,
      questions: `${baseUrl}/questions`,
    });
  });

  app.onError((err, c) => {
    return c.json({ message: err.message }, 500);
  });

  return app;
}
