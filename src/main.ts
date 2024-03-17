import setEnvs from "./config/env/setEnvs.ts";
import Database from "./config/db/database.ts";
import app from "./routes/api.ts";

async function start() {
  if (Deno.env.get("ENV") === "development") {
    await setEnvs();
  }

  const client = Database.getClient();
  await client.connect();
  Deno.serve(app(client).fetch);
}

start();
