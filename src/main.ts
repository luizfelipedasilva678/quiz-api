import setEnvs from "./config/env/setEnvs.ts";
import Database from "./config/db/database.ts";

async function start() {
  await setEnvs();
  const client = await Database.getClient();

  console.log("Connected to the database? ", client.connected);
}

start();
