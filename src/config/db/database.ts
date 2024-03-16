import { Client } from "../../../deps/deps.ts";

class Database {
  private static client: Client | null = null;

  private constructor() {}

  static async getClient() {
    if (Database.client === null) {
      Database.client = new Client(Deno.env.get("CONN_STRING"));
      await Database.client.connect();
    }

    return Database.client;
  }
}

export default Database;
