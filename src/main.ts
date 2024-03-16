import setEnvs from "./config/env/setEnvs.ts";
import Database from "./config/db/database.ts";
import ImageRepository from "./repositories/image-rdb.repository.ts";

async function start() {
  await setEnvs();
  const client = await Database.getClient();
  const imageRepository = new ImageRepository(client);

  console.log("Connected to the database? ", client.connected);
  console.log(imageRepository);
}

start();
