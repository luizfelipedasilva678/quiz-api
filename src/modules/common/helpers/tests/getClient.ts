import Database from "../../../../config/db/database.ts";

export default async function getClient() {
  const client = Database.getClient();
  await client.connect();

  return client;
}
