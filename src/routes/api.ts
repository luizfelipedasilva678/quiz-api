import { Client, Hono, HTTPException } from "../../deps/deps.ts";
import quizRoute from "./quizzes/quizzes.route.ts";
import questionRoute from "./questions/questions.route.ts";

export default function app(client: Client) {
  const app = new Hono();
  const baseUrl = Deno.env.get("BASE_URL");

  app.route("/quizzes", quizRoute(client));
  app.route("/questions", questionRoute(client));

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
