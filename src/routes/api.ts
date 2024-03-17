import { Client, Hono } from "../../deps/deps.ts";
import quizRouter from "./quizzes/quizzes.router.ts";

export default function app(client: Client) {
  const app = new Hono();
  const baseUrl = Deno.env.get("BASE_URL");

  app.route("/quizzes", quizRouter(client));

  app.get("/", (c) => {
    return c.json({ quizzes: `${baseUrl}/quizzes` });
  });

  app.onError((err, c) => {
    return c.json({ message: err.message }, 500);
  });

  return app;
}
