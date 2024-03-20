import setEnvs from "./config/env/setEnvs.ts";
import Database from "./config/db/database.ts";

async function start() {
  if (Deno.env.get("ENV") === "development") {
    await setEnvs();
  }

  const app = (await import("./routes/api.ts")).default;
  const cronJobRemoveExpiredQuizzes =
    (await import("./jobs/cron/remove-expired-quizzes.ts")).default;

  const client = Database.getClient();
  await client.connect();
  Deno.serve(app(client).fetch);
  cronJobRemoveExpiredQuizzes(client);
}

start();
