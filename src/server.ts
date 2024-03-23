import setEnvs from "./config/env/setEnvs.ts";
import Database from "./config/db/database.ts";
import App from "./modules/app/app.ts";
import CronJobRemoveExpiredQuizzes from "./jobs/cron/remove-expired-quizzes.ts";
import { Logger } from "../deps/deps.ts";

async function start() {
  const logger = new Logger();

  try {
    if (Deno.env.get("ENV") === "development") {
      await setEnvs();
    }

    const client = Database.getClient();
    await client.connect();

    const app = new App(client);
    const cronJobRemoveExpiredQuizzes = new CronJobRemoveExpiredQuizzes(client);

    Deno.serve(app.getRouter().fetch);
    cronJobRemoveExpiredQuizzes.start();
  } catch (e) {
    logger.error(e.message);
  }
}

start();
